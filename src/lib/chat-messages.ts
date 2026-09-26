/**
 * Chat message shapes and pure snapshot mapping.
 *
 * Kept separate from `use-chat.ts` so the mapping can be unit tested without
 * importing the Firebase SDK (which initialises the app on load). Only
 * `import type` is used here, so this module has no runtime dependencies.
 */

import type { Timestamp } from "firebase/firestore";

/* ── Chat message shape ── */

export interface ChatMessage {
  id: string;
  uid: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: Date;
}

/** Raw Firestore document shape (timestamp may be null until server fills). */
export interface ChatDoc {
  uid: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: Timestamp | null;
}

/**
 * Minimal structural view of a Firestore query snapshot document, so the
 * mapping can be exercised with plain objects.
 */
export interface ChatDocLike {
  id: string;
  data: () => ChatDoc;
}

/* ── Mapping ── */

/**
 * Turn snapshot documents into chat messages, oldest first.
 *
 * The listener queries newest-first (see `useChat`) so Firestore's `limit`
 * keeps the most recent `MESSAGE_LIMIT` documents rather than the oldest —
 * an ascending query with a limit pins the room to its first 120 messages
 * and hides everything sent afterwards. This reverses the snapshot back into
 * reading order for rendering.
 */
export function toChatMessages(docs: ChatDocLike[]): ChatMessage[] {
  return docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        displayName: data.displayName,
        photoURL: data.photoURL,
        text: data.text,
        createdAt: data.createdAt?.toDate() ?? new Date(),
      };
    })
    .reverse();
}
