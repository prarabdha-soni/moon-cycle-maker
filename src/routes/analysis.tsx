import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Droplet, Moon } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Analysis — Petal" },
      { name: "description", content: "Cycle insights and trends across your last six months." },
    ],
  }),
  component: AnalysisScreen,
});

const cycleHistory = [
  { month: "Mar", length: 28 },
  { month: "Apr", length: 30 },
  { month: "May", length: 27 },
  { month: "Jun", length: 29 },
  { month: "Jul", length: 28 },
  { month: "Aug", length: 29 },
];

function AnalysisScreen() {
  const max = Math.max(...cycleHistory.map((c) => c.length));
  const min = Math.min(...cycleHistory.map((c) => c.length));

  return (
    <AppShell title="Analysis">
      <div className="space-y-6 px-5 pt-2">
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={TrendingUp} value="29" label="Avg cycle" tone="fertile" />
          <Stat icon={Droplet} value="5" label="Period days" tone="period" />
          <Stat icon={Moon} value="14" label="Avg ovulation" tone="ovulation" />
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-lg font-medium">Cycle history</h2>
            <span className="text-xs text-muted-foreground">last 6 months</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {cycleHistory.map((c) => {
              const h = ((c.length - 22) / (max - 22 + 1)) * 100;
              return (
                <div key={c.month} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] font-medium text-foreground">
                    {c.length}
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-fertile to-fertile-light"
                    style={{ height: `${Math.max(20, h)}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {c.month}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
            <span>Shortest: {min} days</span>
            <span>Longest: {max} days</span>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-accent/40 p-5">
          <h3 className="font-display text-base font-medium">
            Your cycle is regular ✨
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cycles between 24 and 38 days are typical. Yours has stayed within a
            healthy 3-day range over the last six months.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: typeof TrendingUp;
  value: string;
  label: string;
  tone: "fertile" | "period" | "ovulation";
}) {
  const toneClass =
    tone === "fertile"
      ? "text-fertile bg-fertile-light/30"
      : tone === "period"
        ? "text-period bg-period-light/25"
        : "text-ovulation bg-ovulation/15";
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <span className={`mx-auto mb-2 grid size-8 place-items-center rounded-full ${toneClass}`}>
        <Icon className="size-4" strokeWidth={2.25} />
      </span>
      <p className="font-display text-xl font-semibold leading-none">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
