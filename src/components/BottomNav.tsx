import { Link, useLocation } from "@tanstack/react-router";
import { Calendar, BarChart3, ShoppingBag, CircleDot, Pill } from "lucide-react";

type Mode = "regular" | "conceive" | "pregnant";

function safeGetMode(): Mode {
  if (typeof window === "undefined") return "regular";
  const raw = window.localStorage.getItem("petal:mode");
  if (raw === "conceive" || raw === "pregnant" || raw === "regular") return raw;
  return "regular";
}

export function BottomNav() {
  const { pathname } = useLocation();
  const mode = safeGetMode();
  const cycleTo = mode === "conceive" ? "/conceive" : mode === "pregnant" ? "/pregnant" : "/";

  const items = [
    { to: cycleTo, label: "Cycle", icon: CircleDot, primary: false },
    { to: "/med", label: "Med", icon: Pill, primary: false },
    { to: "/calendar", label: "Calendar", icon: Calendar, primary: false },
    { to: "/analysis", label: "Analysis", icon: BarChart3, primary: false },
    { to: "/content", label: "Product", icon: ShoppingBag, primary: false },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-md items-end justify-between px-2 pb-3 pt-2">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <li key={to} className="-mt-6">
                <Link
                  to={to}
                  className="flex flex-col items-center gap-1"
                  aria-label={label}
                >
                  <span className="grid size-14 place-items-center rounded-full bg-fertile text-primary-foreground shadow-lg shadow-fertile/40 ring-4 ring-background">
                    <Icon className="size-6" strokeWidth={2.5} />
                  </span>
                  <span className="text-[11px] font-medium text-foreground">
                    {label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-1"
                aria-label={label}
              >
                <Icon
                  className={`size-5 ${active ? "text-fertile" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[11px] ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
