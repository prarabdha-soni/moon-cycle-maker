import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Flower2, HeartPulse, Baby, Check } from "lucide-react";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome — Petal" },
      { name: "description", content: "Tell us about your cycle to personalize Petal." },
    ],
  }),
  component: WelcomeScreen,
});

type Profile = "regular" | "pcod" | "pregnant";

const options: { id: Profile; title: string; desc: string; icon: typeof Flower2; iconClass: string }[] = [
  {
    id: "regular",
    title: "Regular cycle",
    desc: "My periods come on a predictable schedule.",
    icon: Flower2,
    iconClass: "bg-fertile/15 text-fertile",
  },
  {
    id: "pcod",
    title: "PCOD / PCOS",
    desc: "I have irregular cycles or a diagnosis.",
    icon: HeartPulse,
    iconClass: "bg-period/15 text-period",
  },
  {
    id: "pregnant",
    title: "Pregnant",
    desc: "I'm tracking through pregnancy.",
    icon: Baby,
    iconClass: "bg-ovulation/15 text-ovulation",
  },
];

function WelcomeScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Profile | null>(null);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pt-10 pb-8">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-fertile" />
          <span className="h-1.5 w-8 rounded-full bg-border" />
        </div>
        <Link
          to="/welcome-supplements"
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </Link>
      </div>

      {/* Header */}
      <div className="mt-10">
        <span className="inline-block rounded-full bg-fertile-light/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fertile">
          Step 1 of 2
        </span>
        <h1 className="mt-4 font-display text-[32px] leading-tight font-medium text-foreground">
          What best describes your cycle?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          We'll tailor your insights, reminders and ring to fit your body.
        </p>
      </div>

      {/* Options */}
      <div className="mt-8 space-y-3">
        {options.map(({ id, title, desc, icon: Icon, iconClass }) => {
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              aria-pressed={active}
              className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-fertile bg-fertile/5 shadow-md shadow-fertile/10"
                  : "border-border bg-card hover:border-fertile/40"
              }`}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl ${iconClass}`}
              >
                <Icon className="size-6" strokeWidth={2} />
              </span>
              <span className="flex-1">
                <span className="block font-display text-[17px] font-medium text-foreground">
                  {title}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">
                  {desc}
                </span>
              </span>
              <span
                className={`grid size-6 place-items-center rounded-full border-2 transition-all ${
                  active
                    ? "border-fertile bg-fertile text-primary-foreground"
                    : "border-border"
                }`}
              >
                {active && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <div className="mt-auto pt-8">
        <button
          disabled={!selected}
          onClick={() => navigate({ to: "/welcome-supplements" })}
          className="w-full rounded-full bg-fertile py-4 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-fertile/30 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
