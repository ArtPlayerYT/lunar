"use client";

import { m } from "framer-motion";

export function Atmosphere() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Starfield Overlay */}
      <div className="absolute inset-0 bg-stars z-[1]" />
      
      {/* Deep Space Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-true-black to-black opacity-80" />

      {/* Aurora / Nebula Effects - subtle moving gradients */}
      <m.div 
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-nebula-violet/20 blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ willChange: "transform, opacity" }}
      />

       <m.div 
        className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-supernova-blue/10 blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
           x: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform, opacity" }}
      />
    </div>
  );
}
