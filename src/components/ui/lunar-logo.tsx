"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

interface LunarLogoProps {
  className?: string;
  isThinking?: boolean;
}

export function LunarLogo({ className, isThinking = false }: LunarLogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <m.div
        animate={
          isThinking
            ? {
                filter: [
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))",
                  "drop-shadow(0 0 20px rgba(255, 255, 255, 0.4))",
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))",
                ],
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10"
        style={{ willChange: "transform, opacity, filter" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo with filter effects */}
        <img
          src="/logo.svg"
          alt="LUNAR Logo"
          className="w-full h-full object-contain"
          style={{
            filter: "brightness(1.2) contrast(1.1)",
          }}
        />
      </m.div>
      
      {/* Background Glow for Pulse */}
      {isThinking && (
        <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-white/10 blur-xl rounded-full"
            style={{ willChange: "transform, opacity" }}
        />
      )}
    </div>
  );
}
