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
  type Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "firebase/auth";

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
interface ChatDoc {
  uid: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: Timestamp | null;
}

const MESSAGES_COLLECTION = "chat_messages";
const MESSAGE_LIMIT = 120;

/* ── Hook ── */

export function useChat(user: User | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  /* Live listener — subscribes to the latest N messages, ordered ascending. */
  useEffect(() => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy("createdAt", "asc"),
      limit(MESSAGE_LIMIT)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = snapshot.docs.map((doc) => {
        const data = doc.data() as ChatDoc;
        return {
          id: doc.id,
          uid: data.uid,
          displayName: data.displayName,
          photoURL: data.photoURL,
          text: data.text,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      setMessages(msgs);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /* Send a new message. */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !text.trim()) return;
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

  return { messages, loading, sendMessage };
}
