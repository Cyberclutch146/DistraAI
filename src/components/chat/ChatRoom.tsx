"use client";

import { useRef, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { useAuth } from "@/state/auth-context";
import { useChat, type ChatMessage } from "@/lib/use-chat";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────
   Time formatting — compact, relative for <24 h, date beyond.
   ──────────────────────────────────────────────────────────── */

function formatChatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ────────────────────────────────────────────────────────────
   Inline avatar — photo or initials
   ──────────────────────────────────────────────────────────── */

function Avatar({ displayName, photoURL, size = 32 }: { displayName: string; photoURL: string | null; size?: number }) {
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt={displayName}
        width={size}
        height={size}
        className="rounded-full border border-border-subtle shrink-0"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className="rounded-full bg-accent flex items-center justify-center text-[11px] font-semibold text-[#f6efe3] ring-1 ring-accent/20 shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Single message bubble
   ──────────────────────────────────────────────────────────── */

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-2.5 animate-slide-up",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar displayName={message.displayName} photoURL={message.photoURL} size={34} />

      <div
        className={cn(
          "max-w-[75%] min-w-0 rounded-2xl px-4 py-2.5 shadow-card",
          isOwn
            ? "bg-accent text-[#fbf6ee] rounded-tr-md"
            : "bg-bg-surface border border-border-subtle rounded-tl-md"
        )}
      >
        {!isOwn && (
          <p className="text-[11px] font-semibold text-accent mb-0.5 truncate">
            {message.displayName}
          </p>
        )}
        <p className={cn("text-sm leading-relaxed break-words", isOwn ? "text-[#fbf6ee]" : "text-text-primary")}>
          {message.text}
        </p>
        <p
          className={cn(
            "font-data text-[10px] mt-1",
            isOwn ? "text-[#fbf6ee]/60 text-right" : "text-text-tertiary text-right"
          )}
        >
          {formatChatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Message composer bar
   ──────────────────────────────────────────────────────────── */

function Composer({ onSend }: { onSend: (text: string) => Promise<void> }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    await onSend(text);
    setText("");
    setSending(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border border-border-subtle bg-bg-surface px-4 py-3 text-sm",
            "placeholder:text-text-tertiary text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent",
            "transition-all duration-200",
            "min-h-[44px] max-h-[120px]"
          )}
          style={{ overflowY: text.split("\n").length > 3 ? "auto" : "hidden" }}
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || sending}
        aria-label="Send message"
        className={cn(
          "shrink-0 h-[44px] w-[44px] rounded-xl flex items-center justify-center transition-all duration-200",
          text.trim()
            ? "bg-accent text-[#fbf6ee] shadow-card hover:bg-accent-hover"
            : "bg-bg-surface-hover text-text-tertiary cursor-not-allowed"
        )}
      >
        {sending ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        )}
      </button>
    </form>
  );
}

/* ────────────────────────────────────────────────────────────
   Sign-in gate — shown when user is not authenticated
   ──────────────────────────────────────────────────────────── */

function SignInGate({ onSignIn }: { onSignIn: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      await onSignIn();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-in px-6">
      <div className="h-20 w-20 rounded-full bg-accent-subtle flex items-center justify-center">
        <svg className="h-10 w-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="serif-display text-2xl font-medium tracking-tight mb-2">
          Join the conversation
        </h2>
        <p className="text-sm text-text-secondary max-w-sm">
          Sign in to chat with other disaster responders and community members in real time.
        </p>
      </div>
      <button
        onClick={handleClick}
        disabled={busy}
        className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-3"
      >
        {busy ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Sign in with Google
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Loading skeleton
   ──────────────────────────────────────────────────────────── */

function ChatSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-4 p-5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={cn("flex gap-3 animate-pulse", i % 3 === 0 ? "flex-row-reverse" : "flex-row")}>
          <div className="h-8 w-8 rounded-full bg-bg-surface-hover shrink-0" />
          <div className="space-y-1.5 flex-1 max-w-[60%]">
            <div className="h-3 w-1/4 rounded bg-bg-surface-hover" />
            <div className="h-10 rounded-xl bg-bg-surface-hover" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Online indicator dot
   ──────────────────────────────────────────────────────────── */

function OnlineDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-risk-low opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-risk-low" />
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   Main ChatRoom component
   ──────────────────────────────────────────────────────────── */

export default function ChatRoom() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { messages, loading: chatLoading, sendMessage } = useChat(user);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll when new messages arrive. */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  /* ── Auth loading state ── */
  if (authLoading) {
    return (
      <div className="card-static flex flex-col h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <ChatSkeleton />
      </div>
    );
  }

  /* ── Not signed in ── */
  if (!user) {
    return (
      <div className="card-static flex flex-col h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <SignInGate onSignIn={signIn} />
      </div>
    );
  }

  /* ── Signed-in chat room ── */
  return (
    <div className="card-static flex flex-col h-[calc(100vh-220px)] min-h-[500px] overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-bg-elevated/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <OnlineDot />
            <span className="eyebrow">Live chat</span>
          </div>
          <span className="font-data text-[11px] text-text-tertiary">
            {messages.length} messages
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar displayName={user.displayName ?? "You"} photoURL={user.photoURL} size={28} />
            <span className="text-sm font-medium text-text-primary hidden sm:inline">
              {user.displayName}
            </span>
          </div>
          <button
            onClick={signOut}
            className="btn-ghost px-3 py-1.5 text-xs"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
      >
        {chatLoading ? (
          <ChatSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16 animate-fade-in">
            <div className="h-14 w-14 rounded-full bg-accent-subtle flex items-center justify-center">
              <svg className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.uid === user.uid} />
          ))
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-border-subtle px-5 py-3.5 bg-bg-elevated/30">
        <Composer onSend={sendMessage} />
      </div>
    </div>
  );
}
