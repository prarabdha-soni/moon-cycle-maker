import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ProfileIcon } from "@/components/ProfileIcon";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — Petal" },
      { name: "description", content: "Your personal AI cycle coach." },
    ],
  }),
  component: CoachScreen,
});

type Msg = { role: "bot" | "user"; text: string };

const INITIAL_MESSAGES: Msg[] = [
  {
    role: "bot",
    text: "Hi! 👋 I'm Petal AI, your personal cycle coach. Ask me anything about your period, hormones, fertility, or how to feel your best every day.",
  },
];

const SUGGESTIONS = [
  "Why do I feel tired before my period?",
  "What foods help with cramps?",
  "When is my fertile window?",
  "How does stress affect my cycle?",
];

// Offline / fallback replies used when the API is unreachable
const BOT_REPLIES: Record<string, string> = {
  "Why do I feel tired before my period?":
    "During the luteal phase, progesterone rises sharply which has a sedating effect on the brain. Combined with a dip in serotonin, this can leave you feeling drained 3–7 days before your period. 💤 Try iron-rich foods, gentle movement, and prioritising sleep.",
  "What foods help with cramps?":
    "Anti-inflammatory foods are your best friend! 🥦 Omega-3s (salmon, flaxseed), magnesium (dark chocolate, leafy greens), and ginger tea can all reduce prostaglandins — the compounds that cause cramping.",
  "When is my fertile window?":
    "Your fertile window is roughly 5 days before ovulation plus ovulation day itself. For a 28-day cycle that's usually days 10–15. 🌿 Sperm can live up to 5 days, so timing in this range gives you the best chance.",
  "How does stress affect my cycle?":
    "Chronic stress raises cortisol, which disrupts the hypothalamic-pituitary-ovarian axis — the control centre for your cycle. This can delay ovulation, shorten your luteal phase, or even cause a missed period. 🧘",
};

function toAPIMessages(msgs: Msg[]) {
  return msgs
    .slice(1) // skip welcome greeting
    .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
}

/** Fetch with a 15-second hard timeout so the app never hangs */
async function fetchAIReply(history: Msg[]): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toAPIMessages(history) }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const { reply } = await res.json();
    return reply as string;
  } finally {
    clearTimeout(timer);
  }
}

function CoachScreen() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    const userMsg: Msg = { role: "user", text: trimmed };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setTyping(true);

    try {
      const reply = await fetchAIReply(updatedHistory);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      // Timeout: give a clear message rather than a generic error
      const isTimeout = err instanceof Error && err.name === "AbortError";
      const botReply = isTimeout
        ? "The AI is taking too long right now. Please try again in a moment. 🌸"
        : (BOT_REPLIES[trimmed] ?? "That's a great question! Cycle health is deeply personal. Track your symptoms for a few cycles — patterns reveal a lot. 🌸");
      setMessages((m) => [...m, { role: "bot", text: botReply }]);
    } finally {
      // Always unblock the input — no matter what happens above
      setTyping(false);
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    // Custom layout — must fill the full viewport so the input bar sits above the BottomNav.
    // h-dvh with h-screen fallback covers iOS Safari ≤ 15 which doesn't support dvh.
    <div
      className="mx-auto flex max-w-md flex-col bg-background"
      style={{ height: "100dvh" } as React.CSSProperties}
    >

      {/* Header — matches AppShell style */}
      <header className="shrink-0 flex items-center justify-between px-5 pt-6 pb-2">
        <ProfileIcon />
        <h1 className="font-display text-[17px] font-medium tracking-tight text-foreground">
          AI Coach
        </h1>
        <span className="size-9" aria-hidden />
      </header>

      {/* Hero banner */}
      <div className="shrink-0 mx-5 mt-1 mb-2 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-period/10 via-fertile/10 to-ovulation/10 border border-period/15 px-4 py-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-period/15">
          <Sparkles className="size-4 text-period" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-foreground">Petal AI Coach</p>
          <p className="text-[11px] text-muted-foreground">Powered by DeepSeek · Always private</p>
        </div>
      </div>

      {/* Messages — scrollable, fills all remaining space */}
      <div className="flex-1 overflow-y-auto px-5 space-y-3 py-2">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "bot" && (
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-period/15 mt-1">
                <Bot className="size-3.5 text-period" strokeWidth={2} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                m.role === "bot"
                  ? "bg-card border border-border text-foreground rounded-tl-sm"
                  : "bg-period text-white rounded-tr-sm"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2 justify-start">
            <div className="grid size-7 shrink-0 place-items-center rounded-full bg-period/15 mt-1">
              <Bot className="size-3.5 text-period" strokeWidth={2} />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {showSuggestions && !typing && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-period/30 bg-period/6 px-3 py-1.5 text-[12px] font-medium text-period transition-colors hover:bg-period/12"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar — sits just above the fixed BottomNav (~70 px) */}
      <div className="shrink-0 px-5 pt-2 pb-[76px] border-t border-border bg-background">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask anything about your cycle…"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className="grid size-8 place-items-center rounded-full bg-period text-white disabled:opacity-30 transition-opacity active:scale-95"
          >
            <Send className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* BottomNav — fixed, rendered here since we skip AppShell */}
      <BottomNav />
    </div>
  );
}
