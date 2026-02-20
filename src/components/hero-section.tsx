"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Simulated telemetry data for the space-science ticker
const TELEMETRY_DATA = [
  "Lunar Phase: Waning Gibbous",
  "Earth–Mars Latency: 4m 22s",
  "ISS Altitude: 408 km",
  "Voyager 1 Dist: 24.5B km",
  "Solar Wind: 412 km/s",
  "CMB Temp: 2.725 K",
  "Hubble Constant: 67.4 km/s/Mpc",
  "Neptune Orbital V: 5.43 km/s",
];

const tickerContent = TELEMETRY_DATA.join("   ·   ") + "   ·   ";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative z-10 font-sans">
      <m.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        <span className="text-xs md:text-sm tracking-[0.4em] text-white/90 uppercase font-medium mb-6 block drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          LUNAR
        </span>
        <m.div
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 overflow-visible pb-2"
            style={{ 
              letterSpacing: '-0.05em', 
              lineHeight: '1.5',
              paddingBottom: '0.2em',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
            }}
          >
            Frontier Intelligence <br /> for the Deep Space Era
          </h1>
        </m.div>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed font-light tracking-wide">
          A specialized intelligence layer for astrophysics, orbital mechanics, 
          <br className="hidden md:block" />
          and planetary exploration. Powered by aayush.aē.
        </p>
      </m.div>

      {/* Telemetry Ticker — Infinite Loop */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.0 }}
        className="w-full max-w-xl mx-auto mb-10 overflow-hidden relative"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="font-mono text-[10px] md:text-xs text-white/30 tracking-widest uppercase">
            {tickerContent}
          </span>
          <span className="font-mono text-[10px] md:text-xs text-white/30 tracking-widest uppercase">
            {tickerContent}
          </span>
        </div>
      </m.div>

      <Link href="/lunarai" passHref>
        <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-10 py-5 rounded-full overflow-hidden transition-all duration-500 cursor-pointer inline-flex items-center justify-center"
            style={{
              background: "linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.4)",
              willChange: "transform, opacity",
            }}
        >
            {/* Lunar Flare Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
            </div>

            <span className="relative z-10 flex items-center gap-3 font-display tracking-[0.2em] text-xs text-white/90 group-hover:text-white transition-colors">
                START COMMUNICATE
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
            
            {/* Inner Glow */}
            <div className="absolute inset-0 rounded-full border border-white/5 group-hover:border-white/20 transition-colors duration-500" />
        </m.div>
      </Link>
    </section>
  );
}
