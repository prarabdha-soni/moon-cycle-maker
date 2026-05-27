import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Petal" },
      {
        name: "description",
        content: "View your full cycle calendar with period and fertile windows.",
      },
    ],
  }),
  component: CalendarScreen,
});

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Convert to Monday-based
}

function CalendarScreen() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const offset = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const todayDate = today.getDate();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  // Mock cycle data based on a 28-day cycle starting from the 1st of the month
  const periodDays = [1, 2, 3, 4, 5];
  const ovulationDay = 14;
  const fertileDays = [
    ovulationDay - 2,
    ovulationDay - 1,
    ovulationDay,
    ovulationDay + 1,
    ovulationDay + 2,
    ovulationDay + 3,
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <AppShell title="Calendar" showBack>
      <div className="px-5">
        <div className="flex items-center justify-between py-2">
          <button
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-display text-lg font-medium">
            {monthNames[month]} {year}
          </p>
          <button
            onClick={goToNextMonth}
            aria-label="Next month"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
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
            const isToday = isCurrentMonth && d === todayDate;
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
