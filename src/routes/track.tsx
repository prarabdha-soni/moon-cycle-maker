import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Droplet,
  Heart,
  Activity,
  Moon,
  Pill,
  Brain,
  Coffee,
  Flame,
  BedDouble,
  Sparkles,
  Wind,
  Scale,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track today — Petal" },
      { name: "description", content: "Log your period flow, symptoms, mood and more." },
    ],
  }),
  component: TrackScreen,
});

type Tone = "period" | "fertile" | "pms" | "ovulation" | "health" | "skin";

const TONE_ACTIVE: Record<Tone, string> = {
  period: "bg-period text-white border-transparent shadow-period/20",
  fertile: "bg-fertile text-white border-transparent shadow-fertile/20",
  pms: "bg-pms text-white border-transparent shadow-pms/20",
  ovulation: "bg-ovulation text-white border-transparent shadow-ovulation/20",
  health: "bg-[#7c5cbf] text-white border-transparent shadow-purple-200",
  skin: "bg-[#e07b7b] text-white border-transparent shadow-rose-200",
};

const categories = [
  {
    title: "Period",
    subtitle: "How heavy is your flow today?",
    tone: "period" as Tone,
    items: [
      { id: "spotting", label: "Spotting", icon: Droplet },
      { id: "light", label: "Light", icon: Droplet },
      { id: "medium", label: "Medium", icon: Droplet },
      { id: "heavy", label: "Heavy", icon: Droplet },
    ],
  },
  {
    title: "Mood",
    subtitle: "How are you feeling emotionally?",
    tone: "fertile" as Tone,
    items: [
      { id: "happy", label: "Happy", icon: Heart },
      { id: "calm", label: "Calm", icon: Moon },
      { id: "anxious", label: "Anxious", icon: Brain },
      { id: "sad", label: "Sad", icon: Heart },
    ],
  },
  {
    title: "Symptoms",
    subtitle: "Any physical symptoms today?",
    tone: "pms" as Tone,
    items: [
      { id: "cramps", label: "Cramps", icon: Flame },
      { id: "headache", label: "Headache", icon: Brain },
      { id: "fatigue", label: "Fatigue", icon: Coffee },
      { id: "bloating", label: "Bloating", icon: Activity },
    ],
  },
  {
    title: "Sleep",
    subtitle: "How did you sleep last night?",
    tone: "health" as Tone,
    items: [
      { id: "sleep-poor", label: "Poor", icon: BedDouble },
      { id: "sleep-fair", label: "Fair", icon: BedDouble },
      { id: "sleep-good", label: "Good", icon: BedDouble },
      { id: "sleep-great", label: "Great", icon: BedDouble },
    ],
  },
  {
    title: "Skin",
    subtitle: "How does your skin feel today?",
    tone: "skin" as Tone,
    items: [
      { id: "skin-clear", label: "Clear", icon: Sparkles },
      { id: "skin-oily", label: "Oily", icon: Droplet },
      { id: "skin-dry", label: "Dry", icon: Wind },
      { id: "skin-acne", label: "Breaking out", icon: Activity },
    ],
  },
  {
    title: "Hair",
    subtitle: "How's your hair today?",
    tone: "pms" as Tone,
    items: [
      { id: "hair-normal", label: "Normal", icon: Sparkles },
      { id: "hair-oily", label: "Oily", icon: Droplet },
      { id: "hair-dry", label: "Dry", icon: Wind },
      { id: "hair-shedding", label: "Shedding", icon: Activity },
    ],
  },
  {
    title: "Body",
    subtitle: "How does your body feel?",
    tone: "ovulation" as Tone,
    items: [
      { id: "body-light", label: "Lean", icon: Scale },
      { id: "body-bloated", label: "Bloated", icon: Activity },
      { id: "body-heavy", label: "Heavy", icon: Scale },
      { id: "body-energised", label: "Energised", icon: Flame },
    ],
  },
  {
    title: "Medication",
    subtitle: "Did you take your supplements?",
    tone: "ovulation" as Tone,
    items: [
      { id: "pill", label: "Pill", icon: Pill },
      { id: "supplements", label: "Vitamins", icon: Pill },
    ],
  },
];

function TrackScreen() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const totalLogged = Object.values(selected).filter(Boolean).length;

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Track today">
      <div className="space-y-6 px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted-foreground">{today}</p>
          {totalLogged > 0 && (
            <span className="rounded-full bg-period/10 px-2.5 py-1 text-[11px] font-semibold text-period">
              {totalLogged} logged
            </span>
          )}
        </div>

        {categories.map((cat) => (
          <section key={cat.title}>
            <div className="mb-2">
              <h2 className="font-display text-[16px] font-semibold text-foreground">
                {cat.title}
              </h2>
              <p className="text-[12px] text-muted-foreground">{cat.subtitle}</p>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {cat.items.map(({ id, label, icon: Icon }) => {
                const active = selected[id];
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className="flex flex-col items-center gap-1.5"
                    aria-pressed={active}
                  >
                    <span
                      className={cn(
                        "grid size-[60px] place-items-center rounded-2xl border shadow-sm transition-all",
                        active
                          ? TONE_ACTIVE[cat.tone]
                          : "border-border bg-card text-muted-foreground hover:bg-accent/50",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={2} />
                    </span>
                    <span className="text-[11px] text-center leading-tight text-foreground">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <button
          onClick={handleSave}
          className={cn(
            "w-full rounded-full py-4 font-semibold text-white shadow-lg transition-all active:scale-[0.98]",
            saved ? "bg-ovulation shadow-ovulation/30" : "bg-period shadow-period/30",
          )}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="size-4" strokeWidth={2.5} /> Saved!
            </span>
          ) : (
            `Save entry${totalLogged > 0 ? ` (${totalLogged} items)` : ""}`
          )}
        </button>
      </div>
    </AppShell>
  );
}
