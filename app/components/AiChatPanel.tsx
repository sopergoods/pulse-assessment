"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setDraft("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection lost..." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-full max-w-md flex-col bg-zinc-950 text-zinc-100 shadow-2xl border-l border-zinc-800/60">
      <header className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-purple-400" />
          <div>
            <p className="font-semibold text-sm">AI Stranger</p>
            <p className="text-xs text-zinc-500">Anonymous · AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs hover:border-zinc-500 transition"
        >
          Close
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-600">
            You connected with an anonymous stranger...
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <span
              className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-400 text-zinc-950 rounded-br-sm"
                  : "bg-zinc-800 text-zinc-100 rounded-bl-sm"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="bg-zinc-800 text-zinc-400 rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
              ...
            </span>
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex gap-2 border-t border-zinc-800/60 p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say something..."
          disabled={loading}
          className="flex-1 rounded-full bg-zinc-900 px-4 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:ring-1 focus:ring-purple-400 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={loading || !draft.trim()}
          className="rounded-full bg-purple-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-30 transition hover:bg-purple-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}