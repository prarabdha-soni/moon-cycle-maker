import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Pill, Leaf, Sun, Droplets, Sparkles, FlaskConical, Check } from "lucide-react";

export const Route = createFileRoute("/welcome-supplements")({
  head: () => ({
    meta: [
      { title: "Your supplements — Petal" },
      { name: "description", content: "Pick the supplements you take so we can remind you daily." },
    ],
  }),
  component: SupplementsScreen,
});

const supplements = [
  { id: "iron", label: "Iron", icon: FlaskConical, iconClass: "bg-period/15 text-period" },
  { id: "folate", label: "Folate", icon: Leaf, iconClass: "bg-ovulation/15 text-ovulation" },
  { id: "vitd", label: "Vitamin D", icon: Sun, iconClass: "bg-pms/15 text-pms" },
  { id: "omega", label: "Omega-3", icon: Droplets, iconClass: "bg-fertile/15 text-fertile" },
  { id: "magnesium", label: "Magnesium", icon: Sparkles, iconClass: "bg-fertile/15 text-fertile" },
  { id: "b12", label: "Vitamin B12", icon: Pill, iconClass: "bg-ovulation/15 text-ovulation" },
  { id: "calcium", label: "Calcium", icon: FlaskConical, iconClass: "bg-pms/15 text-pms" },
  { id: "zinc", label: "Zinc", icon: Sparkles, iconClass: "bg-period/15 text-period" },
] as const;

function SupplementsScreen() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setPicked((p) => ({ ...p, [id]: !p[id] }));

  const count = Object.values(picked).filter(Boolean).length;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pt-10 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-fertile" />
          <span className="h-1.5 w-8 rounded-full bg-fertile" />
        </div>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem("petal:onboarded", "1");
            }
            navigate({ to: "/", replace: true });
          }}
          className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </button>
      </div>

      <div className="mt-10">
        <span className="inline-block rounded-full bg-fertile-light/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fertile">
          Step 2 of 2
        </span>
        <h1 className="mt-4 font-display text-[32px] leading-tight font-medium text-foreground">
          Any supplements you take?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          Pick what you take daily — we'll add them to your Med screen with reminders.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {supplements.map(({ id, label, icon: Icon, iconClass }) => {
          const active = picked[id];
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={active}
              className={`relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-fertile bg-fertile/5 shadow-sm"
                  : "border-border bg-card hover:border-fertile/40"
              }`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${iconClass}`}
              >
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="font-display text-[15px] font-medium text-foreground">
                {label}
              </span>
              {active && (
                <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-fertile text-primary-foreground">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[12px] text-muted-foreground">
        {count === 0 ? "None selected — that's okay" : `${count} selected`}
      </p>

      <div className="mt-auto pt-8">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem("petal:onboarded", "1");
            }
            navigate({ to: "/", replace: true });
          }}
          className="w-full rounded-full bg-fertile py-4 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-fertile/30 transition-all active:scale-[0.98]"
        >
          {count === 0 ? "Maybe later" : "Finish setup"}
        </button>
      </div>
    </div>
  );
}
