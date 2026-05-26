import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Clock, BookOpen, Flame, Leaf, Moon, Apple, Heart, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Petal" },
      { name: "description", content: "Cycle science, wellness tips, and expert guides." },
    ],
  }),
  component: LearnScreen,
});

const CATEGORIES = ["All", "Hormones", "Nutrition", "Wellbeing", "Sleep", "Fertility"];

const ARTICLES = [
  {
    tag: "Hormones",
    title: "The four phases of your cycle, explained",
    excerpt: "A clear, science-backed guide to what your body does every single day.",
    minutes: 6,
    gradient: "from-period via-period-light to-pms",
    icon: Flame,
  },
  {
    tag: "Nutrition",
    title: "Iron, magnesium and the foods that help",
    excerpt: "Why micronutrients matter more during menstruation than any other time.",
    minutes: 4,
    gradient: "from-ovulation to-fertile",
    icon: Apple,
  },
  {
    tag: "Wellbeing",
    title: "How exercise changes through your cycle",
    excerpt: "Match your workout intensity to each phase and feel the difference.",
    minutes: 5,
    gradient: "from-fertile-light to-fertile",
    icon: Zap,
  },
  {
    tag: "Sleep",
    title: "Why your sleep worsens before your period",
    excerpt: "Progesterone, body temperature, and what you can do about it tonight.",
    minutes: 4,
    gradient: "from-pms to-period-light",
    icon: Moon,
  },
  {
    tag: "Fertility",
    title: "Understanding your fertile window",
    excerpt: "Ovulation signs, basal body temperature, and cervical mucus decoded.",
    minutes: 7,
    gradient: "from-ovulation via-fertile to-fertile-light",
    icon: Leaf,
  },
  {
    tag: "Hormones",
    title: "What's actually happening in your luteal phase",
    excerpt: "Progesterone peaks, mood dips, and why PMS isn't inevitable.",
    minutes: 5,
    gradient: "from-period-light to-pms",
    icon: Heart,
  },
];

function LearnScreen() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.tag === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <AppShell title="Learn">
      <div className="pb-6">

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 pt-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors",
                activeCategory === cat
                  ? "bg-period text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="px-5 mt-4 space-y-4">

          {/* Featured card */}
          {featured && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Featured</p>
              <button className="w-full overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:shadow-md active:scale-[0.99]">
                <div className={cn("h-36 bg-gradient-to-br flex items-end p-4", featured.gradient)}>
                  <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white uppercase tracking-wide">
                    {featured.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-[18px] font-semibold leading-snug text-foreground">
                    {featured.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                  <div className="mt-3 flex items-center gap-1 text-[12px] text-muted-foreground">
                    <Clock className="size-3.5" strokeWidth={2} />
                    <span>{featured.minutes} min read</span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Article list */}
          {rest.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {activeCategory === "All" ? "More articles" : activeCategory}
              </p>
              <ul className="space-y-3">
                {rest.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.title}>
                      <button className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/40 active:scale-[0.99]">
                        <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br", a.gradient)}>
                          <Icon className="size-6 text-white" strokeWidth={2} />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {a.tag}
                          </span>
                          <span className="block font-display text-[14px] font-semibold leading-snug text-foreground mt-0.5">
                            {a.title}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                            <Clock className="size-3" strokeWidth={2} />
                            {a.minutes} min read
                          </span>
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <BookOpen className="size-10 text-muted-foreground/40" strokeWidth={1.5} />
              <p className="text-[14px] text-muted-foreground">No articles in this category yet.</p>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
