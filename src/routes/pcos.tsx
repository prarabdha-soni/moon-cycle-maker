import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Flame,
  Brain,
  Wind,
  Zap,
  Droplets,
  Activity,
  Heart,
  Sparkles,
  Scale,
  Leaf,
  Plus,
  Check,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ModeSwitcherPill } from "@/components/ModeSwitcherPill";
import { YOGA_POSES, PoseSVG } from "@/lib/yoga-poses";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pcos")({
  head: () => ({
    meta: [
      { title: "PCOS — Petal" },
      {
        name: "description",
        content: "Track your PCOS symptoms, irregular cycles, and hormonal patterns.",
      },
    ],
  }),
  component: PcosScreen,
});

type SymptomId = string;

const SYMPTOM_GROUPS = [
  {
    title: "Hormonal",
    items: [
      { id: "pcos-cramps", label: "Cramps", icon: Flame },
      { id: "pcos-spotting", label: "Spotting", icon: Droplets },
      { id: "pcos-pelvic", label: "Pelvic pain", icon: AlertCircle },
      { id: "pcos-bloat", label: "Bloating", icon: Activity },
    ],
  },
  {
    title: "Metabolic",
    items: [
      { id: "pcos-cravings", label: "Sugar cravings", icon: Flame },
      { id: "pcos-fatigue", label: "Fatigue", icon: Zap },
      { id: "pcos-dizzy", label: "Dizziness", icon: Brain },
      { id: "pcos-weight", label: "Weight gain", icon: Scale },
    ],
  },
  {
    title: "Skin & Hair",
    items: [
      { id: "pcos-acne-face", label: "Acne (face)", icon: Sparkles },
      { id: "pcos-acne-back", label: "Acne (back)", icon: Sparkles },
      { id: "pcos-facial-hair", label: "Facial hair", icon: Wind },
      { id: "pcos-hair-thin", label: "Hair thinning", icon: Wind },
    ],
  },
  {
    title: "Emotional",
    items: [
      { id: "pcos-anxiety", label: "Anxiety", icon: Brain },
      { id: "pcos-mood", label: "Mood swings", icon: Heart },
      { id: "pcos-fog", label: "Brain fog", icon: Brain },
      { id: "pcos-stress", label: "High stress", icon: AlertCircle },
    ],
  },
];

const AYURVEDIC_TIPS = [
  {
    title: "Haldi doodh time 🌿",
    body: "Drink warm turmeric milk before bed. Ginger tea and sesame seeds ease PCOS-related cramps naturally during your period.",
    daysMin: 0,
    daysMax: 6,
  },
  {
    title: "Methi seeds ritual 🌱",
    body: "Soak 1 tsp fenugreek (methi) seeds overnight, eat on an empty stomach. This Ayurvedic remedy helps regulate blood sugar and PCOS symptoms.",
    daysMin: 7,
    daysMax: 15,
  },
  {
    title: "Ashwagandha morning 🍵",
    body: "Add ashwagandha to warm milk or a smoothie. It balances cortisol — a key driver of PCOS flares. Coconut water also helps maintain hormonal balance.",
    daysMin: 16,
    daysMax: 25,
  },
  {
    title: "Spearmint tea ritual 🫖",
    body: "Drink pudina (spearmint) tea twice daily — clinically shown to reduce testosterone naturally. Avoid dairy and refined sugar this week.",
    daysMin: 26,
    daysMax: 99,
  },
];

function getAyurvedicTip(daysSinceLastPeriod: number) {
  return (
    AYURVEDIC_TIPS.find(
      (t) => daysSinceLastPeriod >= t.daysMin && daysSinceLastPeriod <= t.daysMax,
    ) ?? AYURVEDIC_TIPS[2]
  );
}

function todayKey() {
  return `petal:pcosLog:${new Date().toISOString().slice(0, 10)}`;
}

function loadTodaySymptoms(): Set<SymptomId> {
  try {
    const raw = window.localStorage.getItem(todayKey());
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as SymptomId[]);
  } catch {
    return new Set();
  }
}

function saveTodaySymptoms(ids: Set<SymptomId>) {
  window.localStorage.setItem(todayKey(), JSON.stringify([...ids]));
}

function yogaDoneKey() {
  return `petal:yogaDone:${new Date().toISOString().slice(0, 10)}`;
}

function hoursUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / 3600000);
}

function YogaSection() {
  const [doneToday, setDoneToday] = useState(false);
  const [streak, setStreak] = useState(0);

  const refresh = () => {
    setDoneToday(!!window.localStorage.getItem(yogaDoneKey()));
    setStreak(parseInt(window.localStorage.getItem("petal:yogaStreak") ?? "0", 10));
  };

  useEffect(() => {
    refresh();
    // Re-check when user returns from the yoga flow screen
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <section>
      {/* Section header */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h3 className="font-display text-[16px] font-semibold text-foreground">Today's yoga</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">3×/week · 20 min · restorative only</p>
        </div>
        {streak > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-pcos/10 px-2.5 py-1 text-[11px] font-semibold text-pcos">
            🔥 {streak} day{streak === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {doneToday ? (
        /* Completed state */
        <div className="flex items-center gap-3 rounded-2xl bg-ovulation/8 border border-ovulation/20 p-4">
          <CheckCircle2 className="size-6 shrink-0 text-ovulation" strokeWidth={2} />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-foreground">Done today</p>
            <p className="text-[12px] text-muted-foreground">Next session in {hoursUntilMidnight()}h</p>
          </div>
          <Link
            to="/yoga-flow"
            className="text-[12px] font-medium text-muted-foreground flex items-center gap-0.5"
          >
            Repeat <ChevronRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* Horizontally scrollable pose cards */}
          <div className="-mx-5">
            <div className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-none">
              {YOGA_POSES.map((pose) => (
                <div
                  key={pose.id}
                  className="flex-shrink-0 w-[138px] rounded-2xl border border-border bg-card p-3 flex flex-col"
                >
                  {/* Illustration */}
                  <div className="flex items-center justify-center h-[72px] mb-2.5 text-pcos">
                    <PoseSVG id={pose.id} className="h-[68px] w-auto" />
                  </div>

                  {/* Name */}
                  <p className="text-[12px] font-semibold text-foreground leading-snug">
                    {pose.name}
                  </p>
                  {/* Sanskrit */}
                  <p className="text-[10px] italic text-muted-foreground mt-0.5 mb-2">
                    {pose.sanskrit}
                  </p>

                  {/* Hold badge */}
                  <span className="self-start rounded-full bg-pcos/12 px-2 py-0.5 text-[10px] font-semibold text-pcos mb-1.5">
                    {pose.holdLabel}
                  </span>

                  {/* Benefit tag */}
                  <span className={cn("self-start rounded-full px-2 py-0.5 text-[10px] font-medium", pose.benefitClass)}>
                    {pose.benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Start button */}
          <Link
            to="/yoga-flow"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-pcos py-3.5 text-[14px] font-semibold text-white shadow-lg shadow-pcos/25 active:scale-[0.98] transition-transform"
          >
            Start sequence →
          </Link>
        </>
      )}
    </section>
  );
}

function PcosScreen() {
  const [lastPeriodStr, setLastPeriodStr] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<SymptomId>>(new Set());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLastPeriodStr(window.localStorage.getItem("petal:pcosLastPeriod"));
    setSelected(loadTodaySymptoms());
  }, []);

  const daysSince = lastPeriodStr
    ? Math.floor((Date.now() - new Date(lastPeriodStr).getTime()) / 86400000)
    : null;

  const tip = getAyurvedicTip(daysSince ?? 20);

  const toggle = (id: SymptomId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveTodaySymptoms(next);
      return next;
    });
  };

  const logPeriodToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    window.localStorage.setItem("petal:pcosLastPeriod", today);
    // also update petal:lastPeriod so shared cycle logic works
    window.localStorage.setItem("petal:lastPeriod", today);
    setLastPeriodStr(today);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" });
  const totalLogged = selected.size;

  return (
    <AppShell title="Today">
      <div className="px-5 pb-6 space-y-5">
        <ModeSwitcherPill />

        {/* Days counter hero */}
        <div className="rounded-3xl bg-gradient-to-br from-pcos/15 via-pcos/8 to-pcos-light/10 border border-pcos/20 p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pcos/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-pcos">
                <CalendarDays className="size-3" strokeWidth={2.5} /> PCOS tracker
              </span>
              {daysSince !== null ? (
                <>
                  <h2 className="mt-3 font-display text-[26px] leading-tight font-medium text-foreground">
                    Day {daysSince + 1} of your cycle
                  </h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {daysSince} days since last period · {today}
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 font-display text-[22px] leading-tight font-medium text-foreground">
                    Log your first period to start tracking
                  </h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    PCOS cycles are irregular — that's okay.
                  </p>
                </>
              )}
            </div>
            {daysSince !== null && (
              <div className="relative grid size-20 place-items-center shrink-0">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="var(--pcos)" strokeOpacity="0.15" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="var(--pcos)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - Math.min(daysSince / 35, 1))}`}
                  />
                </svg>
                <div className="text-center">
                  <p className="font-display text-[20px] font-medium leading-none text-foreground">
                    {daysSince + 1}
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground">day</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={logPeriodToday}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-pcos text-white py-2.5 text-[12px] font-semibold shadow shadow-pcos/30 active:scale-[0.98]"
            >
              <Plus className="size-3.5" strokeWidth={2.5} />
              Period started today
            </button>
            <div className="rounded-xl bg-card/70 px-3 py-2 backdrop-blur border border-pcos/15">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Cycle type</p>
              <p className="mt-1 text-[13px] font-semibold text-pcos">Irregular</p>
            </div>
          </div>
        </div>

        {/* Ayurvedic tip */}
        <div className="flex items-start gap-3 rounded-2xl bg-ovulation/8 border border-ovulation/20 p-4">
          <Leaf className="mt-0.5 size-5 shrink-0 text-ovulation" strokeWidth={2.25} />
          <div>
            <p className="text-[13px] font-semibold text-foreground">{tip.title}</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">{tip.body}</p>
          </div>
        </div>

        {/* Symptom log header */}
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[16px] font-semibold text-foreground">
            Today's symptoms
          </h3>
          <span className="text-[12px] text-muted-foreground">{today}</span>
        </div>

        {/* Symptom groups */}
        {SYMPTOM_GROUPS.map((group) => (
          <section key={group.title}>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-pcos/70">
              {group.title}
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {group.items.map(({ id, label, icon: Icon }) => {
                const active = selected.has(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    aria-pressed={active}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        "grid size-[60px] place-items-center rounded-2xl border shadow-sm transition-all",
                        active
                          ? "bg-pcos text-white border-transparent shadow-pcos/25"
                          : "border-border bg-card text-muted-foreground hover:bg-accent/50",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2} />
                    </span>
                    <span className="text-[11px] text-center leading-tight text-foreground">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* PCOS insight banner */}
        <div className="rounded-2xl bg-pcos/6 border border-pcos/15 p-4">
          <p className="text-[12px] font-semibold text-pcos mb-1">Did you know?</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            1 in 5 Indian women have PCOS. Irregular cycles ranging 25–90 days are common. Tracking your symptoms helps identify your unique hormonal pattern.
          </p>
        </div>

        {/* Today's yoga section */}
        <YogaSection />

        {/* Save button */}
        {totalLogged > 0 && (
          <button
            onClick={handleSave}
            className={cn(
              "w-full rounded-full py-4 font-semibold text-white shadow-lg transition-all active:scale-[0.98]",
              saved ? "bg-ovulation shadow-ovulation/30" : "bg-pcos shadow-pcos/30",
            )}
          >
            {saved ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="size-4" strokeWidth={2.5} /> Saved!
              </span>
            ) : (
              `Save entry (${totalLogged} symptoms)`
            )}
          </button>
        )}
      </div>
    </AppShell>
  );
}
