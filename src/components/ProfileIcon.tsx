import { useState, useEffect } from "react";
import { User, Calendar, Settings, X } from "lucide-react";

export interface UserProfile {
  name: string;
  lastPeriod: string;
  cycleLength: number;
  mode: "conceive" | "pregnant";
}

interface ProfileIconProps {
  onProfileUpdate?: (profile: Partial<UserProfile>) => void;
}

export function ProfileIcon({ onProfileUpdate }: ProfileIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    lastPeriod: "",
    cycleLength: 28,
    mode: "conceive",
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = window.localStorage.getItem("petal:name") || "User";
      const storedLastPeriod = window.localStorage.getItem("petal:lastPeriod") || "";
      const storedCycleLength = window.localStorage.getItem("petal:cycleLength") || "28";
      const storedMode = (window.localStorage.getItem("petal:mode") as "conceive" | "pregnant") || "conceive";
      
      setProfile({
        name: storedName,
        lastPeriod: storedLastPeriod,
        cycleLength: parseInt(storedCycleLength, 10),
        mode: storedMode,
      });
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("petal:name", profile.name);
      window.localStorage.setItem("petal:lastPeriod", profile.lastPeriod);
      window.localStorage.setItem("petal:cycleLength", profile.cycleLength.toString());
      window.localStorage.setItem("petal:mode", profile.mode);
      
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
    }
    setIsOpen(false);
  };

  const getInitial = () => profile.name.charAt(0).toUpperCase() || "U";

  return (
    <>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="grid size-9 place-items-center rounded-full bg-pms/20 text-pms transition-colors hover:bg-pms/30"
        aria-label="Open profile settings"
      >
        <span className="text-[14px] font-semibold">{getInitial()}</span>
      </button>

      {/* Profile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div 
            className="w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="profile-modal-title" className="font-display text-[20px] font-medium text-foreground">
                Profile Settings
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="grid size-9 place-items-center rounded-full bg-accent text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="size-5" strokeWidth={2.25} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground outline-none focus:border-pms focus:ring-2 focus:ring-pms/20 transition-all"
                  />
                </div>
              </div>

              {/* Last Period Date */}
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-2">
                  Last Period Date (LMP)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={profile.lastPeriod}
                    onChange={(e) => setProfile({ ...profile, lastPeriod: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground outline-none focus:border-pms focus:ring-2 focus:ring-pms/20 transition-all"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  First day of your last menstrual period
                </p>
              </div>

              {/* Cycle Length */}
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-2">
                  Average Cycle Length (days)
                </label>
                <div className="relative">
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="number"
                    min="21"
                    max="35"
                    value={profile.cycleLength}
                    onChange={(e) => setProfile({ ...profile, cycleLength: parseInt(e.target.value, 10) || 28 })}
                    className="w-full rounded-2xl border border-border bg-card py-3.5 pl-12 pr-4 text-foreground outline-none focus:border-pms focus:ring-2 focus:ring-pms/20 transition-all"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Typically between 21-35 days
                </p>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-2">
                  Tracking Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setProfile({ ...profile, mode: "conceive" })}
                    className={`rounded-2xl border px-4 py-3 text-[13px] font-medium transition-all ${
                      profile.mode === "conceive"
                        ? "border-pms bg-pms/10 text-pms"
                        : "border-border bg-card text-muted-foreground hover:border-pms/50"
                    }`}
                  >
                    Conceive
                  </button>
                  <button
                    onClick={() => setProfile({ ...profile, mode: "pregnant" })}
                    className={`rounded-2xl border px-4 py-3 text-[13px] font-medium transition-all ${
                      profile.mode === "pregnant"
                        ? "border-pms bg-pms/10 text-pms"
                        : "border-border bg-card text-muted-foreground hover:border-pms/50"
                    }`}
                  >
                    Pregnant
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full mt-4 rounded-full bg-pms py-4 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-pms/30 transition-all active:scale-[0.98]"
              >
                Save Changes
              </button>

              {/* Info Note */}
              <p className="text-[11px] text-center text-muted-foreground">
                Changes will be saved to your device and applied immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
