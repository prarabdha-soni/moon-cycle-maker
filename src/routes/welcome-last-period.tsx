import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/welcome-last-period")({
  head: () => ({
    meta: [
      { title: "Last Period — Petal" },
      { name: "description", content: "Tell us when your last period started." },
    ],
  }),
  component: LastPeriodScreen,
});

function LastPeriodScreen() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleContinue = () => {
    if (!selectedDate) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:lastPeriod", selectedDate);
      window.localStorage.setItem("petal:onboarded", "1");
    }
    navigate({ to: "/pregnant", replace: true });
  };

  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 3);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background px-6 pt-10 pb-8">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-8 rounded-full bg-fertile" />
          <span className="h-1.5 w-8 rounded-full bg-fertile" />
          <span className="h-1.5 w-8 rounded-full bg-border" />
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

      {/* Header */}
      <div className="mt-10">
        <span className="inline-block rounded-full bg-pms/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-pms">
          Step 2 of 3
        </span>
        <h1 className="mt-4 font-display text-[32px] leading-tight font-medium text-foreground">
          When was your last period?
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          We'll use this to calculate your due date and track your pregnancy journey.
        </p>
      </div>

      {/* Date Input */}
      <div className="mt-8">
        <label className="block text-[14px] font-medium text-foreground mb-2">
          First day of your last menstrual period
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={maxDate}
            min={minDateString}
            className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-foreground outline-none focus:border-pms focus:ring-2 focus:ring-pms/20 transition-all"
          />
        </div>
        <p className="mt-2 text-[12px] text-muted-foreground">
          This is typically the first day of bleeding (not spotting).
        </p>
      </div>

      {/* Info Card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-pms/15 text-pms">
            <Check className="size-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[14px] font-medium text-foreground">
              Why we ask
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Your last period date helps us calculate your due date and show you week-by-week baby development.
            </p>
          </div>
        </div>
      </div>

      {/* Continue */}
      <div className="mt-auto pt-8">
        <button
          disabled={!selectedDate}
          onClick={handleContinue}
          className="w-full rounded-full bg-pms py-4 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-pms/30 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
