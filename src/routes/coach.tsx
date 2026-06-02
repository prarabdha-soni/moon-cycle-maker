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

function getContext(): string {
  if (typeof window === "undefined") return "";
  const mode = window.localStorage.getItem("petal:mode") ?? "regular";
  const lastPeriod = window.localStorage.getItem("petal:lastPeriod");
  const cycleLength = window.localStorage.getItem("petal:cycleLength") ?? "28";
  const name = window.localStorage.getItem("petal:name");

  let daysSince = "";
  if (lastPeriod) {
    const d = Math.floor((Date.now() - new Date(lastPeriod).getTime()) / 86400000);
    daysSince = `Day ${d + 1} of cycle`;
  }

  const parts = [
    `User mode: ${mode}`,
    name ? `User name: ${name}` : "",
    daysSince,
    mode !== "pcos" ? `Cycle length: ${cycleLength} days` : "Irregular PCOS cycle",
  ].filter(Boolean);

  return parts.join(", ");
}

const PCOS_SUGGESTIONS = [
  "Why is my PCOS cycle so irregular?",
  "What Indian foods help PCOS?",
  "How does stress worsen PCOS?",
  "Can I get pregnant with PCOS?",
];

const REGULAR_SUGGESTIONS = [
  "Why do I feel tired before my period?",
  "What foods help with cramps?",
  "When is my fertile window?",
  "How does stress affect my cycle?",
];

const INITIAL_MESSAGES: Msg[] = [
  {
    role: "bot",
    text: "Hi! 👋 I'm Petal AI, your personal cycle coach. Ask me anything about your period, hormones, fertility, or how to feel your best every day.",
  },
];

const BOT_REPLIES: Record<string, string> = {
  "Why do I feel tired before my period?":
    "During the luteal phase, progesterone rises sharply which has a sedating effect on the brain. Combined with a dip in serotonin, this can leave you feeling drained 3–7 days before your period. 💤 Try iron-rich foods, gentle movement, and prioritising sleep.",
  "What foods help with cramps?":
    "Anti-inflammatory foods are your best friend! 🥦 Omega-3s (salmon, flaxseed), magnesium (dark chocolate, leafy greens), and ginger tea can all reduce prostaglandins — the compounds that cause cramping.",
  "When is my fertile window?":
    "Your fertile window is roughly 5 days before ovulation plus ovulation day itself. For a 28-day cycle that's usually days 10–15. 🌿 Sperm can live up to 5 days, so timing in this range gives you the best chance.",
  "How does stress affect my cycle?":
    "Chronic stress raises cortisol, which disrupts the hypothalamic-pituitary-ovarian axis — the control centre for your cycle. This can delay ovulation, shorten your luteal phase, or even cause a missed period. 🧘",
  "Why is my PCOS cycle so irregular?":
    "With PCOS, the ovaries produce excess androgens (male hormones) which disrupt the normal follicle maturation process. This delays or prevents ovulation, causing cycles that can range from 25 to 90+ days. 🌿 Tracking symptoms over time helps you find your personal pattern — many women with PCOS do have a rhythm, just longer than average.",
  "What Indian foods help PCOS?":
    "Several traditional Indian ingredients are clinically shown to help PCOS: 🌿 **Methi (fenugreek)** seeds improve insulin sensitivity — soak 1 tsp overnight and eat on an empty stomach. **Jeera (cumin)** water reduces testosterone. **Haldi (turmeric)** reduces inflammation. **Karela (bitter gourd)** helps blood sugar regulation. Avoid maida, white rice in excess, and refined sugar.",
  "How does stress worsen PCOS?":
    "Stress triggers cortisol release, which directly raises insulin levels and androgens — the two key drivers of PCOS. High cortisol also suppresses progesterone, making cycles more irregular. 🧘 Yoga, pranayama, and 7–8 hours of sleep are among the most effective interventions for PCOS management.",
  "Can I get pregnant with PCOS?":
    "Yes — absolutely. 🌸 PCOS affects ovulation timing but most women with PCOS can conceive naturally or with minimal support. Tracking your cycle, maintaining a healthy weight, and reducing insulin resistance (through diet and exercise) significantly improve chances. Switch to Conceive mode in Petal for fertility-focused tracking tools.",
};

const FALLBACK =
  "That's a great question! Cycle health is deeply personal. Track your symptoms for a few cycles — patterns reveal a lot. 🌸";

function toAPIMessages(msgs: Msg[], context: string) {
  const systemContent = `You are Petal AI, a compassionate women's health coach specialising in menstrual cycles, PCOS, fertility, and hormonal health. Current user context: ${context}. Give warm, evidence-based, concise answers. When relevant, mention Indian dietary and Ayurvedic options. Always note that your responses are educational, not medical advice.`;
  return [
    { role: "system", content: systemContent },
    ...msgs.slice(1).map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
  ];
}

async function callAPI(history: Msg[], context: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toAPIMessages(history, context) }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`http_${res.status}`);

    const data = (await res.json()) as { reply?: unknown };
    if (typeof data.reply !== "string" || !data.reply) throw new Error("bad_reply");
    return data.reply;
  } catch (err) {
    clearTimeout(timeoutId);
    // Translate abort → "timeout" so the caller can detect it
    if (err instanceof Error && err.name === "AbortError") throw new Error("timeout");
    throw err;
  }
}

function CoachScreen() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [context] = useState(() => getContext());
  const [isPcos] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("petal:mode") === "pcos";
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typingRef.current) return;

    typingRef.current = true;
    setTyping(true);
    setInput("");

    const history = [...messages, { role: "user" as const, text: trimmed }];
    setMessages(history);

    try {
      const reply = await callAPI(history, context);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      const isTimeout = err instanceof Error && err.message === "timeout";
      const fallback = isTimeout
        ? "The AI is taking too long right now. Please try again in a moment. 🌸"
        : (BOT_REPLIES[trimmed] ?? FALLBACK);
      setMessages((prev) => [...prev, { role: "bot", text: fallback }]);
    } finally {
      typingRef.current = false;
      setTyping(false);
    }
  }

  const suggestions = isPcos ? PCOS_SUGGESTIONS : REGULAR_SUGGESTIONS;
  const showSuggestions = messages.length === 1 && !typing;

  return (
    <div
      className="mx-auto flex max-w-md flex-col bg-background h-screen"
      style={{ height: "100dvh" } as React.CSSProperties}
    >
      {/* Header */}
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

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
          >
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
                  : "bg-period text-white rounded-tr-sm",
              )}
            >
              {String(m.text)}
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

        {showSuggestions && (
          <div className="pt-2 space-y-2">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    isPcos
                      ? "border-pcos/30 bg-pcos/6 text-pcos hover:bg-pcos/12"
                      : "border-period/30 bg-period/6 text-period hover:bg-period/12"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 px-5 pt-2 pb-[76px] border-t border-border bg-background">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Ask anything about your cycle…"
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            onClick={() => void send(input)}
            disabled={!input.trim() || typing}
            className="grid size-8 place-items-center rounded-full bg-period text-white disabled:opacity-30 transition-opacity active:scale-95"
          >
            <Send className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
