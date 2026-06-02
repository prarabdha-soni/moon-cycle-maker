import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { Moon, Wind, Scale, Sparkles, HeartPulse, Zap, Droplets, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CycleRing } from "@/components/CycleRing";
import { ModeSwitcherPill } from "@/components/ModeSwitcherPill";
import { PROFILE_UPDATE_EVENT } from "@/components/ProfileIcon";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your current cycle — Petal" },
      {
        name: "description",
        content: "Track your menstrual cycle, period, fertile window and ovulation.",
      },
      { property: "og:title", content: "Your current cycle — Petal" },
    ],
  }),
  component: CycleScreen,
});

function computeCycleData(refreshKey: number) {
  if (typeof window === "undefined") return null;
  void refreshKey;
  const lastPeriodStr = window.localStorage.getItem("petal:lastPeriod");
  const cycleLength = parseInt(window.localStorage.getItem("petal:cycleLength") || "28", 10);
  const periodLength = 5;
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;

  let currentDay = 14;
  if (lastPeriodStr) {
    const diffDays = Math.floor((Date.now() - new Date(lastPeriodStr).getTime()) / 86400000);
    currentDay = Math.max(1, Math.min(cycleLength, (diffDays % cycleLength) + 1));
  }

  const daysUntilNextPeriod = cycleLength - currentDay + 1;

  let phase = "Follicular";
  if (currentDay <= periodLength) phase = "Period";
  else if (currentDay >= fertileStart && currentDay <= ovulationDay - 1) phase = "Fertile window";
  else if (currentDay === ovulationDay || currentDay === ovulationDay + 1) phase = "Ovulation";
  else if (currentDay > ovulationDay + 1) phase = "Luteal phase";

  return {
    cycleLength,
    periodLength,
    currentDay,
    ovulationDay,
    fertileStart,
    fertileEnd,
    daysUntilNextPeriod,
    phase,
  };
}

// ── Phase-based health data ──────────────────────────────────
type HealthCard = {
  status: string;
  tip: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  dot: string;
};
type PhaseHealth = { energy: HealthCard; skin: HealthCard; hair: HealthCard; weight: HealthCard };

const PHASE_HEALTH: Record<string, PhaseHealth> = {
  Period: {
    energy: {
      status: "Restore mode",
      tip: "Rest, warmth & iron-rich foods",
      icon: Moon,
      color: "text-period",
      bg: "bg-period/8 border-period/20",
      dot: "bg-period",
    },
    skin: {
      status: "Sensitive skin",
      tip: "Gentle cleansers, no actives",
      icon: Sparkles,
      color: "text-period",
      bg: "bg-period/8 border-period/20",
      dot: "bg-period",
    },
    hair: {
      status: "Brittle & dry",
      tip: "Avoid heat, use nourishing oils",
      icon: Wind,
      color: "text-period",
      bg: "bg-period/8 border-period/20",
      dot: "bg-period",
    },
    weight: {
      status: "Bloating normal",
      tip: "Skip deficit — focus on iron intake",
      icon: Scale,
      color: "text-period",
      bg: "bg-period/8 border-period/20",
      dot: "bg-period",
    },
  },
  Follicular: {
    energy: {
      status: "Rising energy",
      tip: "Best time to build new habits",
      icon: Zap,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    skin: {
      status: "Clearing up",
      tip: "Try Vitamin C & light exfoliation",
      icon: Sparkles,
      color: "text-fertile",
      bg: "bg-fertile/8 border-fertile/20",
      dot: "bg-fertile",
    },
    hair: {
      status: "Getting stronger",
      tip: "Great time for trims & treatments",
      icon: Wind,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    weight: {
      status: "Metabolism rising",
      tip: "Best phase for a calorie deficit",
      icon: Scale,
      color: "text-fertile",
      bg: "bg-fertile/8 border-fertile/20",
      dot: "bg-fertile",
    },
  },
  "Fertile window": {
    energy: {
      status: "High energy",
      tip: "Your brain & body are sharpest",
      icon: Zap,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    skin: {
      status: "Glowing skin",
      tip: "Pores smaller, naturally luminous",
      icon: Sparkles,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    hair: {
      status: "Lush & full",
      tip: "Estrogen keeps hair thick & shiny",
      icon: Wind,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    weight: {
      status: "Peak metabolism",
      tip: "Push HIIT — body burns most now",
      icon: Scale,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
  },
  Ovulation: {
    energy: {
      status: "Peak power ⚡",
      tip: "Tackle your biggest challenges today",
      icon: Zap,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    skin: {
      status: "Natural glow ✨",
      tip: "Collagen peaks — best skin day",
      icon: Sparkles,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    hair: {
      status: "Thickest & shiny",
      tip: "Best hair day of your cycle",
      icon: Wind,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
    weight: {
      status: "Max fat burn",
      tip: "Ideal for intense strength sessions",
      icon: Scale,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/20",
      dot: "bg-ovulation",
    },
  },
  "Luteal phase": {
    energy: {
      status: "Wind down",
      tip: "Prioritise sleep & stress relief",
      icon: Moon,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/20",
      dot: "bg-pms",
    },
    skin: {
      status: "Oil-prone skin",
      tip: "Double cleanse, avoid heavy creams",
      icon: Sparkles,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/20",
      dot: "bg-pms",
    },
    hair: {
      status: "Shedding more",
      tip: "Gentle detangling, no harsh treatments",
      icon: Wind,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/20",
      dot: "bg-pms",
    },
    weight: {
      status: "Cravings rising",
      tip: "Prep healthy snacks in advance",
      icon: Scale,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/20",
      dot: "bg-pms",
    },
  },
};

// ── Goal Tips ────────────────────────────────────────────────
const GOAL_TIPS: Record<
  string,
  Record<
    string,
    { title: string; body: string; icon: React.ElementType; color: string; bg: string }
  >
> = {
  health: {
    Period: {
      title: "Rest & restore",
      body: "Your body is working hard. Prioritise iron-rich foods, hydration, and gentle movement today.",
      icon: HeartPulse,
      color: "text-fertile",
      bg: "bg-fertile/8 border-fertile/15",
    },
    Follicular: {
      title: "Build momentum",
      body: "Energy is rising with estrogen. Best time to plan goals, start new habits and push your workouts.",
      icon: HeartPulse,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    "Fertile window": {
      title: "Peak performance",
      body: "Oestrogen peaks here — your brain and body are at their sharpest. Tackle your hardest tasks.",
      icon: HeartPulse,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    Ovulation: {
      title: "Your strongest day",
      body: "Maximum energy and confidence. Social, creative, and physical performance are all at their best.",
      icon: HeartPulse,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    "Luteal phase": {
      title: "Slow down & reflect",
      body: "Progesterone is rising. Prioritise sleep, reduce stress, and swap intense workouts for yoga.",
      icon: HeartPulse,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/15",
    },
  },
  weight: {
    Period: {
      title: "Eat for iron & energy",
      body: "Skip the calorie deficit today. Focus on leafy greens, lentils and dark chocolate.",
      icon: Scale,
      color: "text-period",
      bg: "bg-period/8 border-period/15",
    },
    Follicular: {
      title: "Best time for a deficit",
      body: "Rising estrogen boosts metabolism. Slightly reduce calories and lean into cardio or HIIT.",
      icon: Scale,
      color: "text-fertile",
      bg: "bg-fertile/8 border-fertile/15",
    },
    "Fertile window": {
      title: "Go hard at the gym",
      body: "Peak metabolism window. Strength training and HIIT are most effective. Push your limits this week.",
      icon: Scale,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    Ovulation: {
      title: "Maximum fat burn",
      body: "Your body burns the most calories today. Take advantage with a challenging workout session.",
      icon: Scale,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    "Luteal phase": {
      title: "Manage cravings",
      body: "Progesterone spikes cravings for carbs and sugar. Prep healthy snacks in advance to stay on track.",
      icon: Scale,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/15",
    },
  },
  skin: {
    Period: {
      title: "Soothe & hydrate",
      body: "Skin is sensitive and prone to breakouts. Use gentle cleansers, reduce actives, boost hydration.",
      icon: Sparkles,
      color: "text-period",
      bg: "bg-period/8 border-period/15",
    },
    Follicular: {
      title: "Introduce actives",
      body: "Skin is clearing up as estrogen rises. Great time for Vitamin C serums or light exfoliation.",
      icon: Sparkles,
      color: "text-fertile",
      bg: "bg-fertile/8 border-fertile/15",
    },
    "Fertile window": {
      title: "Your skin is glowing",
      body: "Estrogen is at its peak — pores look smaller, skin is naturally luminous. Minimal makeup needed!",
      icon: Sparkles,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    Ovulation: {
      title: "Natural glow day ✨",
      body: "Collagen production peaks around ovulation. Your hair and skin look their absolute best today.",
      icon: Sparkles,
      color: "text-ovulation",
      bg: "bg-ovulation/8 border-ovulation/15",
    },
    "Luteal phase": {
      title: "Cleanse & protect",
      body: "Progesterone increases oil production — double cleanse at night and avoid heavy moisturisers.",
      icon: Sparkles,
      color: "text-pms",
      bg: "bg-pms/8 border-pms/15",
    },
  },
};

function GoalTips({ phase }: { phase: string }) {
  let goals: string[] = [];
  try {
    goals =
      typeof window !== "undefined"
        ? JSON.parse(window.localStorage.getItem("petal:goals") || "[]")
        : [];
  } catch {
    goals = [];
  }
  if (goals.length === 0) return null;
  const tips = goals.map((g) => GOAL_TIPS[g]?.[phase]).filter(Boolean);
  if (tips.length === 0) return null;

  return (
    <section className="mt-5">
      <h3 className="font-display text-[16px] font-semibold text-foreground mb-3">
        Your goals today
      </h3>
      <div className="space-y-3">
        {tips.map((tip, i) => {
          if (!tip) return null;
          const Icon = tip.icon;
          return (
            <div key={i} className={cn("flex items-start gap-3 rounded-2xl border p-4", tip.bg)}>
              <Icon className={cn("mt-0.5 size-5 shrink-0", tip.color)} strokeWidth={2.25} />
              <div>
                <p className={cn("text-[13px] font-semibold", tip.color)}>{tip.title}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                  {tip.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CycleScreen() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const [{ onboarded, mode }] = useState(() => {
    if (typeof window === "undefined") return { onboarded: true, mode: "regular" };
    return {
      onboarded: window.localStorage.getItem("petal:onboarded") !== null,
      mode: window.localStorage.getItem("petal:mode") ?? "regular",
    };
  });

  useEffect(() => {
    if (!onboarded) navigate({ to: "/welcome-mode", replace: true });
  }, [onboarded, navigate]);

  useEffect(() => {
    const refresh = () => setRefreshKey((k) => k + 1);
    window.addEventListener(PROFILE_UPDATE_EVENT, refresh);
    return () => window.removeEventListener(PROFILE_UPDATE_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!onboarded) return;
    if (mode === "conceive") {
      navigate({ to: "/conceive", replace: true });
      return;
    }
    if (mode === "pcos") {
      navigate({ to: "/pcos", replace: true });
      return;
    }
    if (mode === "pregnant") {
      const lp =
        typeof window !== "undefined" ? window.localStorage.getItem("petal:lastPeriod") : null;
      navigate({ to: lp ? "/pregnant" : "/welcome-last-period", replace: true });
    }
    // refreshKey intentionally excluded: it tracks cycle data refresh, not mode changes.
    // Including it caused navigate() to fire on every profile save.
  }, [mode, onboarded, navigate]);

  const cycle = useMemo(() => computeCycleData(refreshKey), [refreshKey]);

  if (!onboarded || !cycle) return null;

  const phaseColor =
    cycle.phase === "Period"
      ? "text-period bg-period/10 border-period/20"
      : cycle.phase === "Ovulation"
        ? "text-ovulation bg-ovulation/10 border-ovulation/20"
        : cycle.phase.startsWith("Fertile")
          ? "text-fertile bg-fertile/10 border-fertile/20"
          : "text-pms bg-pms/10 border-pms/20";

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

  const health = PHASE_HEALTH[cycle.phase] ?? PHASE_HEALTH["Follicular"];

  return (
    <AppShell title="Today">
      <div className="px-5 pb-6">
        <ModeSwitcherPill />

        {/* Phase + date banner */}
        <div className="mt-3 flex items-center justify-between">
          <span
            className={cn("rounded-full border px-3 py-1 text-[12px] font-semibold", phaseColor)}
          >
            {cycle.phase}
          </span>
          <span className="text-[13px] text-muted-foreground">{dateLabel}</span>
        </div>

        {/* Cycle ring */}
        <div className="mt-3">
          <CycleRing
            cycleLength={cycle.cycleLength}
            currentDay={cycle.currentDay}
            periodLength={cycle.periodLength}
            ovulationDay={cycle.ovulationDay}
            fertileWindow={[cycle.fertileStart, cycle.fertileEnd]}
          />
        </div>

        {/* ── Prediction mini-cards ── */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-border bg-card px-3 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Next period</p>
            <p className="mt-1 font-display text-[18px] font-bold text-period">
              {cycle.daysUntilNextPeriod}d
            </p>
            <p className="text-[10px] text-muted-foreground">away</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-3 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Day</p>
            <p className="mt-1 font-display text-[18px] font-bold text-fertile">
              {cycle.currentDay}
            </p>
            <p className="text-[10px] text-muted-foreground">of {cycle.cycleLength}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card px-3 py-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ovulation</p>
            <p className="mt-1 font-display text-[18px] font-bold text-ovulation">
              {cycle.currentDay < cycle.ovulationDay
                ? `${cycle.ovulationDay - cycle.currentDay}d`
                : "✓"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {cycle.currentDay < cycle.ovulationDay ? "away" : "passed"}
            </p>
          </div>
        </div>

        {/* ── Health Today section ── */}
        <section className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-[16px] font-semibold text-foreground">Health today</h3>
            <span className={cn("text-[11px] font-medium", health.energy.color)}>
              {cycle.phase}
            </span>
          </div>

          {/* 2×2 health card grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Energy / Phase */}
            <HealthCard label="Energy" health={health.energy} />

            {/* Skin */}
            <HealthCard label="Skin" health={health.skin} />

            {/* Hair */}
            <HealthCard label="Hair" health={health.hair} />

            {/* Weight & Body */}
            <HealthCard label="Weight & Body" health={health.weight} />
          </div>
        </section>

        {/* ── Ovulation / Luteal banner ── */}
        {cycle.currentDay < cycle.ovulationDay && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-ovulation/8 border border-ovulation/20 p-4">
            <Droplets className="mt-0.5 size-5 shrink-0 text-ovulation" strokeWidth={2.25} />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">
                Ovulation in {cycle.ovulationDay - cycle.currentDay} days
              </p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Fertile window opens around day {cycle.fertileStart}.
              </p>
            </div>
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
          </div>
        )}
        {cycle.currentDay >= cycle.ovulationDay && cycle.phase !== "Period" && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-pms/8 border border-pms/20 p-4">
            <Moon className="mt-0.5 size-5 shrink-0 text-pms" strokeWidth={2.25} />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-foreground">Luteal phase</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                Progesterone rises. Period in {cycle.daysUntilNextPeriod} days.
              </p>
            </div>
            <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
          </div>
        )}

        {/* ── Goal-based tips ── */}
        <GoalTips phase={cycle.phase} />
      </div>
    </AppShell>
  );
}

function HealthCard({ label, health }: { label: string; health: HealthCard }) {
  const Icon = health.icon;
  return (
    <div className={cn("rounded-2xl border p-3.5", health.bg)}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={cn("grid size-7 shrink-0 place-items-center rounded-full bg-background/60")}
        >
          <Icon className={cn("size-3.5", health.color)} strokeWidth={2.25} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={cn("text-[13px] font-bold leading-snug", health.color)}>{health.status}</p>
      <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{health.tip}</p>
    </div>
  );
}
