import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Petal" },
      { name: "description", content: "View your full cycle calendar with period and fertile windows." },
    ],
  }),
  component: CalendarScreen,
});

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

function CalendarScreen() {
  // August 2025 — starts on Friday (offset 4)
  const offset = 4;
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const today = 16;
  const periodDays = [1, 2, 3, 4, 5];
  const fertileDays = [12, 13, 14, 15, 16, 17];
  const ovulationDay = 15;

  return (
    <AppShell title="Calendar">
      <div className="px-5">
        <div className="flex items-center justify-between py-2">
          <button aria-label="Previous month" className="p-2 text-muted-foreground">
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-display text-lg font-medium">August 2025</p>
          <button aria-label="Next month" className="p-2 text-muted-foreground">
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {weekdays.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-y-3 text-center">
          {Array.from({ length: offset }).map((_, i) => (
            <span key={`pad-${i}`} />
          ))}
          {days.map((d) => {
            const isPeriod = periodDays.includes(d);
            const isFertile = fertileDays.includes(d);
            const isOv = d === ovulationDay;
            const isToday = d === today;
            return (
              <div key={d} className="flex justify-center">
                <span
                  className={[
                    "grid size-9 place-items-center rounded-full text-[14px]",
                    isPeriod
                      ? "bg-period text-primary-foreground font-semibold"
                      : isOv
                        ? "border-2 border-ovulation font-semibold text-foreground"
                        : isFertile
                          ? "bg-fertile-light/40 text-foreground"
                          : "text-foreground",
                    isToday && !isPeriod ? "ring-2 ring-fertile" : "",
                  ].join(" ")}
                >
                  {d}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 space-y-2">
          <Legend color="bg-period" label="Period" />
          <Legend color="bg-fertile-light/60" label="Fertile window" />
          <Legend color="border-2 border-ovulation bg-transparent" label="Ovulation" />
        </div>
      </div>
    </AppShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground">
      <span className={`inline-block size-4 rounded-full ${color}`} />
      {label}
    </div>
  );
}
