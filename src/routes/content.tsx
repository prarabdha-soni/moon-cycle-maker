import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, ShoppingBag, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import shetrivesCup from "@/assets/shetrives-cup.png";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Product — SheThrives" },
      {
        name: "description",
        content: "Shop curated period care products handpicked for your cycle.",
      },
    ],
  }),
  component: ContentScreen,
});

const articles = [
  {
    tag: "Hormones",
    title: "What's actually happening in your luteal phase",
    minutes: 5,
    color: "from-period-light to-period",
  },
  {
    tag: "Wellbeing",
    title: "How exercise changes through your cycle",
    minutes: 4,
    color: "from-fertile-light to-fertile",
  },
  {
    tag: "Sleep",
    title: "Why your sleep gets worse before your period",
    minutes: 6,
    color: "from-pms to-period-light",
  },
  {
    tag: "Nutrition",
    title: "Iron, magnesium and the foods that help",
    minutes: 3,
    color: "from-ovulation to-fertile",
  },
];

function ContentScreen() {
  return (
    <AppShell title="Product">
      <div className="space-y-6 px-5 pt-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-medium">Featured</h2>
          <article className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="h-36 bg-gradient-to-br from-period via-period-light to-pms" />
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-fertile">Cycle science</p>
              <h3 className="mt-1 font-display text-xl font-medium leading-tight">
                The four phases of your menstrual cycle, explained
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                A clear, no-nonsense guide to what your body is doing every day.
              </p>
            </div>
          </article>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-lg font-medium">Shop</h2>
            <span className="text-[11px] uppercase tracking-wider text-fertile">
              SheThrives picks
            </span>
          </div>
          <article className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="relative grid place-items-center bg-gradient-to-br from-fertile-light/40 via-period-light/30 to-pms/30 px-4 pt-5">
              <span className="absolute left-4 top-4 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-fertile backdrop-blur">
                New
              </span>
              <img
                src={shetrivesCup}
                alt="SheTrives soft menstrual cup, size regular in desert blush"
                className="h-48 w-auto object-contain drop-shadow-md"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-fertile">Period care</p>
              <h3 className="mt-1 font-display text-xl font-medium leading-tight">
                SheTrives Soft Menstrual Cup
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Size Regular · Desert Blush · Wear up to 12 hours
              </p>
              <ul className="mt-3 space-y-1.5">
                {["Medical-grade soft silicone", "Reusable for up to 5 years", "Made in India"].map(
                  (f) => (
                    <li key={f} className="flex items-center gap-2 text-[13px] text-foreground">
                      <Check className="size-3.5 text-fertile" strokeWidth={3} />
                      {f}
                    </li>
                  ),
                )}
              </ul>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl font-medium text-foreground">₹499</p>
                  <p className="text-[11px] text-muted-foreground line-through">₹799</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90">
                  <ShoppingBag className="size-4" />
                  Add to bag
                </button>
              </div>
            </div>
          </article>
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-medium">For you</h2>
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.title}>
                <button className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/40">
                  <span className={`size-16 shrink-0 rounded-xl bg-gradient-to-br ${a.color}`} />
                  <span className="flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-fertile">
                      {a.tag}
                    </span>
                    <span className="block font-display text-[15px] font-medium leading-snug text-foreground">
                      {a.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.minutes} min read</span>
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
