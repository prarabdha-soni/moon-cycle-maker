import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, Sparkles, HeartPulse, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome-goals")({
  head: () => ({
    meta: [
      { title: "Your Goals — SheThrives" },
      {
        name: "description",
        content: "Tell us your health goals so we can personalise your experience.",
      },
    ],
  }),
  component: WelcomeGoalsScreen,
});

const GOALS = [
  {
    id: "health",
    title: "Improve My Health",
    desc: "Phase-synced energy tips, stress management & daily wellness habits.",
    icon: HeartPulse,
    gradient: "from-fertile/20 to-ovulation/20",
    iconBg: "bg-ovulation/15 text-ovulation",
    active: "border-ovulation bg-ovulation/5 shadow-ovulation/10",
    check: "bg-ovulation",
  },
  {
    id: "weight",
    title: "Lose Weight",
    desc: "Cycle-matched workouts, calorie guidance & craving management tips.",
    icon: Scale,
    gradient: "from-period/15 to-fertile/15",
    iconBg: "bg-fertile/15 text-fertile",
    active: "border-fertile bg-fertile/5 shadow-fertile/10",
    check: "bg-fertile",
  },
  {
    id: "skin",
    title: "Glowing Skin & Hair",
    desc: "Hormone-aware skincare routines, diet tips & hair care phase guides.",
    icon: Sparkles,
    gradient: "from-pms/20 to-period-light/30",
    iconBg: "bg-pms/15 text-pms",
    active: "border-pms bg-pms/5 shadow-pms/10",
    check: "bg-pms",
  },
] as const;

function WelcomeGoalsScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "petal:goals",
        JSON.stringify(selected.size > 0 ? Array.from(selected) : ["health"]),
      );
      window.localStorage.setItem("petal:onboarded", "1");
    }
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pt-10 pb-8">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-period" />
          <span className="h-1.5 w-8 rounded-full bg-period" />
          <span className="h-1.5 w-8 rounded-full bg-period" />
        </div>
        <button
          onClick={handleFinish}
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </button>
      </div>

      {/* Header */}
      <div className="mt-10">
        <span className="inline-block rounded-full bg-period/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-period">
          Step 3 of 3
        </span>
        <h1 className="mt-4 font-display text-[32px] leading-tight font-medium text-foreground">
          What are your health goals?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          We'll sync recommendations to your cycle phase. Pick all that apply.
        </p>
      </div>

      {/* Goal cards */}
      <div className="mt-8 space-y-3">
        {GOALS.map(({ id, title, desc, icon: Icon, iconBg, active: activeClass, check }) => {
          const isActive = selected.has(id);
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition-all shadow-sm",
                isActive
                  ? `${activeClass} border-current shadow-md`
                  : "border-border bg-card hover:bg-accent/40",
              )}
            >
              <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", iconBg)}>
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <span className="flex-1">
                <span className="block font-display text-[17px] font-medium text-foreground">
                  {title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground leading-snug">
                  {desc}
                </span>
              </span>
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all",
                  isActive ? `${check} border-transparent text-white` : "border-border",
                )}
              >
                {isActive && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[12px] text-muted-foreground">
        {selected.size === 0
          ? "Select one or more goals"
          : `${selected.size} goal${selected.size > 1 ? "s" : ""} selected — your app is now personalised`}
      </p>

      {/* CTA */}
      <div className="mt-auto pt-8">
        <button
          onClick={handleFinish}
          className="w-full rounded-full bg-period py-4 text-[15px] font-semibold text-white shadow-lg shadow-period/30 transition-all active:scale-[0.98]"
        >
          {selected.size === 0 ? "Skip for now" : "Start my journey 🌸"}
        </button>
      </div>
    </div>
  );
}
