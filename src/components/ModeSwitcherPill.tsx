import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown } from "lucide-react";

type Mode = "regular" | "conceive" | "pregnant" | "pcos";

function safeGetMode(): Mode {
  if (typeof window === "undefined") return "regular";
  const raw = window.localStorage.getItem("petal:mode");
  if (raw === "conceive" || raw === "pregnant" || raw === "regular" || raw === "pcos") return raw;
  return "regular";
}

export function ModeSwitcherPill({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(() => safeGetMode());

  useEffect(() => {
    // Keep it in sync if other screens update localStorage.
    const onStorage = () => setMode(safeGetMode());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const ui = useMemo(() => {
    if (mode === "conceive") {
      return {
        pill: "bg-ovulation/20 text-ovulation",
        check: "text-ovulation",
        label: "Conceive",
      };
    }
    if (mode === "pregnant") {
      return {
        pill: "bg-pms/20 text-pms",
        check: "text-pms",
        label: "Pregnant",
      };
    }
    if (mode === "pcos") {
      return {
        pill: "bg-pcos/20 text-pcos",
        check: "text-pcos",
        label: "PCOS",
      };
    }
    return {
      pill: "bg-fertile-light/30 text-fertile",
      check: "text-fertile",
      label: "Regular",
    };
  }, [mode]);

  const switchTo = (next: Mode) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:mode", next);
    }
    setMode(next);
    setOpen(false);

    if (next === "regular") {
      navigate({ to: "/", replace: true });
      return;
    }
    if (next === "conceive") {
      navigate({ to: "/conceive", replace: true });
      return;
    }
    if (next === "pcos") {
      navigate({ to: "/pcos", replace: true });
      return;
    }

    const lastPeriod =
      typeof window !== "undefined" ? window.localStorage.getItem("petal:lastPeriod") : null;
    if (!lastPeriod) {
      navigate({ to: "/welcome-last-period", replace: true });
      return;
    }
    navigate({ to: "/pregnant", replace: true });
  };

  return (
    <div
      className={`relative mx-auto mt-2 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[13px] ${ui.pill} ${className ?? ""}`}
    >
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 font-semibold">
        <span className="text-muted-foreground">Mode:</span>
        <span>{ui.label}</span>
        <ChevronDown className="size-3.5" strokeWidth={2.5} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {(
            [
              { id: "regular", label: "Regular Tracking", check: "text-fertile" },
              { id: "pcos", label: "PCOS Mode", check: "text-pcos" },
              { id: "conceive", label: "Conceive Mode", check: "text-ovulation" },
              { id: "pregnant", label: "Pregnant Mode", check: "text-pms" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              onClick={() => switchTo(opt.id)}
              className={`flex w-full items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-accent ${
                mode === opt.id ? "bg-accent" : ""
              }`}
            >
              <span>{opt.label}</span>
              {mode === opt.id && <Check className={`size-4 ${opt.check}`} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
