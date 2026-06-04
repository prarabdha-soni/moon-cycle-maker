import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Play, Clock, Sparkles, Wind, Scale, Dumbbell, ChevronRight,
  Flame, X, Leaf, Heart, Brain, Activity,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Health — SheThrives" },
      { name: "description", content: "Health guides and videos tailored to your mode." },
    ],
  }),
  component: HealthScreen,
});

type Mode = "regular" | "pcos" | "conceive";

function getMode(): Mode {
  if (typeof window === "undefined") return "regular";
  const raw = window.localStorage.getItem("petal:mode");
  if (raw === "pcos" || raw === "conceive") return raw;
  return "regular";
}

// ── Cycle phase (regular / conceive) ────────────────────────────
function getCycleInfo() {
  if (typeof window === "undefined") return null;
  const lastPeriod = window.localStorage.getItem("petal:lastPeriod");
  const cycleLength = parseInt(window.localStorage.getItem("petal:cycleLength") || "28", 10);
  if (!lastPeriod) return null;
  const diff = Math.floor((Date.now() - new Date(lastPeriod).getTime()) / 86400000);
  const day = Math.max(1, Math.min(cycleLength, (diff % cycleLength) + 1));
  const ovDay = cycleLength - 14;
  const fertStart = ovDay - 5;
  let phase = "Follicular";
  if (day <= 5) phase = "Period";
  else if (day >= fertStart && day <= ovDay - 1) phase = "Fertile window";
  else if (day === ovDay || day === ovDay + 1) phase = "Ovulation";
  else if (day > ovDay + 1) phase = "Luteal phase";
  return { day, phase, cycleLength, ovDay, fertStart };
}

// ── Video player ─────────────────────────────────────────────────
type Video = {
  id: string; category: string; title: string; duration: string;
  instructor: string; gradient: string; icon: React.ElementType;
  tag: string; tagColor: string; youtubeSearch: string;
};

function VideoPlayerSheet({ video, onClose }: { video: Video; onClose: () => void }) {
  const src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(video.youtubeSearch)}&rel=0&modestbranding=1&playsinline=1`;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-12">
        <button onClick={onClose} aria-label="Close"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25">
          <X className="size-5" strokeWidth={2.25} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-white">{video.title}</p>
          <p className="text-[11px] text-white/60">{video.instructor} · {video.duration}</p>
        </div>
      </div>
      <div className="w-full" style={{ aspectRatio: "16/9" }}>
        <iframe src={src} title={video.title} className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
      <div className="flex-1 overflow-y-auto bg-neutral-950 px-5 pt-4 pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50 mb-1">Now watching</p>
        <p className="text-[17px] font-semibold text-white leading-snug">{video.title}</p>
        <div className="mt-2 flex items-center gap-3 text-[13px] text-white/60">
          <span>{video.instructor}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="size-3.5" strokeWidth={2} />{video.duration}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/70">{video.tag}</span>
        </div>
        <p className="mt-3 text-[12px] text-white/50 leading-relaxed">
          Powered by YouTube Search · Tap a video above to start.
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// REGULAR MODE
// ────────────────────────────────────────────────────────────────
const REGULAR_TABS = ["All", "Hair", "Skin", "Workout", "Weight"] as const;
type RegularTab = (typeof REGULAR_TABS)[number];

const REGULAR_VIDEOS: Video[] = [
  { id: "r1", category: "Workout", title: "Follicular Phase Full Body Workout", duration: "22 min", instructor: "Adriene M.", gradient: "from-ovulation to-fertile", icon: Dumbbell, tag: "High energy", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "follicular phase full body workout cycle sync" },
  { id: "r2", category: "Skin", title: "Luteal Phase Skincare Routine", duration: "8 min", instructor: "Dr. Priya K.", gradient: "from-pms to-period-light", icon: Sparkles, tag: "Anti-breakout", tagColor: "bg-pms/15 text-pms", youtubeSearch: "luteal phase skincare routine hormonal acne cycle sync" },
  { id: "r3", category: "Hair", title: "Period Week Hair Care — Less Shedding", duration: "12 min", instructor: "Meera S.", gradient: "from-period via-period-light to-pms", icon: Wind, tag: "Gentle care", tagColor: "bg-period/15 text-period", youtubeSearch: "period week hair care routine hair shedding cycle" },
  { id: "r4", category: "Weight", title: "Ovulation Phase HIIT — Max Fat Burn", duration: "30 min", instructor: "Nisha R.", gradient: "from-fertile to-ovulation", icon: Flame, tag: "Intense", tagColor: "bg-fertile/15 text-fertile", youtubeSearch: "ovulation phase HIIT workout cycle syncing fat burn" },
  { id: "r5", category: "Skin", title: "Cycle-Synced Gua Sha Routine", duration: "10 min", instructor: "Dr. Ananya V.", gradient: "from-fertile-light to-fertile", icon: Sparkles, tag: "Glow ritual", tagColor: "bg-fertile/15 text-fertile", youtubeSearch: "cycle synced gua sha facial massage routine" },
  { id: "r6", category: "Workout", title: "Luteal Phase Yoga & Breathwork", duration: "18 min", instructor: "Sunita J.", gradient: "from-pms/60 to-period-light", icon: Dumbbell, tag: "Restorative", tagColor: "bg-pms/15 text-pms", youtubeSearch: "luteal phase yoga breathwork cycle sync PMS relief" },
];

const REGULAR_GUIDES = [
  { category: "Hair", icon: Wind, title: "Cycle-synced hair oil routine", body: "Which oils to use in each phase and when to avoid heat styling.", gradient: "from-period/30 to-pms/30", color: "text-pms", bg: "bg-pms/8 border-pms/20" },
  { category: "Skin", icon: Sparkles, title: "The 4-phase skincare guide", body: "When to exfoliate, when to hydrate, and when to leave your skin alone.", gradient: "from-fertile-light/40 to-ovulation/30", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Weight", icon: Scale, title: "Eating for your cycle", body: "Calorie and macro adjustments that actually work with your hormones.", gradient: "from-fertile/30 to-ovulation/20", color: "text-fertile", bg: "bg-fertile/8 border-fertile/20" },
  { category: "Workout", icon: Dumbbell, title: "Phase-synced workout plan", body: "HIIT in follicular, strength at ovulation, yoga in luteal — here's why.", gradient: "from-ovulation/30 to-fertile/30", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Hair", icon: Wind, title: "Why your hair sheds before your period", body: "The hormonal reason behind luteal-phase shedding and how to reduce it.", gradient: "from-pms/30 to-period/20", color: "text-pms", bg: "bg-pms/8 border-pms/20" },
  { category: "Weight", icon: Flame, title: "Managing PMS cravings naturally", body: "Magnesium, protein timing, and the craving foods that actually help.", gradient: "from-period-light/40 to-pms/20", color: "text-period", bg: "bg-period/8 border-period/20" },
];

const REGULAR_PHASE_BANNERS: Record<string, { title: string; subtitle: string; gradient: string; focus: string[] }> = {
  Period:          { title: "Rest & Restore",      subtitle: "Gentle movement, iron-rich foods, hydrating skincare.",     gradient: "from-period to-pms",              focus: ["Hair oil massage", "Gentle yoga", "Iron foods"] },
  Follicular:      { title: "Build & Energise",    subtitle: "Rising energy — best phase for habit building & HIIT.",     gradient: "from-ovulation to-fertile",       focus: ["Vitamin C serum", "HIIT workouts", "Calorie deficit"] },
  "Fertile window":{ title: "Peak Performance",    subtitle: "Oestrogen peak — your skin and hair are at their best.",   gradient: "from-fertile to-ovulation",       focus: ["Minimal skincare", "Strength training", "Lean protein"] },
  Ovulation:       { title: "Glow Season ✨",       subtitle: "Maximum collagen production — best hair & skin day.",      gradient: "from-ovulation to-fertile",       focus: ["Collagen boost", "Max intensity gym", "Body confidence"] },
  "Luteal phase":  { title: "Slow Down & Nourish", subtitle: "Progesterone rises — cleanse well, move gently.",          gradient: "from-pms to-period-light",        focus: ["Double cleanse", "Yoga / walks", "Healthy snacks"] },
};

// ────────────────────────────────────────────────────────────────
// PCOS MODE
// ────────────────────────────────────────────────────────────────
const PCOS_TABS = ["All", "Hormones", "Nutrition", "Movement", "Mindset"] as const;
type PcosTab = (typeof PCOS_TABS)[number];

const PCOS_VIDEOS: Video[] = [
  { id: "p1", category: "Movement", title: "Low-Impact HIIT for PCOS — Insulin Reset", duration: "25 min", instructor: "Priya K.", gradient: "from-pcos to-pcos-light", icon: Dumbbell, tag: "Insulin balance", tagColor: "bg-pcos/15 text-pcos", youtubeSearch: "low impact HIIT workout PCOS insulin resistance" },
  { id: "p2", category: "Nutrition", title: "Anti-Inflammatory Meal Prep for PCOS", duration: "20 min", instructor: "Dt. Richa S.", gradient: "from-ovulation to-fertile", icon: Flame, tag: "Meal prep", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "anti inflammatory meal prep PCOS diet Indian" },
  { id: "p3", category: "Hormones", title: "PCOS Hormonal Hair Loss — Full Guide", duration: "14 min", instructor: "Dr. Ananya V.", gradient: "from-pcos-light/60 to-pcos/40", icon: Wind, tag: "Hair loss", tagColor: "bg-pcos/15 text-pcos", youtubeSearch: "PCOS hair loss treatment androgenic alopecia hormonal" },
  { id: "p4", category: "Movement", title: "30-Min Yoga for PCOS & Irregular Cycles", duration: "30 min", instructor: "Sunita J.", gradient: "from-ovulation to-fertile", icon: Leaf, tag: "Yoga", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "yoga PCOS irregular periods cycle regulation" },
  { id: "p5", category: "Mindset", title: "Cortisol & PCOS — Stress Management", duration: "16 min", instructor: "Dr. Meera T.", gradient: "from-pms/60 to-pcos/40", icon: Brain, tag: "Mindfulness", tagColor: "bg-pms/15 text-pms", youtubeSearch: "cortisol PCOS stress management nervous system" },
  { id: "p6", category: "Nutrition", title: "Indian Foods That Heal PCOS Naturally", duration: "12 min", instructor: "Dt. Kavya N.", gradient: "from-ovulation/60 to-fertile", icon: Sparkles, tag: "Indian diet", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "Indian foods PCOS diet methi ashwagandha spearmint" },
];

const PCOS_GUIDES = [
  { category: "Hormones", icon: Activity, title: "Why PCOS makes cycles irregular", body: "Excess androgens block follicle maturation, delaying or preventing ovulation. Here's the full mechanism.", gradient: "from-pcos/30 to-pcos-light/20", color: "text-pcos", bg: "bg-pcos/8 border-pcos/20" },
  { category: "Nutrition", icon: Leaf, title: "The low-GI eating plan for PCOS", body: "Insulin resistance drives 70% of PCOS symptoms. A low-glycaemic diet is the most evidence-backed intervention.", gradient: "from-ovulation/30 to-fertile/20", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Hormones", icon: Wind, title: "PCOS acne & skin: what actually works", body: "Androgen-driven breakouts respond to spearmint tea, zinc, and low-dairy diets — not just topicals.", gradient: "from-pcos-light/40 to-pcos/20", color: "text-pcos", bg: "bg-pcos/8 border-pcos/20" },
  { category: "Movement", icon: Dumbbell, title: "Best exercise types for PCOS", body: "Strength training + low-impact cardio beats HIIT for insulin sensitivity without spiking cortisol.", gradient: "from-ovulation/30 to-fertile/30", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Mindset", icon: Brain, title: "Cortisol, stress & PCOS — the link", body: "Chronic stress raises cortisol, which spikes insulin and androgens. Sleep and breathwork are clinical tools.", gradient: "from-pms/30 to-pcos/20", color: "text-pms", bg: "bg-pms/8 border-pms/20" },
  { category: "Nutrition", icon: Flame, title: "Supplements with PCOS evidence", body: "Inositol, Vitamin D, magnesium, and spearmint — the four with the strongest clinical backing for PCOS.", gradient: "from-pcos/20 to-ovulation/20", color: "text-pcos", bg: "bg-pcos/8 border-pcos/20" },
];

// ────────────────────────────────────────────────────────────────
// CONCEIVE MODE
// ────────────────────────────────────────────────────────────────
const CONCEIVE_TABS = ["All", "Fertility", "Nutrition", "Body", "Mind"] as const;
type ConceiveTab = (typeof CONCEIVE_TABS)[number];

const CONCEIVE_VIDEOS: Video[] = [
  { id: "c1", category: "Fertility", title: "How to Read Your BBT Chart — Full Guide", duration: "18 min", instructor: "Dr. Kavita M.", gradient: "from-ovulation to-fertile", icon: Activity, tag: "BBT", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "how to read BBT chart basal body temperature ovulation" },
  { id: "c2", category: "Body", title: "Fertility Yoga — Open Hips & Pelvic Floor", duration: "25 min", instructor: "Sunita J.", gradient: "from-fertile to-ovulation", icon: Dumbbell, tag: "Yoga", tagColor: "bg-fertile/15 text-fertile", youtubeSearch: "fertility yoga open hips pelvic floor trying to conceive" },
  { id: "c3", category: "Nutrition", title: "Pre-Conception Nutrition — What to Eat", duration: "20 min", instructor: "Dt. Priya S.", gradient: "from-ovulation/60 to-fertile", icon: Leaf, tag: "Diet", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "pre conception diet fertility nutrition what to eat trying to conceive" },
  { id: "c4", category: "Fertility", title: "Cervical Mucus — How to Track Fertility Signs", duration: "12 min", instructor: "Dr. Ananya V.", gradient: "from-fertile-light to-fertile", icon: Sparkles, tag: "Tracking", tagColor: "bg-fertile/15 text-fertile", youtubeSearch: "cervical mucus fertility tracking natural family planning" },
  { id: "c5", category: "Mind", title: "Managing TTC Anxiety — Mindfulness for Fertility", duration: "15 min", instructor: "Dr. Meera T.", gradient: "from-pms/50 to-fertile/40", icon: Heart, tag: "Mindset", tagColor: "bg-fertile/15 text-fertile", youtubeSearch: "TTC anxiety mindfulness fertility stress management" },
  { id: "c6", category: "Nutrition", title: "Fertility Supplements — What Science Says", duration: "14 min", instructor: "Dr. Rohit G.", gradient: "from-ovulation to-fertile", icon: Flame, tag: "Supplements", tagColor: "bg-ovulation/15 text-ovulation", youtubeSearch: "fertility supplements folic acid CoQ10 vitamin D trying to conceive" },
];

const CONCEIVE_GUIDES = [
  { category: "Fertility", icon: Activity, title: "Understanding your fertile window", body: "Sperm live 5 days; an egg lives 12–24 hours. Timing intercourse in the 6-day fertile window maximises chances.", gradient: "from-ovulation/30 to-fertile/20", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Nutrition", icon: Leaf, title: "The fertility diet — what research shows", body: "Mediterranean-style eating, CoQ10, folate, and omega-3s have the strongest evidence for improving egg quality.", gradient: "from-fertile/30 to-ovulation/20", color: "text-fertile", bg: "bg-fertile/8 border-fertile/20" },
  { category: "Body", icon: Dumbbell, title: "How much exercise helps (and hurts) fertility", body: "Moderate movement improves outcomes. Excessive HIIT and very low body fat can suppress ovulation.", gradient: "from-ovulation/30 to-fertile/30", color: "text-ovulation", bg: "bg-ovulation/8 border-ovulation/20" },
  { category: "Fertility", icon: Sparkles, title: "Reading cervical mucus for ovulation", body: "Egg-white consistency signals peak fertility. Learn the 4 types and how to track them accurately each morning.", gradient: "from-fertile-light/40 to-ovulation/20", color: "text-fertile", bg: "bg-fertile/8 border-fertile/20" },
  { category: "Mind", icon: Heart, title: "Stress and fertility — the real connection", body: "Chronic cortisol disrupts the LH surge needed for ovulation. Practical tools that actually lower stress hormones.", gradient: "from-pms/30 to-fertile/20", color: "text-pms", bg: "bg-pms/8 border-pms/20" },
  { category: "Nutrition", icon: Flame, title: "Foods to avoid while trying to conceive", body: "Ultra-processed seed oils, excess caffeine, alcohol, and high-mercury fish — the evidence and the alternatives.", gradient: "from-period/20 to-pms/20", color: "text-period", bg: "bg-period/8 border-period/20" },
];

// ── Helper ───────────────────────────────────────────────────────
type AnyTab = string;

function filterByTab<T extends { category: string }>(items: T[], tab: AnyTab) {
  return tab === "All" ? items : items.filter((x) => x.category === tab);
}

// ── Main screen ──────────────────────────────────────────────────
function HealthScreen() {
  const mode = getMode();
  const cycle = getCycleInfo();
  const [activeTab, setActiveTab] = useState("All");
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);

  // Pick content set
  const tabs: readonly string[] =
    mode === "pcos" ? PCOS_TABS : mode === "conceive" ? CONCEIVE_TABS : REGULAR_TABS;
  const allVideos = mode === "pcos" ? PCOS_VIDEOS : mode === "conceive" ? CONCEIVE_VIDEOS : REGULAR_VIDEOS;
  const allGuides = mode === "pcos" ? PCOS_GUIDES : mode === "conceive" ? CONCEIVE_GUIDES : REGULAR_GUIDES;

  const videos = filterByTab(allVideos, activeTab);
  const guides = filterByTab(allGuides, activeTab);

  // Banner config per mode
  const banner = (() => {
    if (mode === "pcos") {
      const daysSince = (() => {
        if (typeof window === "undefined") return null;
        const lp = window.localStorage.getItem("petal:pcosLastPeriod") ?? window.localStorage.getItem("petal:lastPeriod");
        if (!lp) return null;
        return Math.floor((Date.now() - new Date(lp).getTime()) / 86400000);
      })();
      return {
        eyebrow: daysSince !== null ? `Day ${daysSince + 1} of cycle · PCOS mode` : "PCOS mode",
        title: "Your PCOS health hub",
        subtitle: "Evidence-based content for hormonal balance, insulin sensitivity, and cycle regulation.",
        gradient: "from-pcos to-pcos-light",
        chips: ["Insulin balance", "Hormone reset", "Anti-inflammatory"],
      };
    }
    if (mode === "conceive") {
      const fertile = cycle && cycle.day >= cycle.fertStart && cycle.day <= cycle.ovDay + 1;
      return {
        eyebrow: cycle ? `Day ${cycle.day} · ${cycle.phase}` : "Conceive mode",
        title: fertile ? "Your fertile window is open 🌿" : "Preparing your body to conceive",
        subtitle: fertile
          ? "Track cervical mucus and BBT today. This is your highest-chance window."
          : "Focus on nutrition, sleep, and cycle tracking to optimise egg quality.",
        gradient: "from-ovulation to-fertile",
        chips: ["BBT tracking", "Fertility nutrition", "Pelvic health"],
      };
    }
    // Regular
    const pb = cycle ? (REGULAR_PHASE_BANNERS[cycle.phase] ?? REGULAR_PHASE_BANNERS["Follicular"]) : null;
    return pb
      ? { eyebrow: `Day ${cycle!.day} · ${cycle!.phase}`, title: pb.title, subtitle: pb.subtitle, gradient: pb.gradient, chips: pb.focus }
      : null;
  })();

  // Tab accent color per mode
  const tabActive =
    mode === "pcos" ? "bg-pcos text-white" : mode === "conceive" ? "bg-ovulation text-white" : "bg-period text-white";

  return (
    <>
      {playingVideo && <VideoPlayerSheet video={playingVideo} onClose={() => setPlayingVideo(null)} />}

      <AppShell title="Health">
        <div className="pb-6">
          {/* Banner */}
          {banner && (
            <div className={cn("mx-5 mt-2 overflow-hidden rounded-3xl bg-gradient-to-br p-5", banner.gradient)}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{banner.eyebrow}</p>
              <h2 className="mt-1 font-display text-[22px] font-bold text-white leading-tight">{banner.title}</h2>
              <p className="mt-1 text-[12px] text-white/80 leading-relaxed">{banner.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {banner.chips.map((c) => (
                  <span key={c} className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                  activeTab === tab ? tabActive : "bg-muted text-muted-foreground hover:bg-accent",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="px-5 space-y-5">
            {/* Videos */}
            {videos.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Videos</p>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
                  {videos.map((v) => {
                    const Icon = v.icon;
                    return (
                      <div key={v.id} className="shrink-0 w-[200px] rounded-2xl overflow-hidden border border-border bg-card">
                        <div className={cn("relative h-[112px] bg-gradient-to-br flex items-center justify-center", v.gradient)}>
                          <button
                            onClick={() => setPlayingVideo(v)}
                            aria-label={`Play ${v.title}`}
                            className="grid size-12 place-items-center rounded-full bg-white/25 backdrop-blur-sm border border-white/30 hover:bg-white/35 active:scale-95"
                          >
                            <Play className="size-5 text-white fill-white ml-0.5" strokeWidth={0} />
                          </button>
                          <span className={cn("absolute bottom-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-white/90", v.tagColor)}>
                            {v.tag}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="text-[12px] font-semibold text-foreground leading-snug line-clamp-2">{v.title}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground">{v.instructor}</span>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="size-3" strokeWidth={2} />{v.duration}
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
            {guides.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Guides</p>
                <div className="space-y-3">
                  {guides.map((g) => {
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.title}
                        className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left hover:bg-accent/40 active:scale-[0.99]"
                      >
                        <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br", g.gradient)}>
                          <Icon className="size-6 text-white" strokeWidth={2} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", g.color)}>{g.category}</span>
                          <span className="block text-[13px] font-semibold text-foreground leading-snug mt-0.5">{g.title}</span>
                          <span className="block text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">{g.body}</span>
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
