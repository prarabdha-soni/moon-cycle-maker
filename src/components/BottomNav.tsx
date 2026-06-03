import { Link, useLocation } from "@tanstack/react-router";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#E26D8A" : "#A89AA0"} strokeWidth={active ? 2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 10.5 12 4l8.5 6.5" />
      <path d="M5.5 9.5V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}
function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#E26D8A" : "#A89AA0"} strokeWidth={active ? 2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5.5" width="16" height="15" rx="3" />
      <path d="M4 10h16M8 3.5v4M16 3.5v4" />
    </svg>
  );
}
function SparkleIcon({ active }: { active: boolean }) {
  const c = active ? "#E26D8A" : "#A89AA0";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#E26D8A" : "none"}
      stroke={c} strokeWidth={active ? 2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l1.4 4.6L18 10l-4.6 1.4L12 16l-1.4-4.6L6 10l4.6-1.4Z" />
      <path d="M18 15l.6 1.8L20.5 17.5l-1.9.6L18 20l-.6-1.9-1.9-.6 1.9-.7Z" stroke="none" fill={c} />
    </svg>
  );
}
function LearnIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#E26D8A" : "#A89AA0"} strokeWidth={active ? 2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4.5h9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H5Z" />
      <path d="M5 4.5v13H4" />
      <path d="M9 9h5M9 12h4" />
    </svg>
  );
}
function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#E26D8A" : "#A89AA0"} strokeWidth={active ? 2 : 1.7}
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

const TABS = [
  { to: "/", label: "Home", Icon: HomeIcon },
  { to: "/calendar", label: "Calendar", Icon: CalendarIcon },
  { to: "/coach", label: "Coach", Icon: SparkleIcon },
  { to: "/learn", label: "Learn", Icon: LearnIcon },
  { to: "/shop", label: "Shop", Icon: ShopIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        borderTop: "1px solid #F6ECE8",
        boxShadow: "0 -6px 24px rgba(150,80,100,.06)",
      }}
    >
      <ul className="mx-auto flex max-w-md items-end justify-around px-2 pb-safe pt-2"
        style={{ paddingBottom: "max(26px, env(safe-area-inset-bottom))" }}>
        {TABS.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <li key={label} className="flex-1">
              <Link
                to={to}
                className="flex flex-col items-center gap-1 py-1 relative"
                aria-label={label}
              >
                {active && (
                  <span
                    className="absolute -top-2.5 w-7 rounded-full"
                    style={{ height: "3.5px", background: "#E26D8A" }}
                  />
                )}
                <Icon active={active} />
                <span
                  className="text-[10.5px] font-semibold"
                  style={{ color: active ? "#E26D8A" : "#A89AA0", fontWeight: active ? 700 : 600 }}
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
