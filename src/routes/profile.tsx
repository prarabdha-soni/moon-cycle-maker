import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Calendar, Settings, Check, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PROFILE_UPDATE_EVENT } from "@/components/ProfileIcon";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Petal" }] }),
  component: ProfileScreen,
});

type Mode = "regular" | "conceive" | "pregnant";

const MODES: {
  id: Mode;
  label: string;
  description: string;
  color: string;
  bg: string;
  dot: string;
}[] = [
  {
    id: "regular",
    label: "Regular",
    description: "Period & symptom tracking",
    color: "text-fertile",
    bg: "bg-fertile/10",
    dot: "bg-fertile",
  },
  {
    id: "conceive",
    label: "Conceive",
    description: "Fertility & ovulation",
    color: "text-ovulation",
    bg: "bg-ovulation/10",
    dot: "bg-ovulation",
  },
  {
    id: "pregnant",
    label: "Pregnant",
    description: "Week-by-week pregnancy",
    color: "text-pms",
    bg: "bg-pms/10",
    dot: "bg-pms",
  },
];

function ProfileScreen() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    lastPeriod: "",
    cycleLength: 28,
    mode: "regular" as Mode,
  });

  // Load on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    setProfile({
      name: window.localStorage.getItem("petal:name") || "",
      lastPeriod: window.localStorage.getItem("petal:lastPeriod") || "",
      cycleLength: parseInt(window.localStorage.getItem("petal:cycleLength") || "28", 10),
      mode: (window.localStorage.getItem("petal:mode") as Mode) || "regular",
    });
  }, []);

  const handleSave = () => {
    if (typeof window === "undefined") return;

    const prevMode = window.localStorage.getItem("petal:mode") as Mode | null;

    window.localStorage.setItem("petal:name", profile.name);
    window.localStorage.setItem("petal:lastPeriod", profile.lastPeriod);
    window.localStorage.setItem("petal:cycleLength", profile.cycleLength.toString());
    window.localStorage.setItem("petal:mode", profile.mode);
    window.dispatchEvent(new Event(PROFILE_UPDATE_EVENT));

    // Always navigate to the correct home screen after saving
    if (profile.mode === "regular") {
      navigate({ to: "/" });
      return;
    }
    if (profile.mode === "conceive") {
      navigate({ to: "/conceive" });
      return;
    }
    const lp = window.localStorage.getItem("petal:lastPeriod");
    navigate({ to: lp ? "/pregnant" : "/welcome-last-period" });
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const mode = (
        typeof window !== "undefined" ? window.localStorage.getItem("petal:mode") : null
      ) as Mode | null;
      if (mode === "conceive") {
        navigate({ to: "/conceive" });
        return;
      }
      if (mode === "pregnant") {
        navigate({ to: "/pregnant" });
        return;
      }
      navigate({ to: "/" });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-border">
        <button
          onClick={goBack}
          aria-label="Back"
          className="grid size-9 place-items-center rounded-full bg-muted text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-5" strokeWidth={2.25} />
        </button>
        <h1 className="font-display text-[20px] font-semibold text-foreground">
          Profile &amp; Settings
        </h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-12">
        {/* Name */}
        <div className="space-y-2">
          <Label
            htmlFor="pf-name"
            className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Your Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="pf-name"
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
              className="pl-9"
            />
          </div>
        </div>

        {/* Last Period Date */}
        <div className="space-y-2">
          <Label
            htmlFor="pf-lmp"
            className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Last Period Date
          </Label>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-period/30 bg-period/5 px-4 py-3">
            <Calendar className="size-5 shrink-0 text-period" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground mb-1">
                First day of last menstrual period
              </p>
              <Input
                id="pf-lmp"
                type="date"
                value={profile.lastPeriod}
                onChange={(e) => setProfile({ ...profile, lastPeriod: e.target.value })}
                className="h-8 border-0 bg-transparent p-0 text-[15px] font-semibold text-foreground shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Cycle Length */}
        <div className="space-y-2">
          <Label
            htmlFor="pf-cycle"
            className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Cycle Length
          </Label>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <Settings className="size-5 shrink-0 text-muted-foreground" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground mb-1">Average days (21–35)</p>
              <Input
                id="pf-cycle"
                type="number"
                min="21"
                max="35"
                value={profile.cycleLength}
                onChange={(e) =>
                  setProfile({ ...profile, cycleLength: parseInt(e.target.value, 10) || 28 })
                }
                className="h-8 border-0 bg-transparent p-0 text-[15px] font-semibold text-foreground shadow-none focus-visible:ring-0"
              />
            </div>
            <span className="text-[13px] text-muted-foreground">days</span>
          </div>
        </div>

        {/* Tracking Mode */}
        <div className="space-y-2">
          <Label className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tracking Mode
          </Label>
          <div className="space-y-2">
            {MODES.map((m) => {
              const active = profile.mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, mode: m.id })}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all",
                    active
                      ? `border-current ${m.color} ${m.bg}`
                      : "border-border bg-background hover:bg-accent",
                  )}
                >
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      active ? m.dot : "bg-muted-foreground/30",
                    )}
                  />
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-[14px] font-semibold",
                        active ? m.color : "text-foreground",
                      )}
                    >
                      {m.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{m.description}</p>
                  </div>
                  {active ? (
                    <Check className={cn("size-4 shrink-0", m.color)} strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground/40" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground px-1">
            Save to switch to the selected mode's screen.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-pms text-primary-foreground hover:bg-pms/90 rounded-2xl h-12 text-[15px] font-semibold"
        >
          Save Changes
        </Button>

        <p className="text-[11px] text-center text-muted-foreground">Saved to this device only.</p>
      </div>
    </div>
  );
}
