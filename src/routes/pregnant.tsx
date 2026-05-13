import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Baby,
  Heart,
  Ruler,
  Scale,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/pregnant")({
  head: () => ({
    meta: [
      { title: "Pregnancy — Petal" },
      { name: "description", content: "Track your pregnancy journey with day-by-day baby development." },
    ],
  }),
  component: PregnantScreen,
});

// Pregnancy data by week
const pregnancyData: Record<number, {
  weekLabel: string;
  babySize: string;
  babySizeComparison: string;
  length: string;
  weight: string;
  description: string;
  developments: string[];
}> = {
  4: {
    weekLabel: "Week 4",
    babySize: "Poppy seed",
    babySizeComparison: "Poppy Seed",
    length: "0.04 inches",
    weight: "0.02 oz",
    description: "Your baby is just starting to develop!",
    developments: [
      "The neural tube (brain and spine) is forming",
      "Heart begins to form and may start beating",
      "Arm and leg buds are developing",
      "Placenta is starting to form",
    ],
  },
  8: {
    weekLabel: "Week 8",
    babySize: "Raspberry",
    babySizeComparison: "Raspberry",
    length: "0.63 inches",
    weight: "0.04 oz",
    description: "Major organs are developing rapidly!",
    developments: [
      "All major organs have begun to form",
      "Fingers and toes are developing",
      "Eyes are more visible",
      "Tail is disappearing",
    ],
  },
  12: {
    weekLabel: "Week 12",
    babySize: "Lime",
    babySizeComparison: "Lime",
    length: "2.13 inches",
    weight: "0.49 oz",
    description: "First trimester complete!",
    developments: [
      "Reflexes begin to develop",
      "Toenails are forming",
      "Baby can make a fist",
      "Kidneys begin to produce urine",
    ],
  },
  16: {
    weekLabel: "Week 16",
    babySize: "Avocado",
    babySizeComparison: "Avocado",
    length: "4.57 inches",
    weight: "3.5 oz",
    description: "You might feel movement soon!",
    developments: [
      "Legs are more developed",
      "Baby can grasp the umbilical cord",
      "Ears are moving to their final position",
      "Facial muscles are developing",
    ],
  },
  20: {
    weekLabel: "Week 20",
    babySize: "Banana",
    babySizeComparison: "Banana",
    length: "6.46 inches",
    weight: "10.2 oz",
    description: "Halfway there! Anatomy scan time.",
    developments: [
      "Baby can hear sounds",
      "Vernix covers baby's skin",
      "Meconium is forming in intestines",
      "Swallowing practice begins",
    ],
  },
  24: {
    weekLabel: "Week 24",
    babySize: "Corn",
    babySizeComparison: "Ear of Corn",
    length: "8.03 inches",
    weight: "1.3 lbs",
    description: "Viability milestone reached!",
    developments: [
      "Lungs are developing rapidly",
      "Taste buds are forming",
      "Brain growth is accelerating",
      "Skin is still translucent",
    ],
  },
  28: {
    weekLabel: "Week 28",
    babySize: "Eggplant",
    babySizeComparison: "Eggplant",
    length: "9.84 inches",
    weight: "2.2 lbs",
    description: "Third trimester begins!",
    developments: [
      "Baby can open and close eyes",
      "Brain is developing rapidly",
      "Body fat is accumulating",
      "Breathing practice increases",
    ],
  },
  32: {
    weekLabel: "Week 32",
    babySize: "Coconut",
    babySizeComparison: "Coconut",
    length: "11.22 inches",
    weight: "3.75 lbs",
    description: "Getting ready for the outside world!",
    developments: [
      "Fingernails are fully formed",
      "Baby is practicing breathing",
      "Bones are hardening",
      "Position may change frequently",
    ],
  },
  36: {
    weekLabel: "Week 36",
    babySize: "Papaya",
    babySizeComparison: "Papaya",
    length: "13.39 inches",
    weight: "5.78 lbs",
    description: "Almost full term!",
    developments: [
      "Organs are nearly fully developed",
      "Baby is gaining weight rapidly",
      "Movement may decrease due to space",
      "Position should be head-down",
    ],
  },
  40: {
    weekLabel: "Week 40",
    babySize: "Watermelon",
    babySizeComparison: "Watermelon",
    length: "14.8 inches",
    weight: "7.5 lbs",
    description: "Ready to meet your baby!",
    developments: [
      "Baby is full-term and ready",
      "Lanugo is mostly gone",
      "Organs are fully developed",
      "Waiting for labor to begin!",
    ],
  },
};

function PregnantScreen() {
  const navigate = useNavigate();
  const [currentDate] = useState(new Date());
  
  // Get last period from localStorage or use default (280 days ago for demo)
  const lastPeriodStr = typeof window !== "undefined" 
    ? window.localStorage.getItem("petal:lastPeriod")
    : null;
  
  const lastPeriod = lastPeriodStr ? new Date(lastPeriodStr) : new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000);
  
  // Calculate pregnancy progress
  const today = new Date();
  const diffTime = today.getTime() - lastPeriod.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeksPregnant = Math.floor(diffDays / 7);
  const daysPregnant = diffDays % 7;
  
  // Due date (280 days from last period)
  const dueDate = new Date(lastPeriod.getTime() + 280 * 24 * 60 * 60 * 1000);
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get current week data (cap at 40 weeks)
  const currentWeek = Math.min(Math.max(weeksPregnant, 4), 40);
  const weekData = pregnancyData[currentWeek] || pregnancyData[4];
  
  // Calculate progress percentage
  const totalDays = 280;
  const progressPercent = Math.min((diffDays / totalDays) * 100, 100);

  return (
    <AppShell title="Pregnancy">
      <div className="px-5 pb-6">
        {/* Hero - Pregnancy Progress */}
        <section className="mt-2 overflow-hidden rounded-3xl bg-gradient-to-br from-pms/20 via-fertile/10 to-ovulation/15 p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pms/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-pms">
                <Baby className="size-3" strokeWidth={2.5} /> {weekData.weekLabel}
              </span>
              <h2 className="mt-3 font-display text-[26px] leading-tight font-medium text-foreground">
                {weeksPregnant > 0 && weeksPregnant <= 40 
                  ? `You're ${weeksPregnant} weeks pregnant`
                  : weeksPregnant <= 0 
                    ? "Too early to calculate"
                    : "Past due date"}
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {daysPregnant > 0 && weeksPregnant > 0 && weeksPregnant <= 40
                  ? `Day ${daysPregnant} of week ${weeksPregnant + 1}`
                  : weeksPregnant <= 0
                    ? "Please confirm your last period date"
                    : "Baby could arrive any day now!"}
              </p>
            </div>
            <PregnancyRing progress={progressPercent} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Mini label="Due date" value={formatDate(dueDate)} />
            <Mini label="Days left" value={`${Math.max(daysUntilDue, 0)}d`} />
            <Mini label="Baby size" value={weekData.babySizeComparison} />
          </div>
        </section>

        {/* Baby Development Card */}
        <section className="mt-7">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-[17px] font-medium text-foreground">
              Your baby's development
            </h3>
            <span className="text-[12px] text-muted-foreground">{weekData.weekLabel}</span>
          </div>

          <article className="mt-3 rounded-2xl border border-border bg-card p-5">
            {/* Baby Size Visualization */}
            <div className="flex items-center gap-4 mb-4">
              <div className="grid size-16 place-items-center rounded-2xl bg-pms/10 text-pms">
                <Baby className="size-8" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-foreground">
                  Size of a {weekData.babySizeComparison}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {weekData.length} · {weekData.weight}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[14px] text-foreground mb-4">
              {weekData.description}
            </p>

            {/* Developments List */}
            <div className="space-y-2">
              {weekData.developments.map((dev, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Sparkles className="size-4 shrink-0 text-pms mt-0.5" strokeWidth={2.5} />
                  <p className="text-[13px] text-muted-foreground">{dev}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Timeline Navigation */}
        <section className="mt-7">
          <h3 className="font-display text-[17px] font-medium text-foreground">
            Pregnancy timeline
          </h3>
          <div className="mt-3 rounded-2xl border border-border bg-card p-4">
            <Timeline currentWeek={currentWeek} />
            <button
              onClick={() => navigate({ to: "/calendar" })}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 transition-colors hover:bg-accent/80"
            >
              <Calendar className="size-4 text-pms" strokeWidth={2.25} />
              <span className="text-[13px] font-medium text-foreground">
                View full pregnancy calendar
              </span>
            </button>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="mt-7">
          <h3 className="font-display text-[17px] font-medium text-foreground">
            This week's tips
          </h3>
          <div className="mt-3 space-y-3">
            <TipCard 
              icon={Heart}
              title="Take your prenatal vitamins"
              desc="Folic acid and iron are especially important right now."
            />
            <TipCard 
              icon={Scale}
              title="Stay hydrated"
              desc="Aim for 8-10 glasses of water daily for you and baby."
            />
            <TipCard 
              icon={Ruler}
              title="Rest when needed"
              desc="Your body is working hard. Listen to it and rest."
            />
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

function PregnancyRing({ progress }: { progress: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <div className="relative grid size-20 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} stroke="var(--track)" strokeWidth="6" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--pms)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="text-center">
        <p className="font-display text-[20px] font-medium leading-none text-foreground">
          {Math.round(progress)}%
        </p>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
          complete
        </p>
      </div>
    </div>
  );
}

function Timeline({ currentWeek }: { currentWeek: number }) {
  const weeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
  
  return (
    <div className="flex items-center justify-between gap-1">
      {weeks.map((week) => {
        const isPast = week <= currentWeek;
        const isCurrent = week === currentWeek;
        return (
          <div key={week} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={`w-full rounded-full h-3 transition-all ${
                isCurrent
                  ? "bg-pms ring-2 ring-pms ring-offset-2 ring-offset-card"
                  : isPast
                    ? "bg-pms/60"
                    : "bg-track"
              }`}
            />
            <span
              className={`text-[8px] ${
                isCurrent ? "font-bold text-foreground" : "text-muted-foreground"
              }`}
            >
              {week}w
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TipCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-pms/10 text-pms">
        <Icon className="size-5" strokeWidth={2} />
      </span>
      <div>
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        <p className="mt-1 text-[12px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
