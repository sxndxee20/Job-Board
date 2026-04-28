import type { ReactNode } from "react";
import { BottomNavBar } from "@/components/shared/BottomNavBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-lg pb-24 sm:max-w-2xl lg:max-w-4xl">
        {children}
      </div>
      <BottomNavBar />
    </div>
  );
}
