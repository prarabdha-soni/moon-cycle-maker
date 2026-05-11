import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Thermometer,
  Droplet,
  TestTube2,
  Heart,
  Sparkles,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  TrendingUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/conceive")({
  head: () => ({
    meta: [
      { title: "Conceive — Petal" },
      {
        name: "description",
        content: "Fertility-first tracking: BBT, cervical mucus, ovulation tests and your fertile window.",
      },
    ],
  }),
  component: ConceiveScreen,
});

// Mock 14-day BBT data (°F)
const bbt = [97.2, 97.1, 97.3, 97.2, 97.4, 97.3, 97.5, 97.4, 97.6, 98.1, 98.2, 98.3, 98.2, 98.3];

function ConceiveScreen() {
  const navigate = useNavigate();
  const [mucus, setMucus] = useState<string | null>(null);
  const [test, setTest] = useState<"positive" | "negative" | null>(null);
  const [showModeMenu, setShowModeMenu] = useState(false);
  
  // Read current mode from localStorage
  const currentMode = typeof window !== "undefined" 
    ? (window.localStorage.getItem("petal:mode") ?? "conceive")
    : "conceive";

  const handleModeSwitch = (newMode: "regular" | "conceive") => {
    window.localStorage.setItem("petal:mode", newMode);
    setShowModeMenu(false);
    if (newMode === "regular") {
      navigate({ to: "/", replace: true });
    }
  };

  return (
    <AppShell title="Conceive">
      <div className="px-5 pb-6">
        {/* Mode selector */}
        <div className="mx-auto mt-2 flex w-fit items-center gap-2 rounded-full bg-ovulation/20 px-4 py-1.5 text-[13px] text-ovulation relative">
          <button 
            onClick={() => setShowModeMenu(!showModeMenu)}
            className="flex items-center gap-1 font-semibold"
          >
            <span className="text-muted-foreground">Mode:</span>
            <span>Conceive Mode</span>
            <ChevronDown className="size-3.5" strokeWidth={2.5} />
          </button>
          
          {showModeMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden z-50">
              <button
                onClick={() => handleModeSwitch("regular")}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  currentMode === "regular" ? "bg-accent" : ""
                }`}
              >
                <span>Regular Tracking</span>
                {currentMode === "regular" && <Check className="size-4 text-fertile" />}
              </button>
              <button
                onClick={() => handleModeSwitch("conceive")}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent ${
                  currentMode === "conceive" ? "bg-accent" : ""
                }`}
              >
                <span>Conceive Mode</span>
                {currentMode === "conceive" && <Check className="size-4 text-ovulation" />}
              </button>
            </div>
          )}
        </div>

        {/* Hero — fertility score */}
        <section className="mt-2 overflow-hidden rounded-3xl bg-gradient-to-br from-ovulation/15 via-fertile/10 to-pms/15 p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ovulation/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ovulation">
                <Sparkles className="size-3" strokeWidth={2.5} /> Peak fertility
              </span>
              <h2 className="mt-3 font-display text-[26px] leading-tight font-medium text-foreground">
                High chance to conceive today
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Day 14 · Estimated ovulation in 1 day
              </p>
            </div>
            <FertilityRing score={92} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Mini label="Cycle day" value="14" />
            <Mini label="Fertile" value="5d left" />
            <Mini label="Next period" value="Jun 1" />
          </div>
        </section>

        {/* Quick log */}
        <section className="mt-7">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[17px] font-medium text-foreground">
              Today's tracking
            </h3>
            <span className="text-[12px] text-muted-foreground">May 11</span>
          </div>

          {/* BBT */}
          <article className="mt-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-period/10 text-period">
                  <Thermometer className="size-5" strokeWidth={2.25} />
                </span>
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    Basal body temperature
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    98.3 °F · logged 7:12 am
                  </p>
                </div>
              </div>
              <button
                aria-label="Edit BBT"
                className="grid size-8 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>
            {/* Sparkline */}
            <BbtChart data={bbt} />
            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>14 days</span>
              <span className="inline-flex items-center gap-1 text-ovulation">
                <TrendingUp className="size-3" strokeWidth={2.5} /> Thermal shift detected
              </span>
            </div>
          </article>

          {/* Cervical mucus */}
          <article className="mt-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-fertile/10 text-fertile">
                <Droplet className="size-5" strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-foreground">
                  Cervical mucus
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Egg-white texture is most fertile
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {["Dry", "Sticky", "Creamy", "Egg-white"].map((m) => {
                const active = mucus === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMucus(m)}
                    aria-pressed={active}
                    className={`rounded-xl border px-2 py-2 text-[11px] font-medium transition-all ${
                      active
                        ? "border-fertile bg-fertile/10 text-fertile"
                        : "border-border bg-background text-muted-foreground hover:border-fertile/40"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </article>

          {/* Ovulation test */}
          <article className="mt-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-ovulation/10 text-ovulation">
                <TestTube2 className="size-5" strokeWidth={2.25} />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-foreground">
                  Ovulation test (LH)
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Log your strip result
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setTest("positive")}
                aria-pressed={test === "positive"}
                className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-all ${
                  test === "positive"
                    ? "border-ovulation bg-ovulation/10 text-ovulation"
                    : "border-border bg-background text-muted-foreground hover:border-ovulation/40"
                }`}
              >
                Positive
              </button>
              <button
                onClick={() => setTest("negative")}
                aria-pressed={test === "negative"}
                className={`rounded-xl border px-3 py-2.5 text-[12px] font-semibold transition-all ${
                  test === "negative"
                    ? "border-fertile bg-fertile/10 text-fertile"
                    : "border-border bg-background text-muted-foreground hover:border-fertile/40"
                }`}
              >
                Negative
              </button>
            </div>
          </article>

          {/* Intercourse */}
          <article className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <span className="grid size-10 place-items-center rounded-xl bg-pms/10 text-pms">
              <Heart className="size-5" strokeWidth={2.25} />
            </span>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-foreground">
                Log intercourse
              </p>
              <p className="text-[12px] text-muted-foreground">
                Today is a high-chance day
              </p>
            </div>
            <button className="rounded-full bg-pms px-3.5 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-sm shadow-pms/30">
              Log
            </button>
          </article>
        </section>

        {/* Insights */}
        <section className="mt-7">
          <h3 className="font-display text-[17px] font-medium text-foreground">
            Your fertile window
          </h3>
          <div className="mt-3 rounded-2xl border border-border bg-card p-4">
            <FertileTimeline />
            <Link
              to="/calendar"
              className="mt-4 flex items-center justify-between rounded-xl bg-accent px-4 py-3 transition-colors hover:bg-accent/80"
            >
              <span className="flex items-center gap-2 text-[13px] font-medium text-foreground">
                <CalendarIcon className="size-4 text-ovulation" strokeWidth={2.25} />
                See full fertile calendar
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/70 p-3 backdrop-blur">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-[15px] font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}

function FertilityRing({ score }: { score: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative grid size-20 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="var(--track)" strokeWidth="6" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--ovulation)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-[20px] font-medium leading-none text-foreground">
          {score}
        </p>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
          score
        </p>
      </div>
    </div>
  );
}

function BbtChart({ data }: { data: number[] }) {
  const min = Math.min(...data) - 0.1;
  const max = Math.max(...data) + 0.1;
  const w = 280;
  const h = 60;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-16 w-full">
      <defs>
        <linearGradient id="bbtFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--ovulation)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--ovulation)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill="url(#bbtFill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="var(--ovulation)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FertileTimeline() {
  const days = Array.from({ length: 14 }, (_, i) => i + 8); // CD 8-21
  const fertile = [12, 13, 14, 15, 16, 17];
  const ov = 15;
  const today = 14;
  return (
    <div className="flex items-end justify-between gap-1">
      {days.map((d) => {
        const isFertile = fertile.includes(d);
        const isOv = d === ov;
        const isToday = d === today;
        return (
          <div key={d} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`w-full rounded-full ${
                isOv
                  ? "h-9 bg-ovulation"
                  : isFertile
                    ? "h-7 bg-fertile/60"
                    : "h-3 bg-track"
              } ${isToday ? "ring-2 ring-foreground/80 ring-offset-2 ring-offset-card" : ""}`}
            />
            <span
              className={`text-[9px] ${
                isToday ? "font-bold text-foreground" : "text-muted-foreground"
              }`}
            >
              {d}
            </span>
          </div>
        );
      })}
    </div>
  );
}
