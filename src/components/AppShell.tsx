import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useRouter } from "@tanstack/react-router";
import { BottomNav } from "./BottomNav";
import { ProfileIcon } from "./ProfileIcon";

interface AppShellProps {
  title?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
  showBack?: boolean;
}

export function AppShell({ title = "Your current cycle", children, rightSlot, leftSlot, showBack }: AppShellProps) {
  const router = useRouter();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        {/* Left: ProfileIcon by default; back arrow when showBack; custom via leftSlot */}
        {leftSlot ?? (showBack ? (
          <button
            aria-label="Back"
            onClick={() => router.history.back()}
            className="text-fertile transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="size-6" strokeWidth={2.25} />
          </button>
        ) : (
          <ProfileIcon />
        ))}
        <h1 className="font-display text-[17px] font-medium tracking-tight text-foreground">
          {title}
        </h1>
        {/* Right: custom slot or empty spacer to keep title centred */}
        {rightSlot ?? <span className="size-9" aria-hidden />}
      </header>
      <main className="flex-1 pb-32">{children}</main>
      <BottomNav />
    </div>
  );
}
