import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, Flame } from "lucide-react";
import { YOGA_POSES, PoseSVG } from "@/lib/yoga-poses";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/yoga-flow")({
  head: () => ({
    meta: [{ title: "Yoga sequence — Petal" }],
  }),
  component: YogaFlowScreen,
});

function yogaDoneKey() {
  return `petal:yogaDone:${new Date().toISOString().slice(0, 10)}`;
}

function updateStreak(): number {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const lastDone = window.localStorage.getItem("petal:yogaLastDone") ?? "";
  let streak = parseInt(window.localStorage.getItem("petal:yogaStreak") ?? "0", 10);

  if (lastDone === today) return streak; // already counted today
  streak = lastDone === yesterday ? streak + 1 : 1;
  window.localStorage.setItem("petal:yogaStreak", String(streak));
  window.localStorage.setItem("petal:yogaLastDone", today);
  return streak;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function YogaFlowScreen() {
  const navigate = useNavigate();
  const [poseIndex, setPoseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(YOGA_POSES[0].durationSec);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  const pose = YOGA_POSES[poseIndex];
  const total = YOGA_POSES.length;
  const progress = (pose.durationSec - secondsLeft) / pose.durationSec;
  const holdDone = secondsLeft === 0;

  // Reset timer whenever pose changes
  useEffect(() => {
    setSecondsLeft(YOGA_POSES[poseIndex].durationSec);
  }, [poseIndex]);

  // Countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleNext = () => {
    if (poseIndex < total - 1) {
      setPoseIndex((i) => i + 1);
    } else {
      window.localStorage.setItem(yogaDoneKey(), "1");
      const newStreak = updateStreak();
      setStreak(newStreak);
      setCompleted(true);
    }
  };

  const handleBack = () => navigate({ to: "/pcos", replace: true });

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <div className="grid size-24 place-items-center rounded-full bg-ovulation/15 mb-6">
          <Check className="size-12 text-ovulation" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-[28px] font-medium text-foreground leading-tight">
          Sequence complete!
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          20 minutes of restorative yoga done.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-2xl bg-pcos/8 border border-pcos/20 px-6 py-4">
          <Flame className="size-6 text-pcos shrink-0" strokeWidth={2.25} />
          <div className="text-left">
            <p className="text-[13px] font-semibold text-foreground">
              {streak} day streak 🎉
            </p>
            <p className="text-[12px] text-muted-foreground">Keep showing up for yourself</p>
          </div>
        </div>

        <button
          onClick={handleBack}
          className="mt-10 w-full max-w-xs rounded-full bg-pcos py-4 text-[15px] font-semibold text-white shadow-lg shadow-pcos/25 active:scale-[0.98]"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div
      className="mx-auto flex max-w-md flex-col bg-background"
      style={{ height: "100dvh" } as React.CSSProperties}
    >
      {/* Top bar */}
      <header className="shrink-0 flex items-center justify-between px-5 pt-6 pb-4">
        <button
          onClick={handleBack}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground active:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" strokeWidth={2.25} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {YOGA_POSES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "rounded-full transition-all",
                i < poseIndex
                  ? "size-2 bg-ovulation"
                  : i === poseIndex
                    ? "h-2 w-5 bg-pcos"
                    : "size-2 bg-border",
              )}
            />
          ))}
        </div>

        <span className="text-[12px] font-medium text-muted-foreground">
          {poseIndex + 1} of {total}
        </span>
      </header>

      {/* Pose content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Illustration */}
        <div className="grid size-44 place-items-center rounded-3xl bg-pcos/8 border border-pcos/15 mb-6">
          <PoseSVG id={pose.id} className="size-28 text-pcos" />
        </div>

        {/* Names */}
        <h2 className="font-display text-[24px] font-medium text-foreground leading-tight">
          {pose.name}
        </h2>
        <p className="mt-1 text-[13px] italic text-muted-foreground">{pose.sanskrit}</p>

        {/* Tip */}
        <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
          {pose.tip}
        </p>

        {/* Benefit tag */}
        <span className={cn("mt-4 rounded-full px-3 py-1 text-[11px] font-semibold", pose.benefitClass)}>
          {pose.benefit}
        </span>
      </div>

      {/* Timer + controls */}
      <div className="shrink-0 px-5 pb-10 space-y-4">
        {/* Countdown */}
        <div className="text-center">
          <p
            className={cn(
              "font-display text-[48px] font-medium leading-none tabular-nums",
              holdDone ? "text-ovulation" : "text-foreground",
            )}
          >
            {holdDone ? "✓" : formatTime(secondsLeft)}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {holdDone ? "Hold complete — whenever you're ready" : `Hold for ${pose.holdLabel}`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              holdDone ? "bg-ovulation" : "bg-pcos",
            )}
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleNext}
          className={cn(
            "w-full rounded-full py-4 text-[15px] font-semibold text-white shadow-lg transition-all active:scale-[0.98]",
            holdDone ? "bg-ovulation shadow-ovulation/25" : "bg-pcos shadow-pcos/25",
          )}
        >
          {poseIndex === total - 1
            ? holdDone
              ? "Complete sequence"
              : "Skip & complete"
            : holdDone
              ? "Next pose →"
              : `Skip to next →`}
        </button>
      </div>
    </div>
  );
}
