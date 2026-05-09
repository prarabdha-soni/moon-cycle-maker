import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  title?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function AppShell({ title = "Your current cycle", children, rightSlot }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <span className="size-6" aria-hidden />
        <h1 className="font-display text-[17px] font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {rightSlot ?? (
          <button
            aria-label="Menu"
            className="text-fertile transition-opacity hover:opacity-70"
          >
            <Menu className="size-6" strokeWidth={2.25} />
          </button>
        )}
      </header>
      <main className="flex-1 pb-32">{children}</main>
      <BottomNav />
    </div>
  );
}
