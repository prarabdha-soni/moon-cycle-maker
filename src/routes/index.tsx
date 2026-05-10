import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Smile } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CycleRing } from "@/components/CycleRing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your current cycle — Petal" },
      {
        name: "description",
        content: "Track your menstrual cycle, period, fertile window and ovulation with a beautiful daily ring.",
      },
      { property: "og:title", content: "Your current cycle — Petal" },
      {
        property: "og:description",
        content: "A modern period tracker inspired by Clue.",
      },
    ],
  }),
  component: CycleScreen,
});

function CycleScreen() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onboarded = window.localStorage.getItem("petal:onboarded");
    if (!onboarded) {
      navigate({ to: "/welcome", replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="size-8 animate-pulse rounded-full bg-fertile/30" />
      </div>
    );
  }

  return (
    <AppShell title="Your current cycle">
      <div className="px-5">
        <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full bg-fertile-light/30 px-4 py-1.5 text-[13px] text-fertile">
          <span className="text-muted-foreground">Mode:</span>
          <span className="font-semibold">Petal Period Tracking</span>
          <ChevronDown className="size-3.5" strokeWidth={2.5} />
        </div>

        <div className="mt-6">
          <CycleRing
            cycleLength={29}
            currentDay={23}
            periodLength={5}
            ovulationDay={15}
            fertileWindow={[12, 17]}
          />
        </div>

        <button className="mt-8 flex w-full items-center justify-between rounded-full bg-accent px-5 py-4 text-left transition-colors hover:bg-accent/80">
          <span className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-pms/30">
              <Smile className="size-5 text-pms" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-medium text-foreground">
              How do you feel today?
            </span>
          </span>
          <ChevronRight className="size-5 text-pms" strokeWidth={2.5} />
        </button>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Card label="Cycle length" value="29 days" tone="fertile" />
          <Card label="Last period" value="18 days ago" tone="period" />
        </div>
      </div>
    </AppShell>
  );
}

function Card({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "fertile" | "period";
}) {
  const dot = tone === "fertile" ? "bg-fertile" : "bg-period";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full ${dot}`} />
        <span className="text-[12px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}
