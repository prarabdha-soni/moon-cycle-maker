import { useState, useEffect } from "react";
import { User, Calendar, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="grid size-9 place-items-center rounded-full bg-pms/20 text-pms transition-colors hover:bg-pms/30"
          aria-label="Open profile settings"
        >
          <span className="text-[14px] font-semibold">{getInitial()}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Enter your name"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastPeriod">Last Period Date (LMP)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="lastPeriod"
                type="date"
                value={profile.lastPeriod}
                onChange={(e) => setProfile({ ...profile, lastPeriod: e.target.value })}
                className="pl-9"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              First day of your last menstrual period
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
            <div className="relative">
              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="cycleLength"
                type="number"
                min="21"
                max="35"
                value={profile.cycleLength}
                onChange={(e) => setProfile({ ...profile, cycleLength: parseInt(e.target.value, 10) || 28 })}
                className="pl-9"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Typically between 21-35 days
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tracking Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={profile.mode === "conceive" ? "default" : "outline"}
                onClick={() => setProfile({ ...profile, mode: "conceive" })}
                className={profile.mode === "conceive" ? "bg-pms text-primary-foreground hover:bg-pms/90" : ""}
              >
                Conceive
              </Button>
              <Button
                type="button"
                variant={profile.mode === "pregnant" ? "default" : "outline"}
                onClick={() => setProfile({ ...profile, mode: "pregnant" })}
                className={profile.mode === "pregnant" ? "bg-pms text-primary-foreground hover:bg-pms/90" : ""}
              >
                Pregnant
              </Button>
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-pms text-primary-foreground hover:bg-pms/90"
          >
            Save Changes
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Changes will be saved to your device and applied immediately.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
