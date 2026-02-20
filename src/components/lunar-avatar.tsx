"use client";

import { m } from "framer-motion";

interface LunarAvatarProps {
  isProcessing?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LunarAvatar({ isProcessing = false, size = "md" }: LunarAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-32 h-32",
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Outer Glow Ring */}
      <m.div
        className="absolute inset-0 rounded-full border border-white/20"
        animate={{
          scale: isProcessing ? [1, 1.2, 1] : 1,
          opacity: isProcessing ? [0.5, 0.2, 0.5] : 0.5,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Core Moon */}
      <m.div
        className="relative z-10 rounded-full bg-gradient-to-br from-white to-gray-400 shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
        style={{ width: "80%", height: "80%" }}
        animate={{
          boxShadow: isProcessing 
            ? ["0 0 15px rgba(255,255,255,0.5)", "0 0 30px rgba(138,43,226,0.8)", "0 0 15px rgba(255,255,255,0.5)"] 
            : "0 0 15px rgba(255,255,255,0.5)",
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Nebula Mist Effect (Optional, for larger sizes) */}
      {size === 'lg' && (
         <m.div
         className="absolute inset-[-20%] rounded-full bg-nebula-violet/20 blur-xl"
         animate={{
           rotate: 360,
           scale: [1, 1.1, 1],
         }}
         transition={{
           duration: 10,
           repeat: Infinity,
           ease: "linear",
         }}
       />
      )}
    </div>
  );
}
