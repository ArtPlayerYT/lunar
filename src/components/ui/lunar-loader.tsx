"use client";

import { cn } from "@/lib/utils";
import { m } from "framer-motion";

export function LunarLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center w-8 h-8", className)}>
      {/* Outer Ping Ring */}
      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white/10" />

      {/* Core Loader */}
      <m.div
        className="relative w-3 h-3 rounded-full bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.4)] backdrop-blur-sm"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Rotating Gradient Border Simulation */}
        <m.div
          className="absolute inset-[-2px] rounded-full opacity-50 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
        />
      </m.div>
    </div>
  );
}
