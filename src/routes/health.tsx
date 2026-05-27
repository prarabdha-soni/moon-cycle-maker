import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Clock, Sparkles, Wind, Scale, Dumbbell, ChevronRight, Flame, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health — Petal" },
      { name: "description", content: "Phase-synced hair, skin, weight and workout guides." },
    ],
  }),
  component: HealthScreen,
});

const TABS = ["All", "Hair", "Skin", "Workout", "Weight"] as const;
type Tab = (typeof TABS)[number];

// ── Phase banner ─────────────────────────────────────────────
function getPhaseBanner() {
  if (typeof window === "undefined") return null;
  const lastPeriod = window.localStorage.getItem("petal:lastPeriod");
  const cycleLength = parseInt(window.localStorage.getItem("petal:cycleLength") || "28", 10);
  if (!lastPeriod) return null;
  const diffDays = Math.floor((Date.now() - new Date(lastPeriod).getTime()) / 86400000);
  const currentDay = Math.max(1, Math.min(cycleLength, (diffDays % cycleLength) + 1));
  const ovDay = cycleLength - 14;
  const fertStart = ovDay - 5;
  let phase = "Follicular";
  if (currentDay <= 5) phase = "Period";
  else if (currentDay >= fertStart && currentDay <= ovDay - 1) phase = "Fertile window";
  else if (currentDay === ovDay || currentDay === ovDay + 1) phase = "Ovulation";
  else if (currentDay > ovDay + 1) phase = "Luteal phase";
  return { phase, day: currentDay };
}

// ── Videos ───────────────────────────────────────────────────
// youtubeSearch → YouTube embed search playlist (no API key required)
const VIDEOS = [
  {
    id: "v1",
    category: "Workout",
    title: "Follicular Phase Full Body Workout",
    duration: "22 min",
    instructor: "Adriene M.",
    gradient: "from-ovulation to-fertile",
    icon: Dumbbell,
    tag: "High energy",
    tagColor: "bg-ovulation/15 text-ovulation",
    youtubeSearch: "follicular phase full body workout cycle sync",
  },
  {
    id: "v2",
    category: "Skin",
    title: "Luteal Phase Skincare Routine",
    duration: "8 min",
    instructor: "Dr. Priya K.",
    gradient: "from-pms to-period-light",
    icon: Sparkles,
    tag: "Anti-breakout",
    tagColor: "bg-pms/15 text-pms",
    youtubeSearch: "luteal phase skincare routine hormonal acne cycle sync",
  },
  {
    id: "v3",
    category: "Hair",
    title: "Period Week Hair Care — Less Shedding",
    duration: "12 min",
    instructor: "Meera S.",
    gradient: "from-period via-period-light to-pms",
    icon: Wind,
    tag: "Gentle care",
    tagColor: "bg-period/15 text-period",
    youtubeSearch: "period week hair care routine hair shedding cycle",
  },
  {
    id: "v4",
    category: "Weight",
    title: "Ovulation Phase HIIT — Max Fat Burn",
    duration: "30 min",
    instructor: "Nisha R.",
    gradient: "from-fertile to-ovulation",
    icon: Flame,
    tag: "Intense",
    tagColor: "bg-fertile/15 text-fertile",
    youtubeSearch: "ovulation phase HIIT workout cycle syncing fat burn",
  },
  {
    id: "v5",
    category: "Skin",
    title: "Cycle-Synced Gua Sha Routine",
    duration: "10 min",
    instructor: "Dr. Ananya V.",
    gradient: "from-fertile-light to-fertile",
    icon: Sparkles,
    tag: "Glow ritual",
    tagColor: "bg-fertile/15 text-fertile",
    youtubeSearch: "cycle synced gua sha facial massage routine",
  },
  {
    id: "v6",
    category: "Workout",
    title: "Luteal Phase Yoga & Breathwork",
    duration: "18 min",
    instructor: "Sunita J.",
    gradient: "from-pms/60 to-period-light",
    icon: Dumbbell,
    tag: "Restorative",
    tagColor: "bg-pms/15 text-pms",
    youtubeSearch: "luteal phase yoga breathwork cycle sync PMS relief",
  },
];

type Video = (typeof VIDEOS)[0];

// ── Guides ───────────────────────────────────────────────────
const GUIDES = [
  {
    category: "Hair",
    icon: Wind,
    title: "Cycle-synced hair oil routine",
    body: "Which oils to use in each phase and when to avoid heat styling.",
    gradient: "from-period/30 to-pms/30",
    color: "text-pms",
    bg: "bg-pms/8 border-pms/20",
  },
  {
    category: "Skin",
    icon: Sparkles,
    title: "The 4-phase skincare guide",
    body: "When to exfoliate, when to hydrate, and when to leave your skin alone.",
    gradient: "from-fertile-light/40 to-ovulation/30",
    color: "text-ovulation",
    bg: "bg-ovulation/8 border-ovulation/20",
  },
  {
    category: "Weight",
    icon: Scale,
    title: "Eating for your cycle",
    body: "Calorie and macro adjustments that actually work with your hormones.",
    gradient: "from-fertile/30 to-ovulation/20",
    color: "text-fertile",
    bg: "bg-fertile/8 border-fertile/20",
  },
  {
    category: "Workout",
    icon: Dumbbell,
    title: "Phase-synced workout plan",
    body: "HIIT in follicular, strength at ovulation, yoga in luteal — here's why.",
    gradient: "from-ovulation/30 to-fertile/30",
    color: "text-ovulation",
    bg: "bg-ovulation/8 border-ovulation/20",
  },
  {
    category: "Hair",
    icon: Wind,
    title: "Why your hair sheds before your period",
    body: "The hormonal reason behind luteal-phase shedding and how to reduce it.",
    gradient: "from-pms/30 to-period/20",
    color: "text-pms",
    bg: "bg-pms/8 border-pms/20",
  },
  {
    category: "Weight",
    icon: Flame,
    title: "Managing PMS cravings naturally",
    body: "Magnesium, protein timing, and the craving foods that actually help.",
    gradient: "from-period-light/40 to-pms/20",
    color: "text-period",
    bg: "bg-period/8 border-period/20",
  },
];

const PHASE_BANNERS: Record<
  string,
  { title: string; subtitle: string; gradient: string; focus: string[] }
> = {
  Period: {
    title: "Rest & Restore",
    subtitle: "Gentle movement, iron-rich foods, hydrating skincare.",
    gradient: "from-period to-pms",
    focus: ["Hair oil massage", "Gentle yoga", "Iron foods"],
  },
  Follicular: {
    title: "Build & Energise",
    subtitle: "Rising energy — best phase for habit building & HIIT.",
    gradient: "from-ovulation to-fertile",
    focus: ["Vitamin C serum", "HIIT workouts", "Calorie deficit"],
  },
  "Fertile window": {
    title: "Peak Performance",
    subtitle: "Oestrogen peak — your skin and hair are at their best.",
    gradient: "from-fertile to-ovulation",
    focus: ["Minimal skincare", "Strength training", "Lean protein"],
  },
  Ovulation: {
    title: "Glow Season ✨",
    subtitle: "Maximum collagen production — best hair & skin day.",
    gradient: "from-ovulation to-fertile",
    focus: ["Collagen boost", "Max intensity gym", "Body confidence"],
  },
  "Luteal phase": {
    title: "Slow Down & Nourish",
    subtitle: "Progesterone rises — cleanse well, move gently.",
    gradient: "from-pms to-period-light",
    focus: ["Double cleanse", "Yoga / walks", "Healthy snacks"],
  },
};

// ── YouTube Video Player Sheet ────────────────────────────────
function VideoPlayerSheet({ video, onClose }: { video: Video; onClose: () => void }) {
  // YouTube embed search playlist — no API key needed, always returns relevant videos
  const embedSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(video.youtubeSearch)}&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-12">
        <button
          onClick={onClose}
          aria-label="Close player"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
        >
          <X className="size-5" strokeWidth={2.25} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-white">{video.title}</p>
          <p className="text-[11px] text-white/60">
            {video.instructor} · {video.duration}
          </p>
        </div>
      </div>

      {/* 16:9 embed */}
      <div className="w-full" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embedSrc}
          title={video.title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Info card below the player */}
      <div className="flex-1 overflow-y-auto bg-neutral-950 px-5 pt-4 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1">
          Now watching
        </p>
        <p className="text-[17px] font-semibold text-white leading-snug">{video.title}</p>
        <div className="mt-2 flex items-center gap-3 text-[13px] text-white/60">
          <span>{video.instructor}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" strokeWidth={2} />
            {video.duration}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/70">
            {video.tag}
          </span>
        </div>
        <p className="mt-3 text-[12px] text-white/50 leading-relaxed">
          Results powered by YouTube Search · Tap a video above to start playing.
        </p>
      </div>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────
function HealthScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const banner = getPhaseBanner();
  const phaseBanner = banner ? (PHASE_BANNERS[banner.phase] ?? PHASE_BANNERS["Follicular"]) : null;

  const filteredVideos =
    activeTab === "All" ? VIDEOS : VIDEOS.filter((v) => v.category === activeTab);
  const filteredGuides =
    activeTab === "All" ? GUIDES : GUIDES.filter((g) => g.category === activeTab);

  return (
    <>
      {/* Video player overlay */}
      {playingVideo && (
        <VideoPlayerSheet video={playingVideo} onClose={() => setPlayingVideo(null)} />
      )}

      <AppShell title="Health">
        <div className="pb-6">
          {/* Phase sync banner */}
          {phaseBanner && (
            <div
              className={cn(
                "mx-5 mt-2 overflow-hidden rounded-3xl bg-gradient-to-br p-5",
                phaseBanner.gradient,
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                Day {banner?.day} · {banner?.phase}
              </p>
              <h2 className="mt-1 font-display text-[22px] font-bold text-white leading-tight">
                {phaseBanner.title}
              </h2>
              <p className="mt-1 text-[12px] text-white/80 leading-relaxed">
                {phaseBanner.subtitle}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {phaseBanner.focus.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                  activeTab === tab
                    ? "bg-period text-white"
                    : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="px-5 space-y-5">
            {/* Videos */}
            {filteredVideos.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Videos
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
                  {filteredVideos.map((v) => {
                    const Icon = v.icon;
                    return (
                      <div
                        key={v.id}
                        className="shrink-0 w-[200px] rounded-2xl overflow-hidden border border-border bg-card"
                      >
                        {/* Thumbnail */}
                        <div
                          className={cn(
                            "relative h-[112px] bg-gradient-to-br flex items-center justify-center",
                            v.gradient,
                          )}
                        >
                          <button
                            onClick={() => setPlayingVideo(v)}
                            aria-label={`Play ${v.title}`}
                            className="grid size-12 place-items-center rounded-full bg-white/25 backdrop-blur-sm border border-white/30 transition-all hover:bg-white/35 active:scale-95"
                          >
                            <Play className="size-5 text-white fill-white ml-0.5" strokeWidth={0} />
                          </button>
                          <span
                            className={cn(
                              "absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                              v.tagColor,
                              "bg-white/90",
                            )}
                          >
                            {v.tag}
                          </span>
                        </div>
                        {/* Info */}
                        <div className="p-3">
                          <p className="text-[12px] font-semibold text-foreground leading-snug line-clamp-2">
                            {v.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">
                              {v.instructor}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="size-3" strokeWidth={2} />
                              {v.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Guides */}
            {filteredGuides.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Guides
                </p>
                <div className="space-y-3">
                  {filteredGuides.map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.title}
                        className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/40 active:scale-[0.99]"
                      >
                        <span
                          className={cn(
                            "grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br",
                            g.gradient,
                          )}
                        >
                          <Icon className="size-6 text-white" strokeWidth={2} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider",
                              g.color,
                            )}
                          >
                            {g.category}
                          </span>
                          <span className="block text-[13px] font-semibold text-foreground leading-snug mt-0.5">
                            {g.title}
                          </span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                            {g.body}
                          </span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </>
  );
}
