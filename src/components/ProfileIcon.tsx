import { useNavigate } from "@tanstack/react-router";

export interface UserProfile {
  name: string;
  lastPeriod: string;
  cycleLength: number;
  mode: "regular" | "conceive" | "pregnant";
}

interface ProfileIconProps {
  /** Force a light appearance when rendered over a dark/coloured hero (e.g. pregnant screen). */
  variant?: "default" | "light";
  onProfileUpdate?: (profile: Partial<UserProfile>) => void;
}

/** Custom event dispatched after a profile save so same-tab screens can refresh. */
export const PROFILE_UPDATE_EVENT = "petal:profileUpdate";

export function ProfileIcon({ variant = "default" }: ProfileIconProps) {
  const navigate = useNavigate();

  const name = typeof window !== "undefined" ? window.localStorage.getItem("petal:name") || "" : "";
  const initial = name.charAt(0).toUpperCase() || "P";

  const btnClass =
    variant === "light"
      ? "grid size-9 place-items-center rounded-full bg-white/25 text-white transition-colors hover:bg-white/35"
      : "grid size-9 place-items-center rounded-full bg-pms/15 text-pms transition-colors hover:bg-pms/25";

  return (
    <button
      className={btnClass}
      aria-label="Open profile settings"
      onClick={() => navigate({ to: "/profile" })}
    >
      <span className="text-[14px] font-semibold">{initial}</span>
    </button>
  );
}
