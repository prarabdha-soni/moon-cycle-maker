import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [{ title: "Calendar — SheThrives" }],
  }),
  component: CalendarScreen,
});

const ACCENT = "#E26D8A";
const ACCENT_DEEP = "#C9577A";
const ACCENT_SOFT = "#FBE7EC";
const PH = { menstrual: "#E26D8A", follicular: "#F2B6C4", ovulation: "#7FB59A", luteal: "#C7B4DF" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEK_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAYMS = 86400000;
const TODAY = new Date(2026, 5, 3);
const TODAY_KEY = "2026-06-03";

type Mode = "regular" | "pcos" | "conceive";

interface DayLog { flow?: string; mood?: string | null; symptoms?: string[]; note?: string; }
interface Draft { flow: string; mood: string | null; symptoms: string[]; note: string; }

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

function pad(n: number) { return n < 10 ? "0" + n : "" + n; }
function fmt(d: Date) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function parseD(s: string) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

function cycleModel(mode: Mode) {
  if (mode === "pcos") return { anchor: new Date(2026, 4, 4), cycleLen: 35, periodLen: 6, irregular: true };
  if (mode === "conceive") return { anchor: new Date(2026, 4, 21), cycleLen: 28, periodLen: 5, irregular: false };
  return { anchor: new Date(2026, 4, 23), cycleLen: 28, periodLen: 5, irregular: false };
}

function calcMarks(mode: Mode, year: number, month: number) {
  const m = cycleModel(mode);
  const marks: Record<string, { period?: boolean; predicted?: boolean; fertile?: boolean; ovu?: boolean }> = {};
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let s = new Date(m.anchor);
  while (s.getTime() > first.getTime() - 10 * DAYMS) s = new Date(s.getTime() - m.cycleLen * DAYMS);
  for (; s.getTime() < last.getTime() + m.cycleLen * DAYMS; s = new Date(s.getTime() + m.cycleLen * DAYMS)) {
    for (let i = 0; i < m.periodLen; i++) {
      const pd = new Date(s.getTime() + i * DAYMS), k = fmt(pd);
      marks[k] = marks[k] || {};
      if (pd.getTime() <= TODAY.getTime()) marks[k].period = true; else marks[k].predicted = true;
    }
    if (!m.irregular) {
      const ovu = new Date(s.getTime() + (m.cycleLen - 14) * DAYMS);
      for (let f = -4; f <= 1; f++) { const fd = new Date(ovu.getTime() + f * DAYMS), fk = fmt(fd); marks[fk] = marks[fk] || {}; marks[fk].fertile = true; }
      const ok = fmt(ovu); marks[ok] = marks[ok] || {}; marks[ok].ovu = true;
    }
  }
  return marks;
}

function phaseLabel(mode: Mode, key: string) {
  const d = parseD(key);
  const marks = calcMarks(mode, d.getFullYear(), d.getMonth())[key] || {};
  if (marks.period) return { l: "Period day", c: PH.menstrual };
  if (marks.predicted) return { l: "Predicted period", c: PH.menstrual };
  if (marks.ovu) return { l: "Ovulation day", c: "#3F7A5F" };
  if (marks.fertile) return { l: "Fertile window", c: "#3F7A5F" };
  const m = cycleModel(mode);
  const diff = Math.round((d.getTime() - m.anchor.getTime()) / DAYMS);
  const cd = ((diff % m.cycleLen) + m.cycleLen) % m.cycleLen + 1;
  if (cd <= m.periodLen) return { l: "Period day", c: PH.menstrual };
  if (cd < m.cycleLen - 14) return { l: "Follicular phase", c: "#C98AA0" };
  return { l: "Luteal phase", c: "#9277B8" };
}

const CARD_SHADOW = "0 1px 2px rgba(70,35,48,.04), 0 10px 30px rgba(170,90,115,.07)";

function LogSheet({ date, logs, onClose, onSave }: {
  date: string; logs: Record<string, DayLog>;
  onClose: () => void; onSave: (d: string, log: DayLog) => void;
}) {
  const d = parseD(date);
  const longDate = `${WEEK_SHORT[(d.getDay() + 6) % 7]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  const ex = logs[date];
  const [draft, setDraft] = useState<Draft>({
    flow: ex?.flow || "none",
    mood: ex?.mood || null,
    symptoms: ex?.symptoms?.slice() || [],
    note: ex?.note || "",
  });

  const flows = [["none","None"],["light","Light"],["medium","Medium"],["heavy","Heavy"]];
  const FLOW_IC = ["⚪","💧","💧💧","💧💧💧"];
  const moods = [["great","Great"],["good","Good"],["okay","Okay"],["low","Low"],["awful","Awful"]];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(46,35,41,.42)", backdropFilter: "blur(2px)" }} />
      <div className="sheet-up" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 81, background: "#fff", borderRadius: "30px 30px 0 0", boxShadow: "0 -16px 50px rgba(80,40,55,.25)", maxHeight: "82%", display: "flex", flexDirection: "column", maxWidth: 428, margin: "0 auto" }}>
        <div style={{ width: 42, height: 5, borderRadius: 999, background: "#F0E2DE", margin: "12px auto 6px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 22px 6px" }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: ACCENT }}>Daily log</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#2E2329", letterSpacing: -0.3 }}>{longDate}</div>
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "#FCF8F6", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#705F66" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "4px 22px 16px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#A89AA0", margin: "22px 0 11px" }}>Flow</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {flows.map(([v, l], i) => {
              const on = draft.flow === v;
              return (
                <button key={v} onClick={() => setDraft(p => ({ ...p, flow: v }))}
                  style={{ border: `1.5px solid ${on ? ACCENT : "#F0E2DE"}`, background: on ? ACCENT : "#fff", borderRadius: 15, padding: "12px 4px", fontFamily: "inherit", fontSize: 12.5, fontWeight: 600, color: on ? "#fff" : "#705F66", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <span>{FLOW_IC[i]}</span>{l}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#A89AA0", margin: "22px 0 11px" }}>Mood</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {moods.map(([v, l]) => {
              const on = draft.mood === v;
              return (
                <button key={v} onClick={() => setDraft(p => ({ ...p, mood: p.mood === v ? null : v }))}
                  style={{ padding: "11px 17px", fontSize: 14, fontWeight: 600, borderRadius: 999, border: `1px solid ${on ? ACCENT : "#F0E2DE"}`, background: on ? ACCENT : "#fff", color: on ? "#fff" : "#705F66", cursor: "pointer", fontFamily: "inherit" }}>
                  {l}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#A89AA0", margin: "22px 0 11px" }}>Symptoms</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {SYMPTOMS.map(sy => {
              const on = draft.symptoms.includes(sy.k);
              return (
                <button key={sy.k} onClick={() => setDraft(p => ({ ...p, symptoms: on ? p.symptoms.filter(x => x !== sy.k) : [...p.symptoms, sy.k] }))}
                  style={{ border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: 0, cursor: "pointer", fontFamily: "inherit" }}>
                  <span style={{ width: "100%", aspectRatio: "1", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: on ? ACCENT : "#fff", border: `1.5px solid ${on ? ACCENT : "#F0E2DE"}`, boxShadow: CARD_SHADOW, fontSize: 23 }}>{sy.ic}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: on ? "#2E2329" : "#705F66" }}>{sy.l}</span>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#A89AA0", margin: "22px 0 11px" }}>Notes</div>
          <textarea rows={3} placeholder="How are you feeling today?" value={draft.note} onChange={e => setDraft(p => ({ ...p, note: e.target.value }))}
            style={{ width: "100%", fontFamily: "inherit", fontSize: 14.5, color: "#2E2329", background: "#FCF8F6", border: "1.5px solid #F0E2DE", borderRadius: 16, padding: "13px 15px", outline: "none", resize: "none", lineHeight: 1.45, boxSizing: "border-box" }} />
          <div style={{ height: 14 }} />
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: "1px solid #F6ECE8" }}>
          <button onClick={() => { onSave(date, draft); onClose(); }}
            style={{ border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 26px", borderRadius: 999, boxShadow: `0 8px 22px rgba(226,109,138,.28)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", cursor: "pointer", fontFamily: "inherit" }}>
            ✓ Save log
          </button>
        </div>
      </div>
    </>
  );
}

function InsightsView({ mode, logs }: { mode: Mode; logs: Record<string, DayLog> }) {
  const hist = mode === "pcos" ? [40,33,29,44,36,31] : mode === "conceive" ? [28,29,28,27,29,28] : [29,28,27,29,28,28];
  const avg = Math.round(hist.reduce((a, b) => a + b, 0) / hist.length);
  const labels = ["Jan","Feb","Mar","Apr","May","Jun"];
  const symCount: Record<string, number> = {};
  let loggedDays = 0;
  Object.values(logs).forEach(L => {
    loggedDays++;
    (L.symptoms || []).forEach(sy => { symCount[sy] = (symCount[sy] || 0) + 1; });
  });
  const syms = Object.keys(symCount).map(k => ({ k, n: symCount[k] })).sort((a, b) => b.n - a.n);
  const symLbl = (k: string) => SYMPTOMS.find(s => s.k === k)?.l || k;
  const maxH = Math.max(...hist), minH = Math.min(...hist);

  return (
    <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[["Avg cycle",`${avg}d`,"last 6"],["Logged",`${loggedDays}`,"days"],["Regularity",mode==="pcos"?"Irregular":"Regular","pattern"]].map(([label,val,sub]) => (
          <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 18, padding: "14px 10px", textAlign: "center", border: "1px solid #F6ECE8", boxShadow: CARD_SHADOW }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".6px", textTransform: "uppercase", color: "#A89AA0" }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT, margin: "4px 0 1px" }}>{val}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#705F66" }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: "18px 16px 12px" }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: "#2E2329", marginBottom: 2 }}>Cycle length</div>
        <div style={{ fontSize: 12.5, color: "#705F66", marginBottom: 12 }}>{mode==="pcos"?"Your cycles vary — common with PCOS.":"Nicely consistent over recent months."}</div>
        <svg width="100%" viewBox="0 0 300 150" style={{ display: "block" }}>
          {(() => {
            const avgY = 120 - ((avg-(minH-2))/((maxH+2)-(minH-2)))*100;
            return (<>
              <line x1="0" y1={avgY.toFixed(1)} x2="300" y2={avgY.toFixed(1)} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
              <text x="298" y={(avgY-5).toFixed(1)} textAnchor="end" fontSize="11" fontWeight="700" fill={ACCENT}>avg {avg}d</text>
              {hist.map((v,i)=>{
                const h=((v-(minH-2))/((maxH+2)-(minH-2)))*100;
                const x=i*(300/hist.length)+(300/hist.length)/2;
                return (<g key={i}>
                  <rect x={(x-13).toFixed(1)} y={(120-h).toFixed(1)} width="26" height={h.toFixed(1)} rx="7" fill={i===hist.length-1?ACCENT:ACCENT_SOFT}/>
                  <text x={x.toFixed(1)} y={(118-h).toFixed(1)} textAnchor="middle" fontSize="11" fontWeight="700" fill="#705F66">{v}</text>
                  <text x={x.toFixed(1)} y="138" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#A89AA0">{labels[i]}</text>
                </g>);
              })}
            </>);
          })()}
        </svg>
      </div>
      {syms.length>0 && (
        <div style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: 18 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: "#2E2329", marginBottom: 14 }}>Most-logged symptoms</div>
          {syms.slice(0,5).map(sy=>(
            <div key={sy.k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 11 }}>
              <span style={{ width: 74, fontSize: 13, fontWeight: 600, color: "#2E2329", flexShrink: 0 }}>{symLbl(sy.k)}</span>
              <span style={{ flex: 1, height: 10, borderRadius: 999, background: "#F6ECE8", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${Math.round((sy.n/syms[0].n)*100)}%`, borderRadius: 999, background: `linear-gradient(90deg,${ACCENT},${ACCENT_DEEP})` }}/>
              </span>
              <span style={{ width: 18, textAlign: "right", fontSize: 12.5, fontWeight: 700, color: "#705F66" }}>{sy.n}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 15, fontWeight: 800, color: "#2E2329", letterSpacing: -0.2, marginTop: 2 }}>Patterns we noticed</div>
      {[
        mode==="pcos"?"Consistent gentle movement and steady meals help smooth out PCOS cycle swings.":"Your energy tends to climb in the follicular phase — a good time to push a little.",
        `You've logged ${loggedDays} days. The more you track, the sharper your predictions get.`,
      ].map((txt,i)=>(
        <div key={i} style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: "15px 16px", display: "flex", gap: 13, alignItems: "flex-start" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: ACCENT_SOFT, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{i===0?"🌿":"📅"}</div>
          <div style={{ flex: 1, fontSize: 13.5, color: "#2E2329", lineHeight: 1.5, paddingTop: 2 }}>{txt}</div>
        </div>
      ))}
      <div style={{ height: 8 }} />
    </div>
  );
}

function CalendarScreen() {
  const [mode, setMode] = useState<Mode>("regular");
  const [calView, setCalView] = useState<"calendar"|"insights">("calendar");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(5);
  const [selDate, setSelDate] = useState(TODAY_KEY);
  const [logs, setLogs] = useState<Record<string,DayLog>>({
    "2026-05-23":{flow:"medium",mood:"low",symptoms:["cramps","mood"],note:""},
    "2026-05-24":{flow:"heavy",mood:"low",symptoms:["cramps","headache"],note:"Rough first day."},
    "2026-05-25":{flow:"medium",mood:"okay",symptoms:["bloating"],note:""},
    "2026-05-26":{flow:"light",mood:"okay",symptoms:[],note:""},
    "2026-06-01":{flow:"none",mood:"great",symptoms:["energy"],note:"Felt amazing on my morning run."},
    "2026-06-02":{flow:"none",mood:"good",symptoms:["skin"],note:""},
  });
  const [logOpen, setLogOpen] = useState(false);
  const [logDate, setLogDate] = useState(TODAY_KEY);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const m = window.localStorage.getItem("petal:mode") as Mode|null;
      if (m) setMode(m);
    }
  }, []);

  const marks = calcMarks(mode, calYear, calMonth);
  const first = new Date(calYear, calMonth, 1);
  const lead = (first.getDay() + 6) % 7;
  const dim = new Date(calYear, calMonth+1, 0).getDate();
  const totalCells = Math.ceil((lead+dim)/7)*7;

  function prevMonth() { if (calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }
  function nextMonth() { if (calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }

  const selPh = phaseLabel(mode, selDate);
  const selD = parseD(selDate);
  const selLong = `${WEEK_SHORT[(selD.getDay()+6)%7]}, ${MONTHS[selD.getMonth()]} ${selD.getDate()}`;
  const selLog = logs[selDate];
  const FLOW_LBL: Record<string,string> = {none:"No flow",light:"Light flow",medium:"Medium flow",heavy:"Heavy flow"};

  return (
    <AppShell>
      <div className="fade-in" style={{ minHeight: "100%", background: "linear-gradient(180deg,#FCF5F2 0%,#FBF3F0 100%)" }}>
        <div style={{ padding: "60px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#2E2329", letterSpacing: -0.6, marginBottom: 4 }}>{calView==="insights"?"Insights":"Calendar"}</h1>
              <p style={{ fontSize: 14.5, color: "#705F66", margin: 0 }}>{calView==="insights"?"Patterns from what you log.":"Your history at a glance."}</p>
            </div>
            {calView==="calendar" && (
              <button onClick={()=>{setCalYear(2026);setCalMonth(5);setSelDate(TODAY_KEY);}}
                style={{ background: "#fff", border: "1px solid #F0E2DE", borderRadius: 999, padding: "0 15px", height: 38, fontSize: 13, fontWeight: 700, color: ACCENT, cursor: "pointer", fontFamily: "inherit" }}>
                Today
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 5, background: "#fff", border: "1px solid #F0E2DE", borderRadius: 999, padding: 5, boxShadow: CARD_SHADOW }}>
            {(["calendar","insights"] as const).map(v=>(
              <button key={v} onClick={()=>setCalView(v)}
                style={{ flex: 1, border: "none", borderRadius: 999, padding: 9, fontFamily: "inherit", fontSize: 13.5, fontWeight: 700, background: calView===v?ACCENT:"transparent", color: calView===v?"#fff":"#705F66", cursor: "pointer", transition: "all .15s ease" }}>
                {v.charAt(0).toUpperCase()+v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {calView==="insights" ? <InsightsView mode={mode} logs={logs}/> : (
          <>
            <div style={{ padding: "0 20px" }}>
              <div style={{ background: "#fff", borderRadius: 26, boxShadow: CARD_SHADOW, border: "1px solid #F6ECE8", padding: "18px 16px 20px", marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <button onClick={prevMonth} style={{ width:38,height:38,borderRadius:"50%",background:"#fff",border:"1px solid #F0E2DE",boxShadow:CARD_SHADOW,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#705F66" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6"/></svg>
                  </button>
                  <div style={{ fontSize:17,fontWeight:800,color:"#2E2329" }}>{MONTHS[calMonth]} {calYear}</div>
                  <button onClick={nextMonth} style={{ width:38,height:38,borderRadius:"50%",background:"#fff",border:"1px solid #F0E2DE",boxShadow:CARD_SHADOW,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#705F66" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
                  </button>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8 }}>
                  {WEEK_SHORT.map(w=><span key={w} style={{ textAlign:"center",fontSize:11,fontWeight:700,color:"#A89AA0" }}>{w.charAt(0)}</span>)}
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4 }}>
                  {Array.from({length:totalCells}).map((_,i)=>{
                    const d=new Date(calYear,calMonth,1-lead+i);
                    const key=fmt(d);
                    const inMonth=d.getMonth()===calMonth;
                    const mk=marks[key]||{};
                    const isToday=key===TODAY_KEY;
                    const isSel=key===selDate;
                    const logged=!!logs[key];
                    let bg="transparent",numC="#2E2329",border="1.5px solid transparent",fw="600";
                    if(mk.fertile&&!mk.period)bg="#EAF3EE";
                    if(mk.period){bg=PH.menstrual;numC="#fff";fw="700";}
                    else if(mk.predicted){border=`1.5px dashed ${PH.menstrual}`;numC=PH.menstrual;}
                    if(mk.ovu){border=`2px solid ${PH.ovulation}`;numC=mk.period?"#fff":"#3F7A5F";}
                    if(isToday&&!mk.period){border=`2px solid ${ACCENT}`;numC=ACCENT;fw="700";}
                    return (
                      <button key={i} onClick={()=>setSelDate(key)}
                        style={{ position:"relative",aspectRatio:"1",border,background:bg,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",boxShadow:isSel?`0 0 0 2.5px ${ACCENT}`:"none",opacity:inMonth?1:0.32,cursor:"pointer" }}>
                        <span style={{ fontSize:14,fontWeight:fw,color:numC,lineHeight:1 }}>{d.getDate()}</span>
                        {logged&&<span style={{ position:"absolute",bottom:5,width:5,height:5,borderRadius:"50%",background:mk.period?"rgba(255,255,255,.92)":ACCENT }}/>}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:14,justifyContent:"center",marginTop:18,paddingTop:16,borderTop:"1px solid #F6ECE8" }}>
                  {[{t:"dot",c:PH.menstrual,l:"Period"},{t:"dashed",c:PH.menstrual,l:"Predicted"},
                    ...(!cycleModel(mode).irregular?[{t:"swatch",c:"#EAF3EE",l:"Fertile"},{t:"ring",c:PH.ovulation,l:"Ovulation"}]:[]),
                    {t:"dot2",c:ACCENT,l:"Logged"}
                  ].map(it=>(
                    <div key={it.l} style={{ display:"flex",alignItems:"center",gap:6 }}>
                      {it.t==="dot"&&<span style={{ width:11,height:11,borderRadius:"50%",background:it.c }}/>}
                      {it.t==="dashed"&&<span style={{ width:11,height:11,borderRadius:"50%",border:`1.5px dashed ${it.c}`,boxSizing:"border-box" }}/>}
                      {it.t==="swatch"&&<span style={{ width:11,height:11,borderRadius:4,background:it.c,border:"1px solid #d8e6dd" }}/>}
                      {it.t==="ring"&&<span style={{ width:11,height:11,borderRadius:"50%",border:`2px solid ${it.c}`,boxSizing:"border-box" }}/>}
                      {it.t==="dot2"&&<span style={{ width:5,height:5,borderRadius:"50%",background:it.c }}/>}
                      <span style={{ fontSize:12,fontWeight:600,color:"#705F66" }}>{it.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding:"18px 20px 20px" }}>
              <div style={{ background:"#fff",borderRadius:26,boxShadow:CARD_SHADOW,border:"1px solid #F6ECE8",padding:18 }}>
                <div style={{ fontSize:16,fontWeight:800,color:"#2E2329",marginBottom:4 }}>{selLong}{selDate===TODAY_KEY?" · Today":""}</div>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:selPh.c+"18",color:selPh.c,fontSize:12.5,fontWeight:700,padding:"5px 11px",borderRadius:999,marginBottom:14 }}>{selPh.l}</div>
                {selLog?(
                  <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
                    {selLog.flow&&selLog.flow!=="none"&&<div style={{ display:"flex",alignItems:"center",gap:11 }}><div style={{ width:34,height:34,borderRadius:11,background:ACCENT_SOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>💧</div><span style={{ fontSize:14.5,fontWeight:600,color:"#2E2329" }}>{FLOW_LBL[selLog.flow]}</span></div>}
                    {selLog.mood&&<div style={{ display:"flex",alignItems:"center",gap:11 }}><div style={{ width:34,height:34,borderRadius:11,background:ACCENT_SOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>😊</div><span style={{ fontSize:14.5,fontWeight:600,color:"#2E2329" }}>Mood: {selLog.mood!.charAt(0).toUpperCase()+selLog.mood!.slice(1)}</span></div>}
                    {selLog.symptoms&&selLog.symptoms.length>0&&<div style={{ display:"flex",alignItems:"center",gap:11 }}><div style={{ width:34,height:34,borderRadius:11,background:ACCENT_SOFT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>⚡</div><span style={{ fontSize:14.5,fontWeight:600,color:"#2E2329" }}>{selLog.symptoms.map(k=>SYMPTOMS.find(s=>s.k===k)?.l||k).join(", ")}</span></div>}
                    {selLog.note&&<div style={{ background:"#FCF8F6",border:"1px solid #F6ECE8",borderRadius:14,padding:"12px 14px",fontSize:13.5,color:"#705F66",lineHeight:1.5 }}>"{selLog.note}"</div>}
                    <button onClick={()=>{setLogDate(selDate);setLogOpen(true);}} style={{ background:"#fff",color:"#2E2329",border:"1px solid #F0E2DE",fontWeight:600,fontSize:15,padding:"14px 22px",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",cursor:"pointer",fontFamily:"inherit",marginTop:4 }}>✏️ Edit log</button>
                  </div>
                ):(
                  <>
                    <div style={{ fontSize:14,color:"#705F66",lineHeight:1.5,marginBottom:16 }}>Nothing logged for this day yet.</div>
                    <button onClick={()=>{setLogDate(selDate);setLogOpen(true);}} style={{ border:"none",background:ACCENT,color:"#fff",fontWeight:700,fontSize:16,padding:"16px 26px",borderRadius:999,boxShadow:`0 8px 22px rgba(226,109,138,.28)`,display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",cursor:"pointer",fontFamily:"inherit" }}>+ Log this day</button>
                  </>
                )}
              </div>
              <div style={{ height:8 }}/>
            </div>
          </>
        )}
      </div>
      {logOpen&&<LogSheet date={logDate} logs={logs} onClose={()=>setLogOpen(false)} onSave={(d,log)=>setLogs(p=>({...p,[d]:log}))}/>}
    </AppShell>
  );
}
