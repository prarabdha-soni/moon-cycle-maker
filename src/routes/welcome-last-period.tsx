import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome-last-period")({
  head: () => ({
    meta: [
      { title: "Last Period — Petal" },
      { name: "description", content: "Tell us when your last period started." },
    ],
  }),
  component: LastPeriodScreen,
});

const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
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

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function LastPeriodScreen() {
  const navigate = useNavigate();

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // periodStart: ISO string; flowDays: set of ISO strings
  const [periodStart, setPeriodStart] = useState<string>("");
  const [flowDays, setFlowDays] = useState<Set<string>>(new Set());

  const handleContinue = () => {
    if (!periodStart) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:lastPeriod", periodStart);
      window.localStorage.setItem("petal:onboarded", "1");
    }
    const mode =
      typeof window !== "undefined" ? window.localStorage.getItem("petal:mode") : "regular";
    if (mode === "pregnant") {
      navigate({ to: "/pregnant", replace: true });
    } else {
      navigate({ to: "/", replace: true });
    }
  };

  const goBack = () => navigate({ to: "/welcome-mode", replace: true });

  // Build calendar grid for current month
  const firstDay = new Date(viewYear, viewMonth, 1);
  // Monday-first: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleDayClick = (dateStr: string) => {
    // Can't select future dates
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
    if (dateStr > todayStr) return;

    if (!periodStart) {
      // First tap — set start
      setPeriodStart(dateStr);
      setFlowDays(new Set([dateStr]));
    } else if (dateStr === periodStart) {
      // Deselect
      setPeriodStart("");
      setFlowDays(new Set());
    } else {
      // Toggle additional flow day
      const next = new Set(flowDays);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
        // If earlier than current start, shift start
        if (dateStr < periodStart) {
          setPeriodStart(dateStr);
        }
      }
      setFlowDays(next);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    // Don't go beyond current month
    const nowM = today.getMonth();
    const nowY = today.getFullYear();
    if (viewYear > nowY || (viewYear === nowY && viewMonth >= nowM)) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const atMaxMonth =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth >= today.getMonth());

  // Grid cells: null = empty padding, number = day
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <button
          onClick={goBack}
          className="grid size-9 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" strokeWidth={2.25} />
        </button>
        <span className="font-display text-[17px] font-semibold text-period">Petal</span>
        <span className="size-9" aria-hidden />
      </div>

      {/* ── Progress dots ── */}
      <div className="flex justify-center gap-2 mt-2">
        <span className="h-1.5 w-8 rounded-full bg-period" />
        <span className="h-1.5 w-8 rounded-full bg-period" />
        <span className="h-1.5 w-8 rounded-full bg-border" />
      </div>

      {/* ── Heading ── */}
      <div className="px-5 mt-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Step 1 of 2
        </span>
        <h1 className="mt-2 font-display text-[26px] leading-snug font-bold text-foreground">
          When did your last period start?
        </h1>
        <p className="mt-1 text-[14px] text-muted-foreground">
          This helps predict your next cycle.
        </p>
      </div>

      {/* ── Calendar ── */}
      <div className="mx-5 mt-5 rounded-3xl border border-border bg-card px-4 py-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-bold text-foreground">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-accent"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4 text-foreground" strokeWidth={2.5} />
            </button>
            <button
              onClick={nextMonth}
              disabled={atMaxMonth}
              className="grid size-8 place-items-center rounded-full transition-colors hover:bg-accent disabled:opacity-30"
              aria-label="Next month"
            >
              <ChevronRight className="size-4 text-foreground" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              className="text-center text-[12px] font-semibold text-muted-foreground py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} />;

            const dateStr = toDateStr(viewYear, viewMonth, day);
            const isStart = dateStr === periodStart;
            const isFlow = flowDays.has(dateStr);
            const isToday = dateStr === todayStr;
            const isFuture = dateStr > todayStr;

            return (
              <button
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                disabled={isFuture}
                className={cn(
                  "relative mx-auto flex size-9 items-center justify-center rounded-full text-[14px] font-medium transition-all",
                  isFuture && "cursor-default opacity-30",
                  isStart && "bg-period text-white font-bold shadow-md shadow-period/30",
                  !isStart && isFlow && "bg-period/15 text-period font-semibold",
                  !isStart && !isFlow && isToday && "ring-2 ring-period/60 text-foreground",
                  !isStart && !isFlow && !isToday && !isFuture && "text-foreground hover:bg-accent",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Summary ── */}
      {periodStart ? (
        <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl bg-period/8 border border-period/20 px-4 py-3">
          <CalendarDays className="size-5 shrink-0 text-period" strokeWidth={2} />
          <p className="text-[14px] text-foreground">
            Last period:{" "}
            <span className="font-bold text-period">{formatDisplayDate(periodStart)}</span>
          </p>
        </div>
      ) : (
        <div className="mx-5 mt-4 flex items-center gap-3 rounded-2xl bg-muted/50 px-4 py-3">
          <CalendarDays className="size-5 shrink-0 text-muted-foreground" strokeWidth={2} />
          <p className="text-[14px] text-muted-foreground">Tap a day to select your last period</p>
        </div>
      )}

      {/* ── Flow tip ── */}
      <p className="mx-5 mt-2 text-[12px] text-muted-foreground">
        Also tap the days your period lasted to mark flow days{" "}
        <span className="text-muted-foreground/70">(optional)</span>.
      </p>

      {/* ── Continue ── */}
      <div className="mt-auto px-5 pb-10 pt-5">
        <button
          disabled={!periodStart}
          onClick={handleContinue}
          className="w-full rounded-full bg-period py-4 text-[15px] font-semibold text-white shadow-lg shadow-period/30 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
