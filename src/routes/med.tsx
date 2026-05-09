import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  Plus,
  Sun,
  Sunset,
  Moon,
  Bell,
  GlassWater,
  Droplet,
  Minus,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/med")({
  head: () => ({
    meta: [
      { title: "Med & supplements — Petal" },
      {
        name: "description",
        content:
          "Track your daily medication and supplements with reminders, dose history and adherence streaks.",
      },
    ],
  }),
  component: MedScreen,
});

type Period = "morning" | "afternoon" | "evening";

interface MedItem {
  id: string;
  name: string;
  dose: string;
  time: string;
  period: Period;
  tone: "period" | "fertile" | "ovulation" | "pms";
  note?: string;
}

const seedToday: MedItem[] = [
  { id: "1", name: "Iron + Vit C", dose: "65 mg", time: "08:00", period: "morning", tone: "period", note: "With breakfast" },
  { id: "2", name: "Omega-3", dose: "1000 mg", time: "08:15", period: "morning", tone: "fertile" },
  { id: "3", name: "Vitamin D3", dose: "2000 IU", time: "13:00", period: "afternoon", tone: "pms" },
  { id: "4", name: "Magnesium", dose: "300 mg", time: "21:30", period: "evening", tone: "ovulation", note: "Before bed" },
];

function MedScreen() {
  const [taken, setTaken] = useState<Record<string, boolean>>({ "2": true });
  const [activePeriod, setActivePeriod] = useState<Period | "all">("all");

  const items = useMemo(
    () => (activePeriod === "all" ? seedToday : seedToday.filter((m) => m.period === activePeriod)),
    [activePeriod],
  );

  const total = seedToday.length;
  const done = seedToday.filter((m) => taken[m.id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <AppShell title="Med">
      <div className="px-5">
        {/* Date strip */}
        <div className="flex items-center justify-between py-2">
          <button aria-label="Previous day" className="p-2 text-muted-foreground">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <p className="font-display text-lg font-medium leading-tight">Today</p>
            <p className="text-[12px] text-muted-foreground">Sat, 16 August</p>
          </div>
          <button aria-label="Next day" className="p-2 text-muted-foreground">
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Adherence card */}
        <div className="mt-3 overflow-hidden rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-4">
            <RingProgress value={pct} />
            <div className="flex-1">
              <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                Today's plan
              </p>
              <p className="mt-1 font-display text-2xl font-medium text-foreground">
                {done} of {total} taken
              </p>
              <div className="mt-2 flex items-center gap-2 text-[12px] text-fertile">
                <Bell className="size-3.5" />
                <span>Next: Vitamin D3 · 13:00</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Streak label="Streak" value="12 d" tone="period" />
            <Streak label="This week" value="86%" tone="fertile" />
            <Streak label="Refills" value="2" tone="pms" />
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search supplements"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Period filter */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {([
            { id: "all", label: "All", icon: null },
            { id: "morning", label: "Morning", icon: Sun },
            { id: "afternoon", label: "Afternoon", icon: Sunset },
            { id: "evening", label: "Evening", icon: Moon },
          ] as const).map(({ id, label, icon: Icon }) => {
            const active = activePeriod === id;
            return (
              <button
                key={id}
                onClick={() => setActivePeriod(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                  active
                    ? "border-transparent bg-foreground text-background"
                    : "border-border bg-card text-foreground"
                }`}
              >
                {Icon && <Icon className="size-3.5" />}
                {label}
              </button>
            );
          })}
        </div>

        {/* List */}
        <ul className="mt-4 space-y-3">
          {items.map((m) => {
            const isTaken = !!taken[m.id];
            const toneBg =
              m.tone === "period"
                ? "bg-period"
                : m.tone === "fertile"
                  ? "bg-fertile"
                  : m.tone === "ovulation"
                    ? "bg-ovulation"
                    : "bg-pms";
            return (
              <li
                key={m.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 pr-4"
              >
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${toneBg}/15`}>
                  <span className={`size-3 rounded-full ${toneBg}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-[16px] font-medium text-foreground">
                      {m.name}
                    </p>
                    <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">
                      {m.time}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span>{m.dose}</span>
                    {m.note && (
                      <>
                        <span className="size-1 rounded-full bg-muted-foreground/50" />
                        <span className="truncate">{m.note}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  aria-label={isTaken ? "Mark as not taken" : "Mark as taken"}
                  aria-pressed={isTaken}
                  onClick={() =>
                    setTaken((t) => ({ ...t, [m.id]: !t[m.id] }))
                  }
                  className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all ${
                    isTaken
                      ? "border-transparent bg-fertile text-primary-foreground shadow-md shadow-fertile/30"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <Check
                    className={`size-4 ${isTaken ? "opacity-100" : "opacity-50"}`}
                    strokeWidth={3}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Add button */}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-border py-3.5 text-sm font-medium text-fertile transition-colors hover:bg-fertile-light/20">
          <Plus className="size-4" strokeWidth={2.5} />
          Add medication or supplement
        </button>
      </div>
    </AppShell>
  );
}

function RingProgress({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative grid size-20 place-items-center">
      <svg viewBox="0 0 72 72" className="size-20 -rotate-90">
        <circle cx="36" cy="36" r={r} className="fill-none stroke-track" strokeWidth="8" />
        <circle
          cx="36"
          cy="36"
          r={r}
          className="fill-none stroke-fertile"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-display text-[15px] font-semibold text-foreground">
        {value}%
      </span>
    </div>
  );
}

function Streak({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "period" | "fertile" | "pms";
}) {
  const dot =
    tone === "period" ? "bg-period" : tone === "fertile" ? "bg-fertile" : "bg-pms";
  return (
    <div className="flex-1 rounded-2xl bg-accent/60 px-3 py-2">
      <div className="flex items-center gap-1.5">
        <span className={`size-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-0.5 font-display text-[15px] font-medium text-foreground">{value}</p>
    </div>
  );
}
