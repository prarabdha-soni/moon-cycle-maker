import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  noNav?: boolean;
  /* legacy props — accepted but unused */
  title?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
}

export function AppShell({ children, noNav }: AppShellProps) {
  return (
    <div
      className="mx-auto flex min-h-screen max-w-md flex-col"
      style={{ background: "linear-gradient(180deg,#FCF5F2 0%,#FBF3F0 100%)" }}
    >
      <main className="flex-1" style={{ paddingBottom: noNav ? 0 : 88 }}>
        {children}
      </main>
      {!noNav && <BottomNav />}
    </div>
  );
}
