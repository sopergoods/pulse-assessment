"use client";

import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
}

export default function ChatPanel({
  messages,
  connected,
  videoBusy,
  onSend,
  onStartVideo,
  onEnd,
}: {
  messages: ChatMessage[];
  connected: boolean;
  videoBusy: boolean;
  onSend: (text: string) => void;
  onStartVideo: () => void;
  onEnd: () => void;
}) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !connected) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="chat-panel-enter absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col bg-zinc-950 text-zinc-100 shadow-2xl border-l border-zinc-800/60">
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div>
            <p className="font-semibold text-sm">Stranger</p>
            <p className="text-xs text-zinc-500">
              {connected ? "Connected" : "Connecting..."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onStartVideo}
            disabled={!connected || videoBusy}
            className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs hover:border-zinc-500 hover:text-white disabled:opacity-30 transition"
          >
            Video
          </button>
          <button
            onClick={onEnd}
            className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-400 transition"
          >
            End
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-600">
            Say hello. Messages are peer-to-peer and never stored.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.mine
                  ? "bg-emerald-400 text-zinc-950 rounded-br-sm"
                  : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="flex gap-2 border-t border-zinc-800/60 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={connected ? "Type a message..." : "Connecting..."}
          disabled={!connected}
          className="flex-1 rounded-full bg-zinc-900 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-emerald-400 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!connected || !draft.trim()}
          className="rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-30 transition hover:bg-emerald-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}