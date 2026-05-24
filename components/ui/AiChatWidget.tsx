"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "How does MarketBridge work?",
  "What are the readiness levels?",
  "Where do funders sign in?",
  "How do I document ESG activity?",
];

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Asha — your guide to BHAF MarketBridge. Ask me anything about the platform, the roles, or how to get visible to funders and buyers.",
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setIsStreaming(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const reason =
          payload?.message ?? "The assistant is offline right now. Please try again shortly.";
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: reason };
          return copy;
        });
        setError(reason);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not reach the assistant.";
      setError(message);
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: message };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Asha" : "Open Asha — MarketBridge AI assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-soft transition hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 md:bottom-6 md:right-6"
      >
        <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-70" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-gold-400" />
        </span>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12Z" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-3 z-50 flex w-[min(94vw,380px)] flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-soft md:right-6">
          <header className="flex items-center justify-between gap-3 bg-gradient-to-r from-forest-900 to-forest-800 px-4 py-3 text-cream-50">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-400 font-serif text-forest-900">
                A
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Asha</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-gold-300">MarketBridge AI</p>
              </div>
            </div>
            <span className="text-[10px] text-cream-100/70">{isStreaming ? "Typing…" : "Online"}</span>
          </header>

          <div ref={scrollRef} className="max-h-[55vh] min-h-[260px] flex-1 space-y-3 overflow-y-auto bg-cream-50 px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === "user" ? "ml-8 text-right" : "mr-4"}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "inline-block max-w-[88%] rounded-2xl rounded-tr-md bg-forest-800 px-3.5 py-2 text-left text-sm leading-snug text-cream-50"
                      : "inline-block max-w-[92%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2 text-left text-sm leading-snug text-charcoal-700 shadow-card"
                  }
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-300 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-300 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-300" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {messages.length <= 1 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal-400">
                  Try asking
                </p>
                {SUGGESTED_PROMPTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block w-full rounded-lg border border-cream-200 bg-white px-3 py-2 text-left text-xs text-forest-900 transition hover:border-forest-700 hover:bg-forest-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-cream-200 bg-white px-3 py-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isStreaming ? "Asha is typing…" : "Ask about MarketBridge…"}
              className="flex-1 rounded-lg border border-cream-200 bg-cream-50 px-3 py-2 text-sm text-forest-900 placeholder:text-charcoal-400 focus:border-forest-700 focus:outline-none"
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="rounded-lg bg-forest-800 px-3 py-2 text-xs font-medium text-cream-50 transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

          {error && (
            <p className="border-t border-cream-100 bg-cream-50 px-3 py-2 text-[11px] text-charcoal-500">
              {error}
            </p>
          )}
        </div>
      )}
    </>
  );
}
