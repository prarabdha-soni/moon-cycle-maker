import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [{ title: "Learn — SheThrives" }],
  }),
  component: LearnScreen,
});

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const ACCENT_SOFT = "#FBE7EC";
type Mode = "regular" | "pcos" | "conceive";

const CARD_SHADOW = "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)";

// ── Routine data ──────────────────────────────────────────────
interface Move { name: string; time: string; cue: string; }
interface Section { name: string; moves: Move[]; }
interface Routine {
  id: string; type: string; title: string; subtitle: string;
  duration: string; intensity: string; c1: string; c2: string;
  sections: Section[]; tip: string;
}

const ROUTINES_PCOS: Routine[] = [
  { id:"pc1", type:"Yoga", title:"Hormone-Balancing Flow", subtitle:"Gentle poses to calm cortisol & ease bloating", duration:"20 min", intensity:"Low", c1:"#9C7CC1", c2:"#E26D8A",
    sections:[
      {name:"Warm-up",moves:[{name:"Cat–Cow",time:"2 min",cue:"Sync breath with each spinal wave"},{name:"Child's Pose",time:"1 min",cue:"Soften hips, breathe into your back"},{name:"Seated Side Stretch",time:"2 min",cue:"Lengthen each side slowly"}]},
      {name:"Main flow",moves:[{name:"Cobra",time:"2 min",cue:"Open the chest, relax shoulders"},{name:"Bridge",time:"3 min",cue:"Lift hips, engage glutes gently"},{name:"Supine Twist",time:"3 min",cue:"Release the lower back"},{name:"Wide-Leg Fold",time:"2 min",cue:"Let the head hang heavy"}]},
      {name:"Cool-down",moves:[{name:"Legs-Up-the-Wall",time:"4 min",cue:"Calms the nervous system"},{name:"Savasana",time:"1 min",cue:"Full rest, slow breathing"}]}
    ], tip:"Slow yoga lowers cortisol — a key driver of PCOS symptoms. Aim for 3–4 sessions a week." },
  { id:"pc2", type:"Strength", title:"Cortisol-Calm Strength", subtitle:"Low-impact resistance to boost insulin sensitivity", duration:"25 min", intensity:"Moderate", c1:"#7E5CA8", c2:"#9C7CC1",
    sections:[
      {name:"Warm-up",moves:[{name:"March in Place",time:"2 min",cue:"Lift knees, swing arms"},{name:"Arm Circles",time:"1 min",cue:"Forward then back"},{name:"Good-Mornings",time:"2 min",cue:"Hinge at the hips"}]},
      {name:"Circuit ×3",moves:[{name:"Goblet Squats",time:"12 reps",cue:"Chest tall, weight in heels"},{name:"Glute Bridges",time:"15 reps",cue:"Squeeze at the top"},{name:"Bird-Dog",time:"10/side",cue:"Slow, no wobble"},{name:"Incline Push-ups",time:"10 reps",cue:"Hands on a wall or couch"}]},
      {name:"Cool-down",moves:[{name:"Forward Fold",time:"1 min",cue:"Release hamstrings"},{name:"Figure-4 Stretch",time:"2 min",cue:"Open the hips, both sides"}]}
    ], tip:"Strength work 2–3× weekly improves how your body handles insulin — central to managing PCOS." },
  { id:"pc3", type:"Cardio-lite", title:"Insulin-Friendly Reset", subtitle:"A short walk-based session you can do anywhere", duration:"15 min", intensity:"Low", c1:"#6FA98B", c2:"#9C7CC1",
    sections:[
      {name:"Warm-up",moves:[{name:"Easy March",time:"2 min",cue:"Find a comfortable rhythm"}]},
      {name:"Intervals ×2",moves:[{name:"Easy Walk",time:"3 min",cue:"Conversational pace"},{name:"Brisk Walk",time:"1 min",cue:"Pick up the pace, pump arms"},{name:"Knee Lifts",time:"1 min",cue:"Stand tall, engage core"}]},
      {name:"Cool-down",moves:[{name:"Calf Stretch",time:"1 min",cue:"Both sides"},{name:"Deep Breathing",time:"2 min",cue:"4 counts in, 6 counts out"}]}
    ], tip:"A 10-minute walk after meals noticeably blunts blood-sugar spikes." },
];

const ROUTINES_GEN: Routine[] = [
  { id:"g1", type:"Yoga", title:"Energising Morning Flow", subtitle:"Wake the body for your follicular phase", duration:"15 min", intensity:"Low", c1:"#E26D8A", c2:"#D99B57",
    sections:[
      {name:"Warm-up",moves:[{name:"Cat–Cow",time:"2 min",cue:"Loosen the spine"},{name:"Sun Salutation A",time:"3 min",cue:"Flow with the breath"}]},
      {name:"Main flow",moves:[{name:"Warrior II",time:"2 min",cue:"Strong legs, open chest"},{name:"Triangle",time:"2 min",cue:"Lengthen both sides"},{name:"Chair Pose",time:"2 min",cue:"Sit back, core on"}]},
      {name:"Cool-down",moves:[{name:"Forward Fold",time:"2 min",cue:"Let go of the neck"},{name:"Savasana",time:"2 min",cue:"Rest and reset"}]}
    ], tip:"Estrogen is rising — your body can handle a bit more intensity now. Use the energy." },
  { id:"g2", type:"Restorative", title:"Cramp-Relief Restorative", subtitle:"Soothing poses for period days", duration:"20 min", intensity:"Low", c1:"#C7B4DF", c2:"#E26D8A",
    sections:[
      {name:"Settle",moves:[{name:"Reclined Bound Angle",time:"4 min",cue:"Support knees with cushions"},{name:"Supported Child's Pose",time:"3 min",cue:"Pillow under the chest"}]},
      {name:"Release",moves:[{name:"Knees-to-Chest",time:"3 min",cue:"Gently rock side to side"},{name:"Supine Twist",time:"4 min",cue:"Ease the lower back"}]},
      {name:"Rest",moves:[{name:"Legs-Up-the-Wall",time:"4 min",cue:"Eases heaviness"},{name:"Savasana",time:"2 min",cue:"Warm blanket, slow breath"}]}
    ], tip:"Gentle movement boosts circulation and can ease cramps more than total rest." },
  { id:"g3", type:"Strength", title:"Cycle-Sync Strength", subtitle:"Build strength through your luteal phase", duration:"25 min", intensity:"Moderate", c1:"#6FA98B", c2:"#D99B57",
    sections:[
      {name:"Warm-up",moves:[{name:"March + Arm Swings",time:"2 min",cue:"Raise the heart rate"},{name:"Hip Openers",time:"2 min",cue:"Slow leg swings"}]},
      {name:"Circuit ×3",moves:[{name:"Squats",time:"12 reps",cue:"Controlled tempo"},{name:"Glute Bridge",time:"15 reps",cue:"Squeeze at the top"},{name:"Dead Bug",time:"12 reps",cue:"Brace the core"},{name:"Wall Push-ups",time:"12 reps",cue:"Steady and slow"}]},
      {name:"Cool-down",moves:[{name:"Hamstring Stretch",time:"2 min",cue:"Both sides"},{name:"Box Breathing",time:"2 min",cue:"Down-regulate"}]}
    ], tip:"Listen to your energy — luteal phase often calls for slightly lighter loads." },
];

function getRoutines(mode: Mode): Routine[] { return mode === "pcos" ? ROUTINES_PCOS : ROUTINES_GEN; }

const TYPE_ICON: Record<string, string> = { Yoga: "🧘", Strength: "💪", "Cardio-lite": "🏃", Restorative: "🌿" };

// ── Thumb placeholder ─────────────────────────────────────────
function ThumbGradient({ c1, c2, ic, h }: { c1: string; c2: string; ic: string; h: number }) {
  return (
    <div style={{ position: "relative", width: "100%", height: h, borderRadius: 16, overflow: "hidden", background: `linear-gradient(135deg,${c1},${c2})`, flexShrink: 0 }}>
      <div style={{ position: "absolute", right: -14, bottom: -14, opacity: .3, fontSize: h * 0.5 }}>{ic}</div>
    </div>
  );
}

// ── Guided Player ─────────────────────────────────────────────
function timeToSec(str: string): number {
  const s = String(str).toLowerCase(), n = parseInt(s, 10) || 1;
  if (s.includes("min")) return Math.max(15, n * 20);
  if (s.includes("rep") || s.includes("side")) return 35;
  return 30;
}

interface Step { section: string; name: string; cue: string; label: string; dur: number; }

function buildSteps(r: Routine): Step[] {
  const arr: Step[] = [];
  r.sections.forEach(sec => sec.moves.forEach(m => arr.push({ section: sec.name, name: m.name, cue: m.cue, label: m.time, dur: timeToSec(m.time) })));
  return arr;
}

function fmtClock(sec: number) { const m = Math.floor(sec / 60), x = sec % 60; return `${m}:${x < 10 ? "0" + x : x}`; }

function GuidedPlayer({ routine, onClose }: { routine: Routine; onClose: () => void }) {
  const steps = useRef(buildSteps(routine));
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(steps.current[0].dur);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps.current[idx];
  const total = steps.current.length;
  const circ = 2 * Math.PI * 100;
  const off = circ * (1 - remaining / step.dur);
  const pct = ((idx + (1 - remaining / step.dur)) / total) * 100;

  function speak(s: Step) {
    if (muted || !("speechSynthesis" in window)) return;
    try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(`${s.name}. ${s.cue}`); u.rate = 0.95; window.speechSynthesis.speak(u); } catch { /**/ }
  }

  function startTick() {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          setIdx(i => {
            const ni = i + 1;
            if (ni >= steps.current.length) { setDone(true); clearInterval(timer.current!); return i; }
            setTimeout(() => speak(steps.current[ni]), 300);
            setRemaining(steps.current[ni].dur);
            return ni;
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    startTick();
    setTimeout(() => speak(steps.current[0]), 350);
    return () => { if (timer.current) clearInterval(timer.current); try { window.speechSynthesis?.cancel(); } catch { /**/ } };
  }, []);

  function togglePause() {
    if (paused) { startTick(); speak(step); } else { if (timer.current) clearInterval(timer.current); try { window.speechSynthesis?.cancel(); } catch { /**/ } }
    setPaused(p => !p);
  }
  function nextStep() {
    const ni = Math.min(idx + 1, total - 1);
    if (timer.current) clearInterval(timer.current);
    setIdx(ni); setRemaining(steps.current[ni].dur); if (!paused) { setTimeout(startTick, 50); speak(steps.current[ni]); }
  }
  function prevStep() {
    const ni = Math.max(idx - 1, 0);
    if (timer.current) clearInterval(timer.current);
    setIdx(ni); setRemaining(steps.current[ni].dur); if (!paused) { setTimeout(startTick, 50); speak(steps.current[ni]); }
  }
  function toggleMute() { setMuted(m => { if (!m) { try { window.speechSynthesis?.cancel(); } catch { /**/ } } else speak(step); return !m; }); }

  if (done) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 30px", background: `linear-gradient(165deg,${routine.c1},${routine.c2})` }}>
        <div style={{ width: 104, height: 104, borderRadius: "50%", background: "rgba(255,255,255,.95)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 12px 36px rgba(0,0,0,.2)", fontSize: 54 }}>✓</div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>Session complete</div>
        <div style={{ fontSize: 27, fontWeight: 800, color: "#fff", margin: "8px 0 4px", letterSpacing: -0.5 }}>{routine.title}</div>
        <div style={{ fontSize: 14.5, color: "rgba(255,255,255,.9)", marginBottom: 26 }}>Beautiful work — you showed up for yourself today.</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
          {[[String(total),"moves"],[routine.duration.replace(" min",""),"minutes"],[routine.type,"type"]].map(([v,l])=>(
            <div key={l} style={{ background: "rgba(255,255,255,.18)", borderRadius: 16, padding: "12px 20px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.85)", fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ background: "#fff", color: routine.c2, border: "none", fontWeight: 700, fontSize: 15, padding: "16px 40px", borderRadius: 999, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>Finish</button>
      </div>
    );
  }

  const next = steps.current[idx + 1];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", flexDirection: "column", background: "#17121d" }}>
      {/* Progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,.22)", zIndex: 4 }}>
        <div style={{ height: "100%", background: "#fff", width: `${pct}%`, transition: "width .3s linear" }} />
      </div>
      {/* Stage */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: `linear-gradient(165deg,${routine.c1},${routine.c2})` }}>
        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "52px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 3 }}>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.18)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", fontSize: 20 }}>✕</button>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: .3, background: "rgba(255,255,255,.16)", padding: "6px 14px", borderRadius: 999 }}>{idx + 1} of {total}</div>
          <button onClick={toggleMute} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20 }}>{muted ? "🔇" : "🔊"}</button>
        </div>
        {/* Ring + emoji figure */}
        <div style={{ position: "relative", width: 230, height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="230" height="230" viewBox="0 0 230 230" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="115" cy="115" r="100" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="6" />
            <circle cx="115" cy="115" r="100" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ.toFixed(1)} strokeDashoffset={off.toFixed(1)} style={{ transition: "stroke-dashoffset .9s linear" }} />
          </svg>
          <div style={{ fontSize: 80, filter: "drop-shadow(0 8px 20px rgba(0,0,0,.25))", animation: paused ? "none" : "breathe 4.4s ease-in-out infinite" }}>
            {TYPE_ICON[routine.type] || "🧘"}
          </div>
        </div>
      </div>
      {/* Panel */}
      <div style={{ background: "#fff", borderRadius: "30px 30px 0 0", padding: "20px 22px 24px", boxShadow: "0 -12px 34px rgba(0,0,0,.16)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>{step.section}</div>
            <div style={{ fontSize: 23, fontWeight: 800, color: "#2E2329", letterSpacing: -0.4, lineHeight: 1.12 }}>{step.name}</div>
            <div style={{ fontSize: 14, color: "#705F66", marginTop: 6, lineHeight: 1.4 }}>{step.cue}</div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#2E2329", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmtClock(remaining)}</div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#A89AA0", marginTop: 2 }}>left</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, padding: "11px 14px", background: "#FCF8F6", borderRadius: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".4px", textTransform: "uppercase", color: "#A89AA0" }}>Next</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#2E2329", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{next ? next.name : "Session complete · rest"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, marginTop: 18 }}>
          <button onClick={prevStep} style={{ width: 54, height: 54, borderRadius: "50%", border: "1.5px solid #F0E2DE", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22 }}>⏮</button>
          <button onClick={togglePause} style={{ width: 76, height: 76, borderRadius: "50%", border: "none", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 26px rgba(226,109,138,.28)`, cursor: "pointer", fontSize: 30 }}>
            {paused ? "▶" : "⏸"}
          </button>
          <button onClick={nextStep} style={{ width: 54, height: 54, borderRadius: "50%", border: "1.5px solid #F0E2DE", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22 }}>⏭</button>
        </div>
      </div>
    </div>
  );
}

// ── Routine Detail Overlay ────────────────────────────────────
function RoutineDetail({ r, onClose, onPlay }: { r: Routine; onClose: () => void; onPlay: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 82, background: "linear-gradient(180deg,#FCF5F2,#FBF3F0)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 20px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F6ECE8", background: "rgba(255,255,255,.55)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
        <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #F0E2DE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E2329" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#2E2329" }}>{r.type}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT_DEEP }}>Guided session</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ padding: "20px 20px 28px" }}>
          {/* Hero */}
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "22px 20px", background: `linear-gradient(125deg,${r.c1},${r.c2})`, position: "relative" }}>
              <div style={{ position: "absolute", right: -10, bottom: -14, opacity: .28, fontSize: 96 }}>{TYPE_ICON[r.type]}</div>
              <div style={{ position: "relative" }}>
                <div style={{ display: "inline-flex", background: "rgba(255,255,255,.9)", color: r.c2, fontSize: 11, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", padding: "5px 11px", borderRadius: 999, marginBottom: 10 }}>{r.type}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.18, letterSpacing: -0.4 }}>{r.title}</div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.9)", marginTop: 6, lineHeight: 1.4 }}>{r.subtitle}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  {[[r.duration,"⏱"],[r.intensity,"⚡"]].map(([v,ic])=>(
                    <span key={v} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.22)", color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 999 }}>{ic} {v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Sections */}
          <div style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: "18px 18px 6px", marginBottom: 16 }}>
            {r.sections.map((sec, si) => (
              <div key={sec.name}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: `${si ? 18 : 2}px 0 10px` }}>
                  <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", color: ACCENT }}>{sec.name}</span>
                  <span style={{ flex: 1, height: 1, background: "#F6ECE8" }} />
                </div>
                {sec.moves.map(mv => (
                  <div key={mv.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 11, background: ACCENT_SOFT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                      {TYPE_ICON[r.type] || "🧘"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#2E2329" }}>{mv.name}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT, whiteSpace: "nowrap" }}>{mv.time}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#705F66", marginTop: 2, lineHeight: 1.4 }}>{mv.cue}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Tip */}
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: ACCENT_SOFT, borderRadius: 16, padding: "14px 15px", marginBottom: 18 }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", color: ACCENT_DEEP, marginBottom: 3 }}>Why it helps</div>
              <div style={{ fontSize: 13.5, color: "#2E2329", lineHeight: 1.5 }}>{r.tip}</div>
            </div>
          </div>
          {/* Actions */}
          <button onClick={onPlay} style={{ border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 999, boxShadow: `0 8px 22px rgba(226,109,138,.28)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
            ▶ Start guided session
          </button>
          <button onClick={() => setSaved(true)} disabled={saved} style={{ background: "#fff", color: saved ? "#578A70" : "#2E2329", border: `1px solid ${saved ? "#BFE0CD" : "#F0E2DE"}`, fontWeight: 600, fontSize: 15, padding: "14px 22px", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", cursor: saved ? "default" : "pointer", fontFamily: "inherit" }}>
            {saved ? "✓ Saved to your routines" : "🔖 Save to my routines"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── YouTube video library ─────────────────────────────────────
interface YogaVideo {
  id: string;
  title: string;
  duration: string;
  tag: string;
  phase: string[];   // 'menstrual'|'follicular'|'ovulation'|'luteal'|'all'
  modes: Mode[];
  c1: string;
  c2: string;
}

const YOGA_VIDEOS: YogaVideo[] = [
  // ── PCOS specific ────────────────────────────────────────────
  { id:"9K8SZpdMkOQ", title:"25-Min Yoga for PCOS & PCOD", duration:"25 min", tag:"PCOS · Hormone Balance", phase:["all"], modes:["pcos"], c1:"#9C7CC1", c2:"#E26D8A" },
  { id:"DrVVfGXaM5k", title:"PCOS Yoga for Hormone Balance", duration:"25 min", tag:"PCOS · Hormones", phase:["all"], modes:["pcos"], c1:"#7E5CA8", c2:"#9C7CC1" },
  { id:"pkyM5uj3HDw", title:"20-Min PCOS Yoga — Weight & Period Health", duration:"20 min", tag:"PCOS · Weight", phase:["all"], modes:["pcos"], c1:"#E26D8A", c2:"#9C7CC1" },
  { id:"AwU2G-1UDbw", title:"20-Min PCOS Strength (No Equipment)", duration:"20 min", tag:"PCOS · Strength", phase:["all"], modes:["pcos"], c1:"#6FA98B", c2:"#7E5CA8" },
  { id:"YukpAFgNJM8", title:"PCOS Low-Impact Weight Loss Workout", duration:"30 min", tag:"PCOS · Cardio-lite", phase:["all"], modes:["pcos"], c1:"#D99B57", c2:"#E26D8A" },
  { id:"05M4N--J3Zg", title:"Insulin Resistance Workout (10 Min)", duration:"10 min", tag:"PCOS · Insulin", phase:["all"], modes:["pcos"], c1:"#9C7CC1", c2:"#6FA98B" },
  // ── Menstrual phase ──────────────────────────────────────────
  { id:"4JaCcp39iVI", title:"Yoga for Cramps & PMS — Adriene", duration:"27 min", tag:"Menstrual · Relief", phase:["menstrual"], modes:["regular","pcos"], c1:"#E26D8A", c2:"#C7B4DF" },
  { id:"_ta-8gMYG2s", title:"20-Min Gentle Yoga for Period Pain", duration:"20 min", tag:"Menstrual · Gentle", phase:["menstrual"], modes:["regular","pcos"], c1:"#C7B4DF", c2:"#E26D8A" },
  { id:"P3fZZCJAY8o", title:"Yin Yoga for Your Period (20 Min)", duration:"20 min", tag:"Menstrual · Yin", phase:["menstrual"], modes:["regular","pcos"], c1:"#9C7CC1", c2:"#E26D8A" },
  // ── Follicular phase ─────────────────────────────────────────
  { id:"qw5PEO7bh_g", title:"30-Min Follicular Phase Yoga Flow", duration:"30 min", tag:"Follicular · Energy", phase:["follicular"], modes:["regular","conceive"], c1:"#F2B6C4", c2:"#D99B57" },
  { id:"1WIXBdV45oM", title:"20-Min Yoga for the Follicular Phase", duration:"20 min", tag:"Follicular · Flow", phase:["follicular"], modes:["regular","conceive"], c1:"#D99B57", c2:"#6FA98B" },
  // ── Ovulation phase ──────────────────────────────────────────
  { id:"1PFH7iNFV2Q", title:"20-Min Yoga for Ovulation & Fertility", duration:"20 min", tag:"Ovulation · Fertility", phase:["ovulation"], modes:["regular","conceive"], c1:"#7FB59A", c2:"#6FA98B" },
  { id:"eJP7Nt_BNUc", title:"Yoga for Fertility & Egg Quality", duration:"25 min", tag:"Ovulation · Egg Quality", phase:["ovulation"], modes:["conceive"], c1:"#6FA98B", c2:"#D99B57" },
  { id:"wGotyWkxvqw", title:"Fertility Yoga — Follicular to Ovulation", duration:"30 min", tag:"Fertility · Conceive", phase:["follicular","ovulation"], modes:["conceive"], c1:"#7FB59A", c2:"#E26D8A" },
  // ── Luteal phase ─────────────────────────────────────────────
  { id:"BR0HW1-Ci3w", title:"Luteal Phase Yoga: Ease PMS Hatha Flow", duration:"30 min", tag:"Luteal · PMS", phase:["luteal"], modes:["regular","pcos"], c1:"#C7B4DF", c2:"#9C7CC1" },
  { id:"Df4XI5VEKFg", title:"Luteal Phase Yoga — Nourish & Calm", duration:"20 min", tag:"Luteal · Calm", phase:["luteal"], modes:["regular","pcos","conceive"], c1:"#9C7CC1", c2:"#C7B4DF" },
  { id:"i7w0I8Xq0jo", title:"Gentle Luteal Yoga — Ease Bloating & Mood", duration:"25 min", tag:"Luteal · Gentle", phase:["luteal"], modes:["regular","pcos"], c1:"#E26D8A", c2:"#9C7CC1" },
];

function currentPhase(mode: Mode): string {
  if (mode === "pcos") return "all";
  if (mode === "conceive") return "ovulation";
  return "follicular";
}

function videosForMode(mode: Mode): YogaVideo[] {
  const phase = currentPhase(mode);
  const byMode = YOGA_VIDEOS.filter(v => v.modes.includes(mode));
  if (mode === "pcos") return byMode;
  // For regular/conceive: phase-specific first, then others
  const phased = byMode.filter(v => v.phase.includes(phase));
  const others = byMode.filter(v => !v.phase.includes(phase) && !v.phase.includes("all"));
  return [...phased, ...others].slice(0, 8);
}

// ── In-app YouTube player overlay ────────────────────────────
function VideoPlayer({ video, onClose }: { video: YogaVideo; onClose: () => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:90, background:"rgba(0,0,0,.85)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"fixed", left:0, right:0, bottom:0, zIndex:91, background:"#17121d", borderRadius:"24px 24px 0 0", maxWidth:428, margin:"0 auto", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px 12px" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:.6, textTransform:"uppercase", color:video.c1, marginBottom:3 }}>{video.tag}</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#fff", lineHeight:1.25, paddingRight:8 }}>{video.title}</div>
          </div>
          <button onClick={onClose} style={{ width:36, height:36, borderRadius:"50%", border:"none", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, color:"#fff", fontSize:18 }}>✕</button>
        </div>
        {/* YouTube iframe */}
        <div style={{ position:"relative", paddingBottom:"56.25%", height:0, overflow:"hidden" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" }}
          />
        </div>
        {/* Duration pill */}
        <div style={{ padding:"12px 18px 28px", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:12.5, fontWeight:600, color:"rgba(255,255,255,.6)" }}>⏱ {video.duration}</span>
          <span style={{ width:4, height:4, borderRadius:"50%", background:"rgba(255,255,255,.3)" }}/>
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:12.5, fontWeight:600, color:"rgba(255,255,255,.5)", textDecoration:"none" }}>
            Open in YouTube ↗
          </a>
        </div>
      </div>
    </>
  );
}

// ── Video card row ────────────────────────────────────────────
function VideoSection({ mode, onPlay }: { mode: Mode; onPlay: (v: YogaVideo) => void }) {
  const videos = videosForMode(mode);
  const heading = mode === "pcos" ? "Videos for PCOS" : mode === "conceive" ? "Videos for Conceive" : "Videos for your phase";
  const sub = mode === "pcos"
    ? "Yoga & workouts curated for hormone balance and PCOS."
    : mode === "conceive"
    ? "Fertility-focused yoga to support conception."
    : "Phase-synced yoga and workouts — play right here.";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:4 }}>
        <h3 style={{ fontSize:18, fontWeight:800, color:"#2E2329", letterSpacing:-0.3, margin:0 }}>▶ {heading}</h3>
      </div>
      <p style={{ fontSize:13, color:"#705F66", margin:"0 0 14px" }}>{sub}</p>
      <div style={{ display:"flex", gap:12, overflowX:"auto", margin:"0 -20px", padding:"0 20px 6px" }} className="scrollbar-hide">
        {videos.map(v => (
          <button key={v.id} onClick={() => onPlay(v)}
            style={{ flexShrink:0, width:200, textAlign:"left", background:"#fff", border:"1px solid #F6ECE8", borderRadius:20, boxShadow:CARD_SHADOW, padding:0, fontFamily:"inherit", cursor:"pointer", overflow:"hidden" }}>
            {/* YouTube thumbnail */}
            <div style={{ position:"relative", width:"100%", paddingBottom:"56.25%", background:`linear-gradient(135deg,${v.c1},${v.c2})`, overflow:"hidden" }}>
              <img
                src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                alt={v.title}
                loading="lazy"
                style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover" }}
              />
              {/* Play button overlay */}
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.18)" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.92)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,.25)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E26D8A" stroke="none"><path d="M7 5l12 7-12 7Z"/></svg>
                </div>
              </div>
              {/* Duration badge */}
              <span style={{ position:"absolute", bottom:6, right:7, background:"rgba(0,0,0,.72)", color:"#fff", fontSize:10.5, fontWeight:700, padding:"2px 7px", borderRadius:5 }}>{v.duration}</span>
            </div>
            <div style={{ padding:"10px 11px 12px" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:v.c1, marginBottom:3 }}>{v.tag}</div>
              <div style={{ fontSize:13.5, fontWeight:700, color:"#2E2329", lineHeight:1.3 }}>{v.title}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Learn articles ────────────────────────────────────────────
const ARTICLES = [
  { c1:"#9C7CC1", c2:"#E26D8A", ic:"🌊", tag:"PCOS", title:"Inositol & insulin: what the research says", read:"7 min" },
  { c1:"#6FA98B", c2:"#D99B57", ic:"❤️", tag:"Fertility", title:"Reading your basal body temperature", read:"4 min" },
  { c1:"#E26D8A", c2:"#9C7CC1", ic:"🌙", tag:"Sleep", title:"Why your sleep shifts across your cycle", read:"6 min" },
  { c1:"#D99B57", c2:"#6FA98B", ic:"🔥", tag:"Symptoms", title:"Gentle ways to ease period cramps", read:"3 min" },
];

// ── Main Learn Screen ─────────────────────────────────────────
function LearnScreen() {
  const [mode, setMode] = useState<Mode>("regular");
  const [activeCategory, setActiveCategory] = useState("For you");
  const [openRoutineId, setOpenRoutineId] = useState<string | null>(null);
  const [playRoutine, setPlayRoutine] = useState<Routine | null>(null);
  const [playingVideo, setPlayingVideo] = useState<YogaVideo | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const m = window.localStorage.getItem("petal:mode") as Mode | null;
      if (m) setMode(m);
    }
  }, []);

  const routines = getRoutines(mode);
  const openRoutine = openRoutineId ? routines.find(r => r.id === openRoutineId) || null : null;
  const cats = ["For you", "Your cycle", "PCOS", "Fertility", "Nutrition", "Mind"];

  return (
    <>
      <AppShell>
        <div className="fade-in" style={{ minHeight: "100%", background: "linear-gradient(180deg,#FCF5F2,#FBF3F0)" }}>
          <div style={{ padding: "60px 20px 0" }}>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: "#2E2329", marginBottom: 4, letterSpacing: -0.6 }}>Learn</h1>
            <p style={{ fontSize: 14.5, color: "#705F66", margin: "0 0 16px" }}>Understand your body, one read at a time.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #F0E2DE", borderRadius: 999, padding: "12px 16px", boxShadow: CARD_SHADOW, marginBottom: 14 }}>
              <span style={{ fontSize: 19 }}>🔍</span>
              <span style={{ fontSize: 14.5, color: "#A89AA0" }}>Search articles &amp; guides</span>
            </div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="scrollbar-hide">
              {cats.map((c, i) => (
                <button key={c} onClick={() => setActiveCategory(c)}
                  style={{ flexShrink: 0, padding: "9px 15px", fontSize: 13.5, fontWeight: 600, borderRadius: 999, border: `1px solid ${activeCategory === c ? ACCENT : "#F0E2DE"}`, background: activeCategory === c ? ACCENT : "#fff", color: activeCategory === c ? "#fff" : "#705F66", cursor: "pointer", fontFamily: "inherit", transition: "all .15s ease", whiteSpace: "nowrap" }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Move with your cycle */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#2E2329", letterSpacing: -0.3, margin: 0 }}>
                  {mode === "pcos" ? "Move with PCOS" : "Move with your cycle"}
                </h3>
              </div>
              <p style={{ fontSize: 13, color: "#705F66", margin: "0 0 14px" }}>
                {mode === "pcos" ? "Yoga & workouts that support hormone balance." : "Yoga & workouts synced to your phase."}
              </p>
              <div style={{ display: "flex", gap: 12, overflowX: "auto", margin: "0 -20px", padding: "0 20px 6px" }} className="scrollbar-hide">
                {routines.map(r => (
                  <button key={r.id} onClick={() => setOpenRoutineId(r.id)}
                    style={{ flexShrink: 0, width: 212, textAlign: "left", background: "#fff", border: "1px solid #F6ECE8", borderRadius: 20, boxShadow: CARD_SHADOW, padding: 8, fontFamily: "inherit", cursor: "pointer" }}>
                    <div style={{ position: "relative" }}>
                      <ThumbGradient c1={r.c1} c2={r.c2} ic={TYPE_ICON[r.type] || "🧘"} h={104} />
                      <span style={{ position: "absolute", left: 9, top: 9, background: "rgba(255,255,255,.92)", color: r.c2, fontSize: 10.5, fontWeight: 700, letterSpacing: .4, textTransform: "uppercase", padding: "4px 9px", borderRadius: 999 }}>{r.type}</span>
                    </div>
                    <div style={{ padding: "11px 7px 6px" }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#2E2329", lineHeight: 1.25, letterSpacing: -0.2 }}>{r.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 12, color: "#705F66", fontWeight: 600 }}>
                        ⏱ {r.duration} <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#A89AA0", display: "inline-block" }} /> {r.intensity}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* YouTube video section */}
            <VideoSection mode={mode} onPlay={setPlayingVideo} />

            {/* Featured article */}
            <div style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: 8, overflow: "hidden" }}>
              <ThumbGradient c1="#E26D8A" c2="#D99B57" ic="🌿" h={158} />
              <div style={{ padding: "14px 12px 8px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .6, textTransform: "uppercase", color: ACCENT, marginBottom: 5 }}>Phase guide</div>
                <div style={{ fontSize: 18.5, fontWeight: 800, color: "#2E2329", lineHeight: 1.25, letterSpacing: -0.3 }}>Eating for your follicular phase</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, fontSize: 12.5, color: "#705F66", fontWeight: 600 }}>⏱ 5 min read</div>
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: 800, color: "#2E2329", letterSpacing: -0.2 }}>Recommended for you</div>
            {ARTICLES.map(a => (
              <div key={a.title} style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: 10, display: "flex", gap: 13, alignItems: "center" }}>
                <div style={{ width: 84, flexShrink: 0 }}><ThumbGradient c1={a.c1} c2={a.c2} ic={a.ic} h={84} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", color: ACCENT, marginBottom: 3 }}>{a.tag}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2E2329", lineHeight: 1.3 }}>{a.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, fontSize: 12, color: "#705F66", fontWeight: 600 }}>⏱ {a.read}</div>
                </div>
                <span style={{ fontSize: 16, color: "#A89AA0" }}>🔖</span>
              </div>
            ))}
            <div style={{ height: 8 }} />
          </div>
        </div>
      </AppShell>

      {openRoutine && !playRoutine && (
        <RoutineDetail r={openRoutine} onClose={() => setOpenRoutineId(null)} onPlay={() => setPlayRoutine(openRoutine)} />
      )}
      {playRoutine && (
        <GuidedPlayer routine={playRoutine} onClose={() => { setPlayRoutine(null); setOpenRoutineId(null); }} />
      )}
      {playingVideo && (
        <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}
    </>
  );
}
