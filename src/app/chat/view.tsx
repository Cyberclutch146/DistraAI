"use client";

import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import ChatRoom from "@/components/chat/ChatRoom";

export default function ChatView() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNav activePage="Chat" />

      <main className="flex-1">
        <section className="px-4 sm:px-6 lg:px-8 py-6 mx-auto max-w-[1600px]">
          <div className="max-w-2xl mb-6">
            <p className="eyebrow mb-1">Real-time</p>
            <h1 className="serif-display text-3xl sm:text-4xl font-medium tracking-tight">
              Community chat
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Live disaster-response chat room. Sign in with Google to participate.
            </p>
          </div>

          <div className="max-w-3xl">
            <ChatRoom />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
