import { Link, useLocation } from "@tanstack/react-router";
import { House, Bot, HeartPulse, ShoppingBag } from "lucide-react";

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
    { to: cycleTo, label: "Home", icon: House },
    { to: "/coach", label: "AI Coach", icon: Bot },
    { to: "/health", label: "Health", icon: HeartPulse },
    { to: "/shop", label: "Shop", icon: ShoppingBag },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <ul className="mx-auto flex max-w-md items-end justify-between px-2 pb-3 pt-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (label === "Home" && pathname === cycleTo);
          return (
            <li key={label} className="flex-1">
              <Link to={to} className="flex flex-col items-center gap-1 py-1" aria-label={label}>
                <Icon
                  className={`size-5 ${active ? "text-period" : "text-muted-foreground"}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />
                <span
                  className={`text-[11px] ${active ? "font-semibold text-period" : "text-muted-foreground"}`}
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
