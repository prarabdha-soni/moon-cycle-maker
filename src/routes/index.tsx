import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";
import { CycleRing } from "@/components/CycleRing";
import { TodayYogaSection, YogaSequencePlayer, getSequenceForMode } from "@/components/YogaSequencePlayer";
import type { YogaSequence } from "@/components/YogaSequencePlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — SheThrives" },
      { name: "description", content: "Your cycle, understood." },
    ],
  }),
  component: HomeScreen,
});

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const ACCENT_SOFT = "#FBE7EC";
const GOLD = "#D99B57";

const PH = {
  menstrual: "#E26D8A",
  follicular: "#F2B6C4",
  ovulation: "#7FB59A",
  luteal: "#C7B4DF",
};

type Mode = "regular" | "pcos" | "conceive";

const SYMPTOMS = [
  { k: "cramps", ic: "🔥", l: "Cramps" },
  { k: "mood", ic: "😊", l: "Mood" },
  { k: "energy", ic: "⚡", l: "Energy" },
  { k: "sleep", ic: "🌙", l: "Sleep" },
  { k: "bloating", ic: "🌊", l: "Bloating" },
  { k: "spotting", ic: "💧", l: "Spotting" },
  { k: "skin", ic: "✨", l: "Skin" },
  { k: "headache", ic: "ℹ️", l: "Headache" },
];

function safeGet(key: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) ?? fallback;
}

function computeCycle(mode: Mode) {
  const cycleLen = mode === "pcos" ? 35 : 28;
  if (mode === "pcos") {
    return {
      cycleLen,
      day: 31,
      dashed: true,
      top: "Estimated",
      big: "Day 31",
      sub: "Longer than usual — common with PCOS",
      phases: [
        { from: 1, to: 6, color: PH.menstrual },
        { from: 7, to: 35, color: PH.luteal },
      ],
      stats: [["Last period", "31d", "ago"], ["Avg cycle", "~35d", "irregular"], ["Logged", "9", "symptoms"]],
      insight: {
        ic: "🌿",
        eb: "Lifestyle tip",
        t: "Ashwagandha in the morning",
        b: "Stir into warm milk or a smoothie. It helps balance cortisol — a key driver of PCOS flares.",
      },
      legend: [{ l: "Period", c: PH.menstrual }, { l: "Predicted", c: PH.luteal }],
    };
  }
  if (mode === "conceive") {
    return {
      cycleLen,
      day: 14,
      top: "Peak fertility",
      big: "High",
      sub: "Best 2 days to conceive · ovulation ~tomorrow",
      phases: [
        { from: 1, to: 5, color: PH.menstrual },
        { from: 6, to: 11, color: PH.follicular },
        { from: 12, to: 16, color: PH.ovulation },
        { from: 17, to: 28, color: PH.luteal },
      ],
      stats: [["Cycle day", "14", "of 28"], ["Fertile", "5d", "left"], ["Next period", "Jun 18", "est."]],
      insight: {
        ic: "🌡️",
        eb: "Basal temperature",
        t: "Thermal shift detected",
        b: "98.6°F this morning, up from your baseline — a strong sign ovulation is near.",
      },
      legend: [
        { l: "Period", c: PH.menstrual },
        { l: "Fertile", c: PH.follicular },
        { l: "Ovulation", c: PH.ovulation },
      ],
    };
  }
  return {
    cycleLen,
    day: 12,
    top: "Cycle day 12",
    big: "In 2 days",
    sub: "Ovulation approaching · energy high",
    phases: [
      { from: 1, to: 5, color: PH.menstrual },
      { from: 6, to: 12, color: PH.follicular },
      { from: 13, to: 16, color: PH.ovulation },
      { from: 17, to: 28, color: PH.luteal },
    ],
    stats: [["Next period", "16d", "away"], ["Cycle day", "12", "of 28"], ["Ovulation", "2d", "away"]],
    insight: {
      ic: "🌿",
      eb: "Follicular phase",
      t: "Ride the energy wave",
      b: "Estrogen is climbing — a great window for harder workouts, big tasks and social plans.",
    },
    legend: [
      { l: "Period", c: PH.menstrual },
      { l: "Follicular", c: PH.follicular },
      { l: "Fertile", c: PH.ovulation },
      { l: "Luteal", c: PH.luteal },
    ],
  };
}

// ── BBT Sparkline ──────────────────────────────────────────
function BBTChart() {
  const data = [97.8, 97.9, 97.7, 97.9, 98.0, 97.8, 97.9, 98.0, 98.4, 98.5, 98.4, 98.6, 98.5, 98.6];
  const w = 300, h = 84, pad = 6, min = 97.5, max = 98.8;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    pad + (1 - (v - min) / (max - min)) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${h - pad} L ${pts[0][0].toFixed(1)} ${h - pad} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="bbtg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT_DEEP} stopOpacity="0.22" />
          <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#bbtg)" />
      <path d={line} fill="none" stroke={ACCENT_DEEP} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0].toFixed(1)} cy={last[1].toFixed(1)} r="4" fill={ACCENT_DEEP} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

function ModeMenu({
  mode,
  onSelect,
  onClose,
}: {
  mode: Mode;
  onSelect: (m: Mode) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const opts: [Mode, string][] = [["regular", "Regular"], ["pcos", "PCOS"], ["conceive", "Conceive"]];
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 46,
        right: 0,
        zIndex: 40,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 14px 40px rgba(150,75,100,.16)",
        border: "1px solid #F6ECE8",
        padding: 6,
        minWidth: 162,
      }}
    >
      {opts.map(([k, name]) => (
        <button
          key={k}
          onClick={() => { onSelect(k); onClose(); }}
          style={{
            width: "100%",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: mode === k ? "#FCF8F6" : "none",
            border: "none",
            borderRadius: 11,
            padding: "11px 12px",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, fontWeight: 600, color: "#2E2329", flex: 1 }}>{name}</span>
          {mode === k && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}

function HomeScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("regular");
  const [menuOpen, setMenuOpen] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [name, setName] = useState("there");
  const [activeSequence, setActiveSequence] = useState<YogaSequence | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboarded = window.localStorage.getItem("petal:onboarded");
    if (!onboarded) { navigate({ to: "/welcome-mode", replace: true }); return; }
    const m = window.localStorage.getItem("petal:mode") as Mode | null;
    if (m) setMode(m);
    const n = window.localStorage.getItem("petal:name");
    if (n) setName(n);
    const saved = window.localStorage.getItem("petal:symptoms");
    if (saved) { try { setSymptoms(JSON.parse(saved)); } catch { /**/ } }
  }, [navigate]);

  const cycle = computeCycle(mode);
  const initial = (name.charAt(0) || "U").toUpperCase();
  const modeLabel = mode === "pcos" ? "PCOS" : mode === "conceive" ? "Conceive" : "Regular";

  function toggleSymptom(k: string) {
    setSymptoms((prev) => {
      const next = prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k];
      if (typeof window !== "undefined") window.localStorage.setItem("petal:symptoms", JSON.stringify(next));
      return next;
    });
  }

  function switchMode(m: Mode) {
    setMode(m);
    if (typeof window !== "undefined") window.localStorage.setItem("petal:mode", m);
  }

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 26,
    boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
    border: "1px solid #F6ECE8",
  };

  return (
    <>
    <AppShell>
      <div
        className="fade-in"
        style={{ minHeight: "100%", background: "linear-gradient(180deg,#FCF5F2 0%,#FBF3F0 38%)" }}
      >
        {/* Header */}
        <div
          style={{
            padding: "60px 20px 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${ACCENT},${GOLD})`,
                boxShadow: "0 2px 8px rgba(170,90,115,.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                flexShrink: 0,
              }}
            >
              {initial}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#705F66", fontWeight: 500 }}>Good morning,</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "#2E2329", letterSpacing: -0.3 }}>{name}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "#fff",
                  border: "1px solid #F0E2DE",
                  borderRadius: 999,
                  padding: "8px 12px 8px 14px",
                  boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#2E2329" }}>{modeLabel}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#705F66" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menuOpen && (
                <ModeMenu mode={mode} onSelect={switchMode} onClose={() => setMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Cycle ring card */}
          <div
            style={{
              ...cardStyle,
              background: `linear-gradient(165deg,#fff 0%,${ACCENT_SOFT} 130%)`,
              padding: "26px 20px 22px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#fff",
                  borderRadius: 999,
                  padding: "6px 13px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: ACCENT_DEEP,
                  boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
                }}
              >
                ✨ {mode === "pcos" ? "PCOS tracker" : mode === "conceive" ? "Fertility tracker" : "Cycle tracker"}
              </span>
            </div>
            <CycleRing
              cycleLen={cycle.cycleLen}
              day={cycle.day}
              phases={cycle.phases}
              top={cycle.top}
              big={cycle.big}
              sub={cycle.sub}
              dashed={cycle.dashed}
              accent={ACCENT}
            />
            {/* Legend */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 18 }}>
              {cycle.legend.map((it) => (
                <div key={it.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: it.c }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#705F66" }}>{it.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10 }}>
            {cycle.stats.map((st) => (
              <div
                key={st[0]}
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 18,
                  padding: "13px 12px",
                  textAlign: "center",
                  border: "1px solid #F6ECE8",
                  boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".7px", textTransform: "uppercase", color: "#A89AA0" }}>{st[0]}</div>
                <div style={{ fontSize: 21, fontWeight: 800, color: ACCENT, margin: "4px 0 1px", letterSpacing: -0.4, fontVariantNumeric: "tabular-nums" }}>{st[1]}</div>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: "#705F66" }}>{st[2]}</div>
              </div>
            ))}
          </div>

          {/* Log period CTA */}
          <Link
            to="/calendar"
            style={{
              border: "none",
              background: ACCENT,
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "16px 26px",
              borderRadius: 999,
              boxShadow: `0 8px 22px rgba(226,109,138,.28)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            💧 Log period started
          </Link>

          {/* Insight card */}
          <div style={{ ...cardStyle, padding: "17px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: ACCENT_SOFT,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              {cycle.insight.ic}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: ACCENT, marginBottom: 3 }}>
                {cycle.insight.eb}
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: "#2E2329", marginBottom: 4 }}>{cycle.insight.t}</div>
              <div style={{ fontSize: 13.5, color: "#705F66", lineHeight: 1.5 }}>{cycle.insight.b}</div>
            </div>
          </div>

          {/* Conceive BBT */}
          {mode === "conceive" && (
            <div style={{ ...cardStyle, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontSize: 15.5, fontWeight: 800, color: "#2E2329" }}>Basal body temperature</div>
                <button
                  style={{
                    width: 30, height: 30, borderRadius: "50%", border: "none",
                    background: ACCENT_SOFT, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", fontSize: 18, color: ACCENT,
                  }}
                >+</button>
              </div>
              <div style={{ fontSize: 12.5, color: "#705F66", marginBottom: 10 }}>98.6°F · logged 7:12 am</div>
              <BBTChart />
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: ACCENT_DEEP, fontSize: 12.5, fontWeight: 600 }}>
                ⚡ Thermal shift detected
              </div>
            </div>
          )}

          {/* Symptoms */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 13 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#2E2329", letterSpacing: -0.3, margin: 0 }}>How are you today?</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: ACCENT }}>3 June</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {SYMPTOMS.map((sy) => {
                const on = symptoms.includes(sy.k);
                return (
                  <button
                    key={sy.k}
                    onClick={() => toggleSymptom(sy.k)}
                    style={{
                      border: "none",
                      background: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 7,
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <span
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: 18,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: on ? ACCENT : "#fff",
                        border: `1.5px solid ${on ? ACCENT : "#F0E2DE"}`,
                        boxShadow: on ? "0 8px 26px rgba(180,100,120,.10)" : "0 1px 2px rgba(70,35,48,.04)",
                        fontSize: 24,
                      }}
                    >
                      {sy.ic}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: on ? "#2E2329" : "#705F66" }}>{sy.l}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's yoga */}
          <TodayYogaSection mode={mode} onStart={setActiveSequence} />

          {/* Insights entry */}
          <Link
            to="/calendar"
            style={{
              textAlign: "left",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 13,
              background: "#fff",
              border: "1px solid #F6ECE8",
              borderRadius: 20,
              padding: "15px 16px",
              boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: ACCENT_SOFT,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 21,
              }}
            >
              ⚡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#2E2329" }}>Your insights</div>
              <div style={{ fontSize: 12.5, color: "#705F66" }}>Cycle trends, symptoms & patterns</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A89AA0" strokeWidth="1.7" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>

          {/* AI Coach nudge */}
          <Link
            to="/coach"
            style={{
              textAlign: "left",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 13,
              background: `linear-gradient(120deg,${ACCENT_DEEP},${ACCENT})`,
              border: "none",
              borderRadius: 22,
              padding: "16px 18px",
              boxShadow: `0 10px 26px rgba(226,109,138,.28)`,
              marginBottom: 6,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: "rgba(255,255,255,.22)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              ✨
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Ask your AI coach</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.85)" }}>Questions about your cycle? I'm here.</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </Link>

          <div style={{ height: 8 }} />
        </div>
      </div>
    </AppShell>
    {activeSequence && (
      <YogaSequencePlayer sequence={activeSequence} onClose={() => setActiveSequence(null)} />
    )}
  </>
  );
}
