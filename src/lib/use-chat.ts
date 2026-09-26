"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  toChatMessages,
  type ChatDocLike,
  type ChatMessage,
} from "@/lib/chat-messages";
import type { User } from "firebase/auth";

export type { ChatMessage } from "@/lib/chat-messages";

const MESSAGES_COLLECTION = "chat_messages";
const MESSAGE_LIMIT = 120;

/* ── Hook ── */

export function useChat(user: User | null) {
  // Starts settled when unconfigured: stay empty rather than subscribing to
  // a database that isn't there.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState<string | null>(null);

  /* Live listener — the newest N messages, ordered newest-first so the limit
     keeps recent activity; `toChatMessages` restores reading order.

     Gated on `user`: firestore.rules denies anonymous reads, so subscribing
     while signed out would only earn a permission-denied error. */
  useEffect(() => {
    if (!db || !user) return;

    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(MESSAGE_LIMIT)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Firestore is schemaless, so the snapshot arrives as untyped
        // DocumentData. firestore.rules validates the shape on write (see
        // firestore.rules), which is what makes this single cast sound.
        setMessages(
          toChatMessages(snapshot.docs as unknown as ChatDocLike[])
        );
        setLoading(false);
      },
      (err) => {
        // Without this callback Firestore throws the failure unhandled —
        // e.g. permission-denied when the rules or deployment change.
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  /* Send a new message. */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!db || !user || !text.trim()) return;
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        uid: user.uid,
        displayName: user.displayName ?? "Anonymous",
        photoURL: user.photoURL,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
    },
    [user]
  );

  return { messages, loading, error, sendMessage };
}
