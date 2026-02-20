"use client";

import { m } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { LunarLogo } from "@/components/ui/lunar-logo";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useCallback, memo } from "react";

interface HeaderProps {
    onNavigate?: (section: string) => void;
}

export const Header = memo(function Header({ onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const clockRef = useRef<HTMLSpanElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize audio volume to 20%
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  // Dedicated clock tick — updates DOM directly to avoid re-renders
  useEffect(() => {
    const tick = () => {
      if (clockRef.current) {
        const now = new Date();
        const h = String(now.getUTCHours()).padStart(2, "0");
        const m = String(now.getUTCMinutes()).padStart(2, "0");
        const s = String(now.getUTCSeconds()).padStart(2, "0");
        clockRef.current.textContent = `${h}:${m}:${s}`;
      }
    };
    tick(); // initial
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay — user hasn't interacted yet
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleNav = (section: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (onNavigate) onNavigate(section);
  };

  return (
    <m.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500",
        isScrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-3"
          : "bg-black/20 backdrop-blur-xl border-b border-white/10 py-6"
      )}
      style={{ willChange: "transform" }}
    >
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />

      {/* Logo, Name & Clock */}
      <div className="flex items-center gap-4">
        <a href="#" onClick={(e) => handleNav('home', e)} className="flex items-center gap-3 cursor-pointer group">
          <LunarLogo className="w-8 h-8 md:w-10 md:h-10" />
          <span
            className="text-lg md:text-xl font-semibold text-white animate-breathe-glow"
            style={{
              letterSpacing: "-0.06em",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
            }}
          >
            LUNAR
          </span>
        </a>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-white/10 ml-1" />

        {/* Digital World Clock */}
        <div className="hidden md:flex items-center gap-2 ml-1">
          <span
            ref={clockRef}
            style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            className="text-xs md:text-sm text-white/40 tabular-nums tracking-wider"
          >
            00:00:00
          </span>
          <span
            style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            className="text-[10px] text-white/20 tracking-widest uppercase font-medium"
          >
            UTC
          </span>
        </div>

        {/* Separator */}
        <div className="hidden md:block w-px h-5 bg-white/10" />

        {/* Sound Toggle */}
        <m.button
          onClick={toggleAudio}
          aria-label={isPlaying ? "Mute background audio" : "Play background audio"}
          animate={isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={isPlaying ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
          className={cn(
            "hidden md:flex items-center justify-center p-2 rounded-full transition-all duration-300 hover:bg-white/5",
            isPlaying ? "text-lunar-silver" : "text-white/40"
          )}
          title={isPlaying ? "Sound On" : "Sound Off"}
          style={{ willChange: "transform" }}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4" style={{ filter: "drop-shadow(0 0 6px rgba(225,225,225,0.3))" }} />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </m.button>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
          <Link href="/lunarai" className="text-xs font-medium tracking-[0.2em] text-gray-400 hover:text-white transition-colors uppercase relative group">
            CHAT
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/#features" className="text-xs font-medium tracking-[0.2em] text-gray-400 hover:text-white transition-colors uppercase relative group">
            FEATURES
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/#about" className="text-xs font-medium tracking-[0.2em] text-gray-400 hover:text-white transition-colors uppercase relative group">
            ABOUT
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
          </Link>
      </nav>

      {/* Mobile Menu Placeholder */}
      <div className="w-8 md:hidden" /> 
    </m.header>
  );
});
