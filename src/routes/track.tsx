import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplet, Heart, Activity, Moon, Pill, Brain, Coffee, Flame } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track today — Petal" },
      { name: "description", content: "Log your period flow, symptoms, mood and more." },
    ],
  }),
  component: TrackScreen,
});

const categories = [
  {
    title: "Period",
    items: [
      { id: "spotting", label: "Spotting", icon: Droplet },
      { id: "light", label: "Light", icon: Droplet },
      { id: "medium", label: "Medium", icon: Droplet },
      { id: "heavy", label: "Heavy", icon: Droplet },
    ],
    tone: "period",
  },
  {
    title: "Mood",
    items: [
      { id: "happy", label: "Happy", icon: Heart },
      { id: "calm", label: "Calm", icon: Moon },
      { id: "anxious", label: "Anxious", icon: Brain },
      { id: "sad", label: "Sad", icon: Heart },
    ],
    tone: "fertile",
  },
  {
    title: "Symptoms",
    items: [
      { id: "cramps", label: "Cramps", icon: Flame },
      { id: "headache", label: "Headache", icon: Brain },
      { id: "fatigue", label: "Fatigue", icon: Coffee },
      { id: "bloating", label: "Bloating", icon: Activity },
    ],
    tone: "pms",
  },
  {
    title: "Medication",
    items: [
      { id: "pill", label: "Pill", icon: Pill },
      { id: "supplements", label: "Vitamins", icon: Pill },
    ],
    tone: "ovulation",
  },
] as const;

function TrackScreen() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  return (
    <AppShell title="Track today">
      <div className="space-y-7 px-5 pt-2">
        <p className="text-sm text-muted-foreground">
          Tap to log how you feel — Saturday, 16 August
        </p>

        {categories.map((cat) => (
          <section key={cat.title}>
            <h2 className="mb-3 font-display text-lg font-medium text-foreground">
              {cat.title}
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {cat.items.map(({ id, label, icon: Icon }) => {
                const active = selected[id];
                const toneBg =
                  cat.tone === "period"
                    ? "bg-period text-primary-foreground"
                    : cat.tone === "fertile"
                      ? "bg-fertile text-primary-foreground"
                      : cat.tone === "pms"
                        ? "bg-pms text-primary-foreground"
                        : "bg-ovulation text-primary-foreground";
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className="flex flex-col items-center gap-2"
                    aria-pressed={active}
                  >
                    <span
                      className={`grid size-16 place-items-center rounded-2xl border transition-all ${
                        active
                          ? `${toneBg} border-transparent shadow-md`
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-6" strokeWidth={2} />
                    </span>
                    <span className="text-[12px] text-foreground">{label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        <button className="w-full rounded-full bg-fertile py-4 font-semibold text-primary-foreground shadow-lg shadow-fertile/30 transition-transform active:scale-[0.98]">
          Save entry
        </button>
      </div>
    </AppShell>
  );
}
