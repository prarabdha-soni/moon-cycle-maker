import { useState, useEffect, useRef } from "react";

export type Mode = "regular" | "pcos" | "conceive";

export interface YogaPose {
  name: string;
  sanskrit: string;
  duration: number; // seconds
  benefit: string;
  benefitBg: string;
  benefitColor: string;
  svgBody: string; // inner SVG paths (100×100 viewBox)
}

export interface YogaSequence {
  title: string;
  subtitle: string;
  modes: Mode[];
  phase: string[]; // 'menstrual'|'follicular'|'ovulation'|'luteal'|'all'
  poses: YogaPose[];
}

// ── SVG pose library (100×100 viewBox, stroke-based) ──────────
export const POSES: Record<string, string> = {
  butterfly: `
    <circle cx="50" cy="14" r="8" fill="none"/>
    <line x1="50" y1="22" x2="50" y2="54"/>
    <line x1="50" y1="34" x2="24" y2="46"/>
    <line x1="50" y1="34" x2="76" y2="46"/>
    <circle cx="24" cy="46" r="2.5" fill="currentColor"/>
    <circle cx="76" cy="46" r="2.5" fill="currentColor"/>
    <path d="M50,54 C34,54 18,60 16,74 C24,86 50,82 50,82 C50,82 76,86 84,74 C82,60 66,54 50,54Z"/>
    <circle cx="16" cy="74" r="2.5" fill="currentColor"/>
    <circle cx="84" cy="74" r="2.5" fill="currentColor"/>
    <circle cx="50" cy="82" r="2.5" fill="currentColor"/>`,

  recliningButterfly: `
    <circle cx="16" cy="32" r="8" fill="none"/>
    <line x1="24" y1="32" x2="84" y2="36"/>
    <line x1="44" y1="33" x2="38" y2="24"/>
    <line x1="44" y1="33" x2="58" y2="24"/>
    <circle cx="38" cy="24" r="2.5" fill="currentColor"/>
    <circle cx="58" cy="24" r="2.5" fill="currentColor"/>
    <path d="M60,35 C62,44 52,62 44,68 C52,72 76,68 82,56 C86,48 76,38 60,35Z"/>
    <path d="M60,35 C62,44 68,60 62,70 C54,74 36,66 32,54 C28,44 38,36 60,35Z"/>
    <circle cx="44" cy="68" r="2.5" fill="currentColor"/>
    <circle cx="62" cy="70" r="2.5" fill="currentColor"/>`,

  garland: `
    <circle cx="50" cy="12" r="8" fill="none"/>
    <line x1="50" y1="20" x2="50" y2="46"/>
    <line x1="50" y1="30" x2="26" y2="42"/>
    <line x1="50" y1="30" x2="74" y2="42"/>
    <circle cx="26" cy="42" r="2.5" fill="currentColor"/>
    <circle cx="74" cy="42" r="2.5" fill="currentColor"/>
    <line x1="26" y1="42" x2="28" y2="56"/>
    <line x1="74" y1="42" x2="72" y2="56"/>
    <line x1="28" y1="56" x2="32" y2="76"/>
    <line x1="72" y1="56" x2="68" y2="76"/>
    <circle cx="28" cy="56" r="2.5" fill="currentColor"/>
    <circle cx="72" cy="56" r="2.5" fill="currentColor"/>
    <circle cx="32" cy="76" r="2.5" fill="currentColor"/>
    <circle cx="68" cy="76" r="2.5" fill="currentColor"/>
    <line x1="32" y1="76" x2="68" y2="76"/>`,

  childPose: `
    <circle cx="76" cy="26" r="8" fill="none"/>
    <path d="M68,26 C58,28 44,38 28,44"/>
    <path d="M66,30 C60,36 50,40 36,44"/>
    <line x1="28" y1="44" x2="24" y2="66"/>
    <line x1="36" y1="44" x2="40" y2="66"/>
    <circle cx="24" cy="66" r="2.5" fill="currentColor"/>
    <circle cx="40" cy="66" r="2.5" fill="currentColor"/>
    <path d="M24,66 C28,72 36,74 40,66"/>
    <line x1="28" y1="44" x2="16" y2="52"/>
    <line x1="34" y1="40" x2="58" y2="34"/>
    <circle cx="16" cy="52" r="2.5" fill="currentColor"/>
    <circle cx="58" cy="34" r="2.5" fill="currentColor"/>`,

  cobra: `
    <circle cx="78" cy="30" r="8" fill="none"/>
    <path d="M70,34 C58,42 44,48 28,52"/>
    <line x1="28" y1="52" x2="22" y2="72"/>
    <line x1="34" y1="52" x2="38" y2="72"/>
    <circle cx="22" cy="72" r="2.5" fill="currentColor"/>
    <circle cx="38" cy="72" r="2.5" fill="currentColor"/>
    <line x1="22" y1="72" x2="38" y2="72"/>
    <line x1="62" y1="40" x2="52" y2="28"/>
    <line x1="62" y1="40" x2="76" y2="52"/>
    <circle cx="52" cy="28" r="2.5" fill="currentColor"/>
    <circle cx="76" cy="52" r="2.5" fill="currentColor"/>`,

  bridge: `
    <circle cx="18" cy="34" r="8" fill="none"/>
    <path d="M26,36 C36,34 48,30 62,24"/>
    <path d="M26,40 C38,42 52,40 66,38"/>
    <line x1="62" y1="24" x2="70" y2="44"/>
    <line x1="66" y1="38" x2="72" y2="58"/>
    <circle cx="70" cy="44" r="2.5" fill="currentColor"/>
    <circle cx="72" cy="58" r="2.5" fill="currentColor"/>
    <line x1="70" y1="44" x2="86" y2="50"/>
    <circle cx="86" cy="50" r="2.5" fill="currentColor"/>
    <line x1="26" y1="40" x2="22" y2="60"/>
    <line x1="30" y1="38" x2="30" y2="60"/>
    <circle cx="22" cy="60" r="2.5" fill="currentColor"/>
    <circle cx="30" cy="60" r="2.5" fill="currentColor"/>`,

  warriorII: `
    <circle cx="50" cy="12" r="8" fill="none"/>
    <line x1="50" y1="20" x2="50" y2="52"/>
    <line x1="50" y1="32" x2="18" y2="32"/>
    <line x1="50" y1="32" x2="82" y2="32"/>
    <circle cx="18" cy="32" r="2.5" fill="currentColor"/>
    <circle cx="82" cy="32" r="2.5" fill="currentColor"/>
    <line x1="50" y1="52" x2="28" y2="68"/>
    <line x1="50" y1="52" x2="72" y2="52"/>
    <circle cx="28" cy="68" r="2.5" fill="currentColor"/>
    <circle cx="72" cy="52" r="2.5" fill="currentColor"/>
    <line x1="28" y1="68" x2="20" y2="86"/>
    <line x1="72" y1="52" x2="80" y2="72"/>
    <circle cx="20" cy="86" r="2.5" fill="currentColor"/>
    <circle cx="80" cy="72" r="2.5" fill="currentColor"/>`,

  legsUpWall: `
    <circle cx="18" cy="68" r="8" fill="none"/>
    <line x1="26" y1="68" x2="76" y2="64"/>
    <line x1="26" y1="72" x2="62" y2="76"/>
    <line x1="76" y1="64" x2="82" y2="42"/>
    <line x1="72" y1="66" x2="78" y2="44"/>
    <circle cx="82" cy="42" r="2.5" fill="currentColor"/>
    <circle cx="78" cy="44" r="2.5" fill="currentColor"/>
    <line x1="82" y1="42" x2="82" y2="18"/>
    <line x1="78" y1="44" x2="78" y2="20"/>
    <circle cx="82" cy="18" r="2.5" fill="currentColor"/>
    <circle cx="78" cy="20" r="2.5" fill="currentColor"/>
    <line x1="26" y1="66" x2="20" y2="54"/>
    <line x1="26" y1="66" x2="30" y2="54"/>
    <circle cx="20" cy="54" r="2.5" fill="currentColor"/>
    <circle cx="30" cy="54" r="2.5" fill="currentColor"/>`,

  savasana: `
    <circle cx="18" cy="50" r="8" fill="none"/>
    <line x1="26" y1="50" x2="82" y2="52"/>
    <line x1="42" y1="48" x2="38" y2="34"/>
    <line x1="48" y1="48" x2="54" y2="34"/>
    <circle cx="38" cy="34" r="2.5" fill="currentColor"/>
    <circle cx="54" cy="34" r="2.5" fill="currentColor"/>
    <line x1="68" y1="51" x2="62" y2="68"/>
    <line x1="74" y1="51" x2="80" y2="68"/>
    <circle cx="62" cy="68" r="2.5" fill="currentColor"/>
    <circle cx="80" cy="68" r="2.5" fill="currentColor"/>`,

  catCow: `
    <circle cx="20" cy="38" r="8" fill="none"/>
    <path d="M28,40 C42,54 58,54 78,46"/>
    <line x1="78" y1="46" x2="84" y2="30"/>
    <circle cx="84" cy="30" r="2.5" fill="currentColor"/>
    <line x1="36" y1="50" x2="32" y2="68"/>
    <line x1="50" y1="56" x2="48" y2="74"/>
    <line x1="64" y1="52" x2="66" y2="70"/>
    <line x1="74" y1="48" x2="78" y2="66"/>
    <circle cx="32" cy="68" r="2.5" fill="currentColor"/>
    <circle cx="48" cy="74" r="2.5" fill="currentColor"/>
    <circle cx="66" cy="70" r="2.5" fill="currentColor"/>
    <circle cx="78" cy="66" r="2.5" fill="currentColor"/>`,

  seatedForward: `
    <circle cx="18" cy="28" r="8" fill="none"/>
    <path d="M22,34 C28,44 32,52 28,62"/>
    <path d="M24,32 C36,40 48,42 62,40"/>
    <circle cx="62" cy="40" r="2.5" fill="currentColor"/>
    <line x1="28" y1="62" x2="80" y2="66"/>
    <line x1="62" y1="40" x2="76" y2="60"/>
    <circle cx="80" cy="66" r="2.5" fill="currentColor"/>
    <circle cx="76" cy="60" r="2.5" fill="currentColor"/>
    <line x1="80" y1="66" x2="76" y2="60"/>
    <line x1="22" y1="34" x2="14" y2="46"/>
    <circle cx="14" cy="46" r="2.5" fill="currentColor"/>`,

  supineSpinal: `
    <circle cx="18" cy="50" r="8" fill="none"/>
    <line x1="26" y1="52" x2="72" y2="50"/>
    <line x1="42" y1="48" x2="36" y2="32"/>
    <line x1="48" y1="48" x2="56" y2="32"/>
    <circle cx="36" cy="32" r="2.5" fill="currentColor"/>
    <circle cx="56" cy="32" r="2.5" fill="currentColor"/>
    <line x1="72" y1="50" x2="64" y2="34"/>
    <line x1="72" y1="50" x2="80" y2="70"/>
    <circle cx="64" cy="34" r="2.5" fill="currentColor"/>
    <circle cx="80" cy="70" r="2.5" fill="currentColor"/>`,
};

// ── Sequence library ─────────────────────────────────────────
export const YOGA_SEQUENCES: YogaSequence[] = [
  {
    title: "Today's yoga",
    subtitle: "3×/week · 20 min · restorative only",
    modes: ["pcos"],
    phase: ["all"],
    poses: [
      { name: "Butterfly pose", sanskrit: "Baddha Konasana", duration: 180, benefit: "Irregular periods", benefitBg: "#FCE8EF", benefitColor: "#C9577A", svgBody: POSES.butterfly },
      { name: "Reclining butterfly", sanskrit: "Supta Baddha Konasana", duration: 300, benefit: "Anxiety + Periods", benefitBg: "#FFF3DC", benefitColor: "#B37D20", svgBody: POSES.recliningButterfly },
      { name: "Garland pose", sanskrit: "Malasana", duration: 120, benefit: "Ovary stimulation", benefitBg: "#E6F7F2", benefitColor: "#2A7A5C", svgBody: POSES.garland },
      { name: "Bridge pose", sanskrit: "Setu Bandhasana", duration: 150, benefit: "Hormone balance", benefitBg: "#F0EBF9", benefitColor: "#6B3FAA", svgBody: POSES.bridge },
      { name: "Legs up the wall", sanskrit: "Viparita Karani", duration: 240, benefit: "Cortisol relief", benefitBg: "#E8F0FE", benefitColor: "#3558A8", svgBody: POSES.legsUpWall },
    ],
  },
  {
    title: "Today's yoga",
    subtitle: "Daily · 15 min · gentle flow",
    modes: ["regular"],
    phase: ["menstrual"],
    poses: [
      { name: "Child's pose", sanskrit: "Balasana", duration: 180, benefit: "Cramp relief", benefitBg: "#FCE8EF", benefitColor: "#C9577A", svgBody: POSES.childPose },
      { name: "Supine spinal twist", sanskrit: "Supta Matsyendrasana", duration: 120, benefit: "Lower back ease", benefitBg: "#FFF3DC", benefitColor: "#B37D20", svgBody: POSES.supineSpinal },
      { name: "Reclining butterfly", sanskrit: "Supta Baddha Konasana", duration: 240, benefit: "Pelvic release", benefitBg: "#F0EBF9", benefitColor: "#6B3FAA", svgBody: POSES.recliningButterfly },
      { name: "Savasana", sanskrit: "Corpse pose", duration: 180, benefit: "Deep rest", benefitBg: "#E6F7F2", benefitColor: "#2A7A5C", svgBody: POSES.savasana },
    ],
  },
  {
    title: "Today's yoga",
    subtitle: "4×/week · 20 min · energising",
    modes: ["regular"],
    phase: ["follicular"],
    poses: [
      { name: "Cat–Cow", sanskrit: "Marjaryasana", duration: 120, benefit: "Spine mobility", benefitBg: "#FFF3DC", benefitColor: "#B37D20", svgBody: POSES.catCow },
      { name: "Cobra pose", sanskrit: "Bhujangasana", duration: 90, benefit: "Energy boost", benefitBg: "#FCE8EF", benefitColor: "#C9577A", svgBody: POSES.cobra },
      { name: "Warrior II", sanskrit: "Virabhadrasana II", duration: 150, benefit: "Strength + focus", benefitBg: "#E8F0FE", benefitColor: "#3558A8", svgBody: POSES.warriorII },
      { name: "Seated forward fold", sanskrit: "Paschimottanasana", duration: 120, benefit: "Hamstring release", benefitBg: "#E6F7F2", benefitColor: "#2A7A5C", svgBody: POSES.seatedForward },
    ],
  },
  {
    title: "Today's yoga",
    subtitle: "3×/week · 20 min · calming",
    modes: ["regular"],
    phase: ["luteal"],
    poses: [
      { name: "Child's pose", sanskrit: "Balasana", duration: 180, benefit: "Nervous system calm", benefitBg: "#F0EBF9", benefitColor: "#6B3FAA", svgBody: POSES.childPose },
      { name: "Butterfly pose", sanskrit: "Baddha Konasana", duration: 180, benefit: "PMS ease", benefitBg: "#FCE8EF", benefitColor: "#C9577A", svgBody: POSES.butterfly },
      { name: "Legs up the wall", sanskrit: "Viparita Karani", duration: 300, benefit: "Anxiety relief", benefitBg: "#E8F0FE", benefitColor: "#3558A8", svgBody: POSES.legsUpWall },
      { name: "Savasana", sanskrit: "Corpse pose", duration: 180, benefit: "Deep rest", benefitBg: "#E6F7F2", benefitColor: "#2A7A5C", svgBody: POSES.savasana },
    ],
  },
  {
    title: "Today's yoga",
    subtitle: "Daily · 20 min · fertility flow",
    modes: ["conceive"],
    phase: ["all"],
    poses: [
      { name: "Butterfly pose", sanskrit: "Baddha Konasana", duration: 180, benefit: "Pelvic circulation", benefitBg: "#FCE8EF", benefitColor: "#C9577A", svgBody: POSES.butterfly },
      { name: "Bridge pose", sanskrit: "Setu Bandhasana", duration: 150, benefit: "Reproductive health", benefitBg: "#E6F7F2", benefitColor: "#2A7A5C", svgBody: POSES.bridge },
      { name: "Garland pose", sanskrit: "Malasana", duration: 120, benefit: "Hip opening", benefitBg: "#FFF3DC", benefitColor: "#B37D20", svgBody: POSES.garland },
      { name: "Reclining butterfly", sanskrit: "Supta Baddha Konasana", duration: 240, benefit: "Ovarian support", benefitBg: "#F0EBF9", benefitColor: "#6B3FAA", svgBody: POSES.recliningButterfly },
      { name: "Legs up the wall", sanskrit: "Viparita Karani", duration: 300, benefit: "Post-ovulation rest", benefitBg: "#E8F0FE", benefitColor: "#3558A8", svgBody: POSES.legsUpWall },
    ],
  },
];

export function getSequenceForMode(mode: Mode, phase = "follicular"): YogaSequence {
  const candidates = YOGA_SEQUENCES.filter(
    s => s.modes.includes(mode) && (s.phase.includes(phase) || s.phase.includes("all"))
  );
  return candidates[0] ?? YOGA_SEQUENCES[0];
}

// ── Pose SVG card ────────────────────────────────────────────
export function PoseSVG({ svgBody, color, size }: { svgBody: string; color: string; size: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      fill="none" stroke={color} strokeWidth="3.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block" }}
      dangerouslySetInnerHTML={{ __html: svgBody }}
    />
  );
}

// ── Sequence Player (no audio) ────────────────────────────────
export function YogaSequencePlayer({ sequence, onClose }: { sequence: YogaSequence; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(sequence.poses[0].duration);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const pose = sequence.poses[idx];
  const total = sequence.poses.length;
  const totalSec = sequence.poses.reduce((a, p) => a + p.duration, 0);
  const elapsedSec = sequence.poses.slice(0, idx).reduce((a, p) => a + p.duration, 0) + (pose.duration - remaining);
  const overallPct = (elapsedSec / totalSec) * 100;
  const circ = 2 * Math.PI * 90;
  const off = circ * (1 - remaining / pose.duration);

  function fmtClock(s: number) { const m = Math.floor(s / 60), x = s % 60; return `${m}:${x < 10 ? "0" + x : x}`; }

  function startTick() {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          const ni = idx + 1;
          if (ni >= total) { setDone(true); clearInterval(timer.current!); return 0; }
          setIdx(ni);
          setRemaining(sequence.poses[ni].duration);
          return sequence.poses[ni].duration;
        }
        return r - 1;
      });
    }, 1000);
  }

  useEffect(() => { startTick(); return () => { if (timer.current) clearInterval(timer.current); }; }, [idx]);

  function togglePause() {
    if (paused) startTick(); else { if (timer.current) clearInterval(timer.current); }
    setPaused(p => !p);
  }
  function skipNext() { if (timer.current) clearInterval(timer.current); const ni = Math.min(idx + 1, total - 1); if (ni === idx && !done) { setDone(true); return; } setIdx(ni); setRemaining(sequence.poses[ni].duration); setPaused(false); }
  function skipPrev() { if (timer.current) clearInterval(timer.current); const ni = Math.max(idx - 1, 0); setIdx(ni); setRemaining(sequence.poses[ni].duration); setPaused(false); }

  const ACCENT = "#E26D8A";
  const nextPose = sequence.poses[idx + 1];

  if (done) {
    const totalMin = Math.round(totalSec / 60);
    return (
      <div style={{ position:"fixed", inset:0, zIndex:95, background:"linear-gradient(165deg,#9C7CC1,#E26D8A)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px 30px" }}>
        <div style={{ width:104, height:104, borderRadius:"50%", background:"rgba(255,255,255,.95)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, boxShadow:"0 12px 36px rgba(0,0,0,.2)" }}>
          <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#E26D8A" strokeWidth="2.6" strokeLinecap="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>
        </div>
        <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(255,255,255,.85)", marginBottom:6 }}>Sequence complete</div>
        <div style={{ fontSize:26, fontWeight:800, color:"#fff", marginBottom:4, letterSpacing:-0.5 }}>{sequence.title}</div>
        <div style={{ fontSize:14.5, color:"rgba(255,255,255,.9)", marginBottom:28 }}>Beautiful — you showed up for yourself today.</div>
        <div style={{ display:"flex", gap:12, marginBottom:32 }}>
          {[[String(total),"poses"],[String(totalMin),"minutes"]].map(([v,l]) => (
            <div key={l} style={{ background:"rgba(255,255,255,.18)", borderRadius:16, padding:"12px 22px" }}>
              <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>{v}</div>
              <div style={{ fontSize:11.5, color:"rgba(255,255,255,.85)", fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ background:"#fff", color:"#9C7CC1", border:"none", fontWeight:700, fontSize:15, padding:"16px 48px", borderRadius:999, cursor:"pointer", fontFamily:"inherit" }}>Finish</button>
      </div>
    );
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:95, background:"#17121d", display:"flex", flexDirection:"column" }}>
      {/* Overall progress bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"rgba(255,255,255,.2)", zIndex:4 }}>
        <div style={{ height:"100%", background:"linear-gradient(90deg,#9C7CC1,#E26D8A)", width:`${overallPct}%`, transition:"width .4s linear" }}/>
      </div>

      {/* Stage */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:`linear-gradient(165deg,#1a0f2e,#2a1230)`, position:"relative" }}>
        {/* Ambient blobs */}
        <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"rgba(156,124,193,.18)", top:-40, left:-60, animation:"floaty 8s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:140, height:140, borderRadius:"50%", background:"rgba(226,109,138,.15)", bottom:20, right:-30, animation:"floaty 6s ease-in-out infinite reverse" }}/>

        {/* Top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"52px 18px 0", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:3 }}>
          <button onClick={onClose} style={{ width:40, height:40, borderRadius:"50%", border:"none", background:"rgba(255,255,255,.15)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff", fontSize:18 }}>✕</button>
          <div style={{ color:"#fff", fontSize:13, fontWeight:700, letterSpacing:.3, background:"rgba(255,255,255,.14)", padding:"6px 14px", borderRadius:999 }}>{idx + 1} / {total}</div>
          <div style={{ width:40 }}/>
        </div>

        {/* Countdown ring + pose SVG */}
        <div style={{ position:"relative", width:220, height:220, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="220" height="220" viewBox="0 0 220 220" style={{ position:"absolute", transform:"rotate(-90deg)" }}>
            <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="5"/>
            <circle cx="110" cy="110" r="90" fill="none" stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circ.toFixed(1)} strokeDashoffset={off.toFixed(1)} style={{ transition:"stroke-dashoffset .9s linear" }}/>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9C7CC1"/>
                <stop offset="100%" stopColor="#E26D8A"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ animation: paused ? "none" : "breathe 4.4s ease-in-out infinite" }}>
            <PoseSVG svgBody={pose.svgBody} color="rgba(255,255,255,.95)" size={118} />
          </div>
        </div>
      </div>

      {/* Bottom panel */}
      <div style={{ background:"#fff", borderRadius:"30px 30px 0 0", padding:"20px 22px 28px", boxShadow:"0 -12px 34px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"inline-block", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:pose.benefitBg, color:pose.benefitColor, marginBottom:6 }}>{pose.benefit}</div>
            <div style={{ fontSize:22, fontWeight:800, color:"#2E2329", letterSpacing:-0.4, lineHeight:1.12 }}>{pose.name}</div>
            <div style={{ fontSize:13, color:"#9C7CC1", fontStyle:"italic", marginTop:3 }}>{pose.sanskrit}</div>
          </div>
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:30, fontWeight:800, color:"#2E2329", letterSpacing:-0.5, fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{fmtClock(remaining)}</div>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", color:"#A89AA0", marginTop:2 }}>left</div>
          </div>
        </div>

        {/* Next pose */}
        {nextPose && (
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14, padding:"10px 14px", background:"#FCF8F6", borderRadius:14 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:.4, textTransform:"uppercase", color:"#A89AA0" }}>Next</span>
            <div style={{ width:28, height:28, flexShrink:0 }}>
              <PoseSVG svgBody={nextPose.svgBody} color="#9C7CC1" size={28} />
            </div>
            <span style={{ fontSize:14, fontWeight:700, color:"#2E2329", flex:1 }}>{nextPose.name}</span>
            <span style={{ fontSize:12, fontWeight:600, color:"#A89AA0" }}>{Math.floor(nextPose.duration / 60)} min</span>
          </div>
        )}

        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginTop:18 }}>
          <button onClick={skipPrev} style={{ width:52, height:52, borderRadius:"50%", border:"1.5px solid #F0E2DE", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:22 }}>⏮</button>
          <button onClick={togglePause} style={{ width:74, height:74, borderRadius:"50%", border:"none", background:"linear-gradient(135deg,#9C7CC1,#E26D8A)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 26px rgba(156,124,193,.4)", cursor:"pointer", fontSize:30 }}>
            {paused ? "▶" : "⏸"}
          </button>
          <button onClick={skipNext} style={{ width:52, height:52, borderRadius:"50%", border:"1.5px solid #F0E2DE", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:22 }}>⏭</button>
        </div>
      </div>
    </div>
  );
}

// ── Today's yoga section (home card) ─────────────────────────
export function TodayYogaSection({ mode, onStart }: { mode: Mode; onStart: (s: YogaSequence) => void }) {
  const seq = getSequenceForMode(mode);
  const CARD_SHADOW = "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)";
  const previewPoses = seq.poses.slice(0, 3);

  return (
    <div style={{ background:"#fff", borderRadius:26, boxShadow:CARD_SHADOW, border:"1px solid #F6ECE8", padding:"18px 16px 16px" }}>
      <div style={{ marginBottom:4 }}>
        <h3 style={{ fontSize:18, fontWeight:800, color:"#2E2329", letterSpacing:-0.3, margin:0 }}>{seq.title}</h3>
        <p style={{ fontSize:12.5, color:"#A89AA0", margin:"4px 0 14px", fontWeight:500 }}>{seq.subtitle}</p>
      </div>

      {/* Pose preview cards — horizontal scroll */}
      <div style={{ display:"flex", gap:10, overflowX:"auto", margin:"0 -16px", padding:"0 16px 4px" }} className="scrollbar-hide">
        {previewPoses.map((pose, i) => (
          <div key={i} style={{ flexShrink:0, width:140, background:"#FAFAFA", border:"1px solid #F0E2DE", borderRadius:16, padding:"14px 12px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <PoseSVG svgBody={pose.svgBody} color="#9C7CC1" size={72} />
            <div style={{ fontSize:13.5, fontWeight:700, color:"#2E2329", textAlign:"center", lineHeight:1.2 }}>{pose.name}</div>
            <div style={{ fontSize:11.5, color:"#9C7CC1", fontStyle:"italic", textAlign:"center", lineHeight:1.2 }}>{pose.sanskrit}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5, width:"100%", marginTop:2 }}>
              <span style={{ display:"inline-flex", alignSelf:"flex-start", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:700, background:"#F0EBF9", color:"#6B3FAA" }}>
                {Math.floor(pose.duration / 60)} min
              </span>
              <span style={{ display:"inline-flex", alignSelf:"flex-start", padding:"3px 9px", borderRadius:999, fontSize:11, fontWeight:600, background:pose.benefitBg, color:pose.benefitColor, lineHeight:1.3 }}>
                {pose.benefit}
              </span>
            </div>
          </div>
        ))}
        {seq.poses.length > 3 && (
          <div style={{ flexShrink:0, width:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:13, color:"#A89AA0", fontWeight:600 }}>+{seq.poses.length - 3}</span>
          </div>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(seq)}
        style={{ width:"100%", marginTop:14, border:"none", background:"linear-gradient(120deg,#9C7CC1,#E26D8A)", color:"#fff", fontWeight:700, fontSize:15.5, padding:"15px 22px", borderRadius:999, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 8px 22px rgba(156,124,193,.35)", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
        Start sequence →
      </button>
    </div>
  );
}
