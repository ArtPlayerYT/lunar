import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-2xl p-6 transition-all duration-300",
        glow && "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
