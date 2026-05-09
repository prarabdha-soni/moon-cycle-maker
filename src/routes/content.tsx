import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "Content — Petal" },
      { name: "description", content: "Read science-backed articles about your cycle, hormones and health." },
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
    <AppShell title="Content">
      <div className="space-y-6 px-5 pt-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-medium">Featured</h2>
          <article className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="h-36 bg-gradient-to-br from-period via-period-light to-pms" />
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-fertile">
                Cycle science
              </p>
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
          <h2 className="mb-3 font-display text-lg font-medium">For you</h2>
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.title}>
                <button className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-accent/40">
                  <span
                    className={`size-16 shrink-0 rounded-xl bg-gradient-to-br ${a.color}`}
                  />
                  <span className="flex-1">
                    <span className="text-[11px] uppercase tracking-wider text-fertile">
                      {a.tag}
                    </span>
                    <span className="block font-display text-[15px] font-medium leading-snug text-foreground">
                      {a.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {a.minutes} min read
                    </span>
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
