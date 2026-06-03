import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — SheThrives" },
      { name: "description", content: "Your personal AI cycle coach." },
    ],
  }),
  component: CoachScreen,
});

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const GOLD = "#D99B57";
type Mode = "regular" | "pcos" | "conceive";
type Msg = { role: "bot" | "user"; text: string };

function getContext(): { mode: Mode; name: string } {
  if (typeof window === "undefined") return { mode: "regular", name: "" };
  return {
    mode: (window.localStorage.getItem("petal:mode") as Mode) || "regular",
    name: window.localStorage.getItem("petal:name") || "",
  };
}

const CHIPS: Record<Mode, string[]> = {
  conceive: ["When am I most fertile?", "Foods that boost fertility", "Is my BBT shift normal?"],
  pcos: ["Why is my cycle so long?", "Best supplements for PCOS", "How to ease a flare-up"],
  regular: ["Why do I feel low energy?", "What does my phase mean?", "Tips for less cramping"],
};

const INTROS: Record<Mode, string> = {
  conceive: "You're in your fertile window — the next two days are your best chance. Your temperature shift this morning lines up beautifully. Want a few gentle things that can help?",
  pcos: "Your cycle running long is very common with PCOS and usually nothing to worry about. Logging symptoms helps us spot your patterns. What's on your mind today?",
  regular: "You're in your follicular phase, so it's normal to feel more energetic and social right now. Anything you'd like to understand about how you're feeling?",
};

const REPLIES: Record<Mode, string> = {
  conceive: "Aim for intimacy today and tomorrow, stay hydrated, and keep stress low — short walks and good sleep matter more than people expect.",
  pcos: "Focus on balanced meals with protein and fibre, gentle movement, and consistent sleep. These steady your insulin, which steadies your cycle over time.",
  regular: "Your energy peaks now thanks to rising estrogen. Use it for the things that need focus — and lean into rest later when progesterone rises.",
};

function Bubble({ me, text, accent }: { me: boolean; text: string; accent: string }) {
  if (me) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <div style={{ maxWidth: "78%", padding: "12px 15px", fontSize: 14.5, lineHeight: 1.5, borderRadius: "20px 20px 6px 20px", background: accent, color: "#fff", boxShadow: `0 6px 16px rgba(226,109,138,.28)` }}>
          {text}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${accent},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 9, flexShrink: 0, alignSelf: "flex-end", fontSize: 14 }}>
        ✨
      </div>
      <div style={{ maxWidth: "78%", padding: "12px 15px", fontSize: 14.5, lineHeight: 1.5, borderRadius: "20px 20px 20px 6px", background: "#fff", color: "#2E2329", border: "1px solid #F6ECE8", boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)" }}>
        {text}
      </div>
    </div>
  );
}

function CoachScreen() {
  const ctx = getContext();
  const [mode] = useState<Mode>(ctx.mode);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: INTROS[ctx.mode] },
    { role: "user", text: CHIPS[ctx.mode][0] },
    { role: "bot", text: `Great question. ${REPLIES[ctx.mode]}` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const modeLabel = mode === "pcos" ? "PCOS" : mode === "conceive" ? "Conceive" : "Regular";

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...msgs.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: text },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.content || data.message || "I'm here to help — could you tell me a bit more?";
      setMsgs(p => [...p, { role: "bot", text: reply }]);
    } catch {
      setMsgs(p => [...p, { role: "bot", text: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "calc(100vh - 88px)", overflow: "hidden", background: "linear-gradient(180deg,#FCF5F2,#FBF3F0)" }}>
        {/* Header */}
        <div style={{ padding: "58px 20px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F6ECE8", background: "rgba(255,255,255,.6)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 26px rgba(180,100,120,.10)", fontSize: 24 }}>
            ✨
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2E2329" }}>Your Coach</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#578A70", fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7FB59A" }} />
              Knows your {modeLabel.toLowerCase()} context
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={msgsRef} style={{ flex: 1, overflowY: "auto", padding: "20px 18px 8px" }}>
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#A89AA0", marginBottom: 18 }}>Today</div>
          {msgs.map((m, i) => <Bubble key={i} me={m.role === "user"} text={m.text} accent={ACCENT} />)}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${ACCENT},${GOLD})`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 9, flexShrink: 0, alignSelf: "flex-end", fontSize: 14 }}>✨</div>
              <div style={{ padding: "12px 18px", background: "#fff", borderRadius: "20px 20px 20px 6px", border: "1px solid #F6ECE8", boxShadow: "0 1px 2px rgba(70,35,48,.04)" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#F0E2DE", animation: `breathe 1.3s ease-in-out ${i*0.22}s infinite` }}/>)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div style={{ padding: "10px 16px 14px", borderTop: "1px solid #F6ECE8", background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 2 }}>
            {CHIPS[mode].map(c => (
              <button key={c} onClick={() => send(c)}
                style={{ flexShrink: 0, background: "#fff", color: "#705F66", border: "1px solid #F0E2DE", fontWeight: 600, fontSize: 13.5, padding: "9px 15px", borderRadius: 999, whiteSpace: "nowrap", cursor: "pointer", fontFamily: "inherit" }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #F0E2DE", borderRadius: 999, padding: "7px 7px 7px 18px", boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask anything…"
              style={{ flex: 1, fontSize: 14.5, color: "#2E2329", background: "none", border: "none", outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px rgba(226,109,138,.28)`, cursor: "pointer", opacity: input.trim() ? 1 : 0.5 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M5 12l14-7-5 14-2.5-5.5L5 12Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
