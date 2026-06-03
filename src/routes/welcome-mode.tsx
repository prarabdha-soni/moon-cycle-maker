import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/welcome-mode")({
  head: () => ({
    meta: [
      { title: "Welcome — SheThrives" },
      { name: "description", content: "Set up your SheThrives account." },
    ],
  }),
  component: OnboardingFlow,
});

// ── Icons ────────────────────────────────────────────────────
function FlowerIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#E26D8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.3" />
      <path d="M12 9.7c0-2 1-3.5 0-5.2-1 1.7 0 3.2 0 5.2ZM14.3 12c2 0 3.5-1 5.2 0-1.7 1-3.2 0-5.2 0ZM12 14.3c0 2-1 3.5 0 5.2 1-1.7 0-3.2 0-5.2ZM9.7 12c-2 0-3.5 1-5.2 0 1.7-1 3.2 0 5.2 0Z" />
    </svg>
  );
}
function ChevLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E2329" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function CheckIcon({ size = 48, color = "#E26D8A", sw = 2.4 }: { size?: number; color?: string; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A89AA0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" strokeWidth="2" />
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────
type Mode = "regular" | "pcos" | "conceive";

interface OState {
  step: number;
  name: string;
  goal: Mode;
  age: string | null;
  lastDay: number | null;
  len: number;
  periodLen: number;
  symptoms: string[];
}

const TRACK = [
  { k: "cramps", ic: "🔥", l: "Cramps" },
  { k: "mood", ic: "😊", l: "Mood" },
  { k: "energy", ic: "⚡", l: "Energy" },
  { k: "sleep", ic: "🌙", l: "Sleep" },
  { k: "bloating", ic: "🌊", l: "Bloating" },
  { k: "spotting", ic: "💧", l: "Spotting" },
  { k: "skin", ic: "✨", l: "Skin" },
  { k: "headache", ic: "ℹ️", l: "Headache" },
];

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const ACCENT_SOFT = "#FBE7EC";

// ── Helpers ──────────────────────────────────────────────────
function progress(step: number, total: number) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          style={{
            height: 5,
            borderRadius: 999,
            transition: "all .3s ease",
            width: i === step ? 22 : 7,
            background: i <= step ? ACCENT : "#F0E2DE",
            display: "inline-block",
          }}
        />
      ))}
    </div>
  );
}

function GoalCard({
  k,
  icon,
  title,
  desc,
  selected,
  onClick,
}: {
  k: string;
  icon: string;
  title: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left",
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: selected ? "#fff" : "#FCF8F6",
        border: `1.5px solid ${selected ? ACCENT : "#F0E2DE"}`,
        borderRadius: 20,
        padding: "16px",
        boxShadow: selected ? "0 8px 26px rgba(180,100,120,.10)" : "none",
        transition: "all .18s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          flexShrink: 0,
          background: selected ? ACCENT : "#FDF1F4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700, color: "#2E2329" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#705F66", marginTop: 2, lineHeight: 1.35 }}>{desc}</div>
      </div>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          flexShrink: 0,
          border: `2px solid ${selected ? ACCENT : "#F0E2DE"}`,
          background: selected ? ACCENT : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <CheckIcon size={13} color="#fff" sw={3} />}
      </div>
    </button>
  );
}

// ── Main onboarding component ────────────────────────────────
function OnboardingFlow() {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const [s, setS] = useState<OState>({
    step: 0,
    name: "",
    goal: "regular",
    age: null,
    lastDay: null,
    len: 28,
    periodLen: 5,
    symptoms: [],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboarded = window.localStorage.getItem("petal:onboarded");
      if (onboarded) {
        navigate({ to: "/", replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (s.step === 1) {
      setTimeout(() => nameRef.current?.focus(), 100);
    }
  }, [s.step]);

  function next() { setS((p) => ({ ...p, step: p.step + 1 })); }
  function back() { setS((p) => ({ ...p, step: Math.max(0, p.step - 1) })); }

  function canContinue() {
    if (s.step === 1) return s.name.trim().length > 0;
    if (s.step === 3) return !!s.age;
    if (s.step === 4) return s.lastDay !== null;
    if (s.step === 6) return s.symptoms.length > 0;
    return true;
  }

  function finish() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:onboarded", "1");
      window.localStorage.setItem("petal:mode", s.goal);
      window.localStorage.setItem("petal:name", s.name.trim() || "");
      window.localStorage.setItem("petal:cycleLength", String(s.len));
      window.localStorage.setItem("petal:periodLength", String(s.periodLen));
      window.localStorage.setItem("petal:symptoms", JSON.stringify(s.symptoms));
      if (s.lastDay && s.lastDay > 0) {
        const d = new Date(2026, 5, s.lastDay);
        window.localStorage.setItem("petal:lastPeriod", d.toISOString().split("T")[0]);
      }
    }
    navigate({ to: "/", replace: true });
  }

  const wrap = (
    <div
      className="mx-auto flex min-h-screen max-w-md flex-col"
      style={{
        padding: "62px 26px 30px",
        background: "linear-gradient(180deg,#FCF5F2 0%,#F7EAE6 100%)",
      }}
    />
  );
  void wrap;

  const wrapStyle: React.CSSProperties = {
    margin: "0 auto",
    display: "flex",
    minHeight: "100vh",
    maxWidth: 428,
    flexDirection: "column",
    padding: "62px 26px 30px",
    background: "linear-gradient(180deg,#FCF5F2 0%,#F7EAE6 100%)",
    boxSizing: "border-box",
  };

  const stepHead = (stepN: number, total: number, title: string, sub?: string) => (
    <div style={{ marginBottom: 22 }}>
      <button
        onClick={back}
        style={{
          background: "#fff",
          border: "1px solid #F0E2DE",
          width: 38,
          height: 38,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          cursor: "pointer",
        }}
      >
        <ChevLeft />
      </button>
      {progress(stepN - 1, total)}
      <h2
        style={{
          fontSize: 25,
          fontWeight: 800,
          color: "#2E2329",
          margin: "22px 0 6px",
          letterSpacing: -0.4,
          lineHeight: 1.15,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 14.5, color: "#705F66", margin: 0, lineHeight: 1.45 }}>{sub}</p>
      )}
    </div>
  );

  const contBtn = (
    <button
      disabled={!canContinue()}
      onClick={s.step === 7 ? finish : next}
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
        width: "100%",
        cursor: "pointer",
        opacity: canContinue() ? 1 : 0.4,
        pointerEvents: canContinue() ? "auto" : "none",
        fontFamily: "inherit",
        transition: "opacity .15s",
      }}
    >
      Continue
    </button>
  );

  // ── Step 0: Welcome ──────────────────────────────
  if (s.step === 0) {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%,#FBE7EC,#fff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 26px rgba(180,100,120,.10)",
              marginBottom: 30,
            }}
          >
            <FlowerIcon />
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: ACCENT,
            }}
          >
            SheThrives
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "#2E2329",
              margin: "14px 0 0",
              lineHeight: 1.12,
              letterSpacing: -0.6,
            }}
          >
            Your cycle, understood — gently
          </h1>
          <p
            style={{
              fontSize: 15.5,
              color: "#705F66",
              margin: "14px 0 0",
              lineHeight: 1.5,
              maxWidth: 300,
            }}
          >
            Track your rhythm, calm your symptoms, and learn what your body is telling you.
          </p>
        </div>
        <button
          onClick={next}
          style={{
            border: "none",
            background: ACCENT,
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            padding: "16px 26px",
            borderRadius: 999,
            boxShadow: `0 8px 22px rgba(226,109,138,.28)`,
            width: "100%",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Get started
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            marginTop: 16,
            fontSize: 14.5,
            fontWeight: 600,
            color: "#705F66",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem("petal:onboarded", "1");
              window.localStorage.setItem("petal:mode", "regular");
              window.localStorage.setItem("petal:name", "there");
            }
            navigate({ to: "/", replace: true });
          }}
        >
          I already have an account
        </button>
      </div>
    );
  }

  // ── Step 1: Name ─────────────────────────────────
  if (s.step === 1) {
    return (
      <div style={wrapStyle}>
        {stepHead(1, 6, "What should we call you?", "We'll use this to make your space feel like yours.")}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".6px",
              textTransform: "uppercase",
              color: "#A89AA0",
              marginBottom: 10,
            }}
          >
            Your name
          </div>
          <input
            ref={nameRef}
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Mia"
            value={s.name}
            onChange={(e) => setS((p) => ({ ...p, name: e.target.value }))}
            style={{
              width: "100%",
              fontFamily: "inherit",
              fontSize: 18,
              fontWeight: 600,
              color: "#2E2329",
              background: "#fff",
              border: `1.5px solid ${s.name.trim() ? ACCENT : "#F0E2DE"}`,
              borderRadius: 18,
              padding: "16px 18px",
              outline: "none",
              boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
              boxSizing: "border-box",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginTop: 12,
              fontSize: 12.5,
              color: "#A89AA0",
            }}
          >
            <InfoIcon /> Private to you — never shared.
          </div>
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 2: Goal ─────────────────────────────────
  if (s.step === 2) {
    return (
      <div style={wrapStyle}>
        {stepHead(2, 6, "What brings you here?", "We'll tailor your tracker, insights and tips to this.")}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          <GoalCard k="regular" icon="📅" title="Track my cycle" desc="Periods, ovulation & symptoms" selected={s.goal === "regular"} onClick={() => setS((p) => ({ ...p, goal: "regular" }))} />
          <GoalCard k="pcos" icon="🌊" title="Manage PCOS" desc="Irregular cycles & hormone balance" selected={s.goal === "pcos"} onClick={() => setS((p) => ({ ...p, goal: "pcos" }))} />
          <GoalCard k="conceive" icon="❤️" title="Trying to conceive" desc="Fertile window & conception odds" selected={s.goal === "conceive"} onClick={() => setS((p) => ({ ...p, goal: "conceive" }))} />
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 3: Age ──────────────────────────────────
  if (s.step === 3) {
    const ages = ["Under 18", "18–24", "25–34", "35–44", "45+"];
    return (
      <div style={wrapStyle}>
        {stepHead(3, 6, "How old are you?", "Your age shapes what's typical for your cycle.")}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: "#A89AA0", marginBottom: 12 }}>
            Age range
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ages.map((a) => (
              <button
                key={a}
                onClick={() => setS((p) => ({ ...p, age: a }))}
                style={{
                  padding: "12px 18px",
                  fontSize: 14.5,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: `1px solid ${s.age === a ? ACCENT : "#F0E2DE"}`,
                  background: s.age === a ? ACCENT : "#fff",
                  color: s.age === a ? "#fff" : "#705F66",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .15s ease",
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 4: Last period ──────────────────────────
  if (s.step === 4) {
    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    return (
      <div style={wrapStyle}>
        {stepHead(4, 6, "When did your last period start?", s.goal === "pcos" ? "A rough date is perfectly fine." : "Tap the day it began.")}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 26,
              padding: "18px 16px",
              boxShadow: "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
              border: "1px solid #F6ECE8",
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 15, color: "#2E2329", marginBottom: 12 }}>
              June 2026
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
              {labels.map((l, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: "#A89AA0" }}>{l}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const d = i + 1;
                const on = s.lastDay === d;
                return (
                  <button
                    key={d}
                    onClick={() => setS((p) => ({ ...p, lastDay: d }))}
                    style={{
                      aspectRatio: "1",
                      borderRadius: "50%",
                      border: "none",
                      fontFamily: "inherit",
                      fontSize: 14.5,
                      fontWeight: on ? 700 : 500,
                      background: on ? ACCENT : "transparent",
                      color: on ? "#fff" : d > 3 ? "#2E2329" : "#A89AA0",
                      cursor: "pointer",
                      transition: "all .12s ease",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => setS((p) => ({ ...p, lastDay: -1, step: p.step + 1 }))}
            style={{
              background: "none",
              border: "none",
              marginTop: 16,
              width: "100%",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
              color: "#705F66",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            I'm not sure — estimate for me
          </button>
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 5: Cycle length ─────────────────────────
  if (s.step === 5) {
    const plens = [3, 4, 5, 6, 7, 8];
    return (
      <div style={wrapStyle}>
        {stepHead(5, 6, "Your cycle, roughly", "You can fine-tune these anytime in settings.")}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: "#A89AA0", marginBottom: 6 }}>
            Cycle length
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: ACCENT, letterSpacing: -1, lineHeight: 1 }}>{s.len}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#705F66" }}>days</span>
          </div>
          <input
            type="range"
            min={21}
            max={40}
            value={s.len}
            onChange={(e) => setS((p) => ({ ...p, len: Number(e.target.value) }))}
            style={{ width: "100%", accentColor: ACCENT }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "8px 0 26px", fontSize: 12.5, color: "#A89AA0", fontWeight: 600 }}>
            <span>21</span><span>40</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: "#A89AA0", marginBottom: 10 }}>
            Period length
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {plens.map((p) => (
              <button
                key={p}
                onClick={() => setS((prev) => ({ ...prev, periodLen: p }))}
                style={{
                  padding: "11px 16px",
                  fontSize: 14.5,
                  fontWeight: 600,
                  borderRadius: 999,
                  border: `1px solid ${s.periodLen === p ? ACCENT : "#F0E2DE"}`,
                  background: s.periodLen === p ? ACCENT : "#fff",
                  color: s.periodLen === p ? "#fff" : "#705F66",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .15s ease",
                }}
              >
                {p} days
              </button>
            ))}
          </div>
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 6: Symptoms to track ────────────────────
  if (s.step === 6) {
    return (
      <div style={wrapStyle}>
        {stepHead(6, 6, "What would you like to track?", "Pick what matters most — choose at least one.")}
        <div style={{ flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {TRACK.map((sy) => {
              const on = s.symptoms.includes(sy.k);
              return (
                <button
                  key={sy.k}
                  onClick={() =>
                    setS((p) => ({
                      ...p,
                      symptoms: on ? p.symptoms.filter((x) => x !== sy.k) : [...p.symptoms, sy.k],
                    }))
                  }
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
                      boxShadow: on ? "0 8px 26px rgba(180,100,120,.10)" : "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)",
                      fontSize: 24,
                    }}
                  >
                    {sy.ic}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: on ? "#2E2329" : "#705F66" }}>
                    {sy.l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {contBtn}
      </div>
    );
  }

  // ── Step 7: All set ──────────────────────────────
  const nm = s.name.trim() || "";
  const modeLabel = s.goal === "pcos" ? "PCOS" : s.goal === "conceive" ? "Conceive" : "Regular";
  const feats = [
    ["📅", "Personalised cycle predictions"],
    ["✨", "An AI coach that knows your context"],
    ["🌿", "Daily tips for your phase"],
  ];

  return (
    <div style={wrapStyle}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: ACCENT_SOFT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <CheckIcon size={48} color={ACCENT} sw={2.4} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#2E2329", letterSpacing: -0.5 }}>
          You're all set{nm ? `, ${nm}` : ""}
        </h1>
        <p style={{ fontSize: 15.5, color: "#705F66", margin: "14px 0 26px", lineHeight: 1.5, maxWidth: 300 }}>
          Your {modeLabel} space is ready. The more you log, the smarter your predictions become.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
          {feats.map(([ic, txt]) => (
            <div
              key={txt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fff",
                border: "1px solid #F6ECE8",
                borderRadius: 16,
                padding: "13px 16px",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 20 }}>{ic}</span>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "#2E2329" }}>{txt}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={finish}
        style={{
          border: "none",
          background: ACCENT,
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          padding: "16px 26px",
          borderRadius: 999,
          boxShadow: `0 8px 22px rgba(226,109,138,.28)`,
          width: "100%",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Enter SheThrives
      </button>
    </div>
  );
}
