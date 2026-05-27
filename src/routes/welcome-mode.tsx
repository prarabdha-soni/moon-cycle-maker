import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Flower2, Sparkles, Baby, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/welcome-mode")({
  head: () => ({
    meta: [
      { title: "Welcome — Petal" },
      {
        name: "description",
        content: "Choose your Petal experience: Regular tracking, Conceive, or Pregnant.",
      },
    ],
  }),
  component: WelcomeMode,
});

type Mode = "regular" | "conceive" | "pregnant";

const modes: {
  id: Mode;
  title: string;
  tag: string;
  desc: string;
  icon: typeof Flower2;
  iconClass: string;
  ringClass: string;
}[] = [
  {
    id: "regular",
    title: "Regular",
    tag: "Period & cycle",
    desc: "Track your period, PMS and mood with a beautiful daily ring.",
    icon: Flower2,
    iconClass: "bg-fertile/15 text-fertile",
    ringClass: "border-fertile",
  },
  {
    id: "conceive",
    title: "Conceive",
    tag: "Trying to get pregnant",
    desc: "Fertility-first tools — BBT, cervical mucus, ovulation tests and a daily fertility score.",
    icon: Sparkles,
    iconClass: "bg-ovulation/15 text-ovulation",
    ringClass: "border-ovulation",
  },
  {
    id: "pregnant",
    title: "Pregnant",
    tag: "Expecting a baby",
    desc: "Track your pregnancy journey with day-by-day baby development insights.",
    icon: Baby,
    iconClass: "bg-pms/15 text-pms",
    ringClass: "border-pms",
  },
];

function WelcomeMode() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Mode | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:mode", selected);
    }
    if (selected === "conceive") {
      // Conceive users skip the cycle-type/supplement onboarding
      if (typeof window !== "undefined") {
        window.localStorage.setItem("petal:onboarded", "1");
      }
      navigate({ to: "/conceive", replace: true });
    } else if (selected === "pregnant") {
      // Pregnant users go to last period screen
      navigate({ to: "/welcome-last-period", replace: true });
    } else {
      navigate({ to: "/welcome-supplements", replace: true });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pt-12 pb-8">
      {/* Brand */}
      <div className="flex flex-col items-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-fertile/20 via-pms/20 to-ovulation/20">
          <Flower2 className="size-7 text-fertile" strokeWidth={2} />
        </span>
        <span className="mt-3 font-display text-[20px] font-medium tracking-tight text-foreground">
          Petal
        </span>
      </div>

      {/* Header */}
      <div className="mt-10 text-center">
        <h1 className="font-display text-[30px] leading-tight font-medium text-foreground">
          How would you like to use Petal?
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Choose your goal — you can change this any time in settings.
        </p>
      </div>

      {/* Options */}
      <div className="mt-8 space-y-3">
        {modes.map(({ id, title, tag, desc, icon: Icon, iconClass, ringClass }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              aria-pressed={active}
              className={`group relative flex w-full flex-col gap-3 rounded-3xl border-2 p-5 text-left transition-all ${
                active
                  ? `${ringClass} bg-card shadow-lg shadow-foreground/5`
                  : "border-border bg-card hover:border-fertile/40"
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl ${iconClass}`}
                >
                  <Icon className="size-6" strokeWidth={2} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[19px] font-medium text-foreground">
                      {title}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {tag}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
                </div>
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                    active
                      ? id === "conceive"
                        ? "border-ovulation bg-ovulation text-primary-foreground"
                        : "border-fertile bg-fertile text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {active && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <div className="mt-auto pt-8">
        <button
          disabled={!selected}
          onClick={handleContinue}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-semibold text-primary-foreground shadow-lg transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${
            selected === "conceive"
              ? "bg-ovulation shadow-ovulation/30"
              : "bg-fertile shadow-fertile/30"
          }`}
        >
          Continue
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
