"use client";

import { m } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { LunarLogo } from "@/components/ui/lunar-logo";

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative z-10 px-4 md:px-6 max-w-6xl mx-auto font-sans">

      {/* Hero Bio */}
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="mb-16 md:mb-24"
      >
        <p
          className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase mb-6"
        >
          About
        </p>
        <h2
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-bold text-white max-w-5xl pb-4"
          style={{
            letterSpacing: "-0.06em",
            lineHeight: "1.1",
            textShadow: "0 0 40px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          Engineer. Creator.
          <br />
          <span className="text-white/40">Space Enthusiast.</span>
        </h2>
        <p
          className="text-base md:text-lg text-neutral-400 max-w-2xl mt-6 font-light pb-4"
          style={{
            lineHeight: "1.7",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}
        >
          Software Engineer & Multimedia Strategist forged at{" "}
          <span className="text-white font-medium">NIT Jalandhar</span>.
          Grounded in C++, DSA, and system architecture — with a creative edge
          sharpened through the{" "}
          <span className="text-white font-medium">Videography Club</span>,
          where cinematography meets code. I build products that bridge deep
          engineering with compelling human experiences.
        </p>
      </m.div>

      {/* Bento Grid — 2 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

        {/* Card 1: The Engineer */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-xl p-6 md:p-10 flex flex-col justify-between"
          style={{ minHeight: "360px" }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Github
                  className="w-10 h-10 md:w-12 md:h-12 relative z-10 text-white/80"
                  style={{ filter: "drop-shadow(0 0 6px rgba(225,225,225,0.15))" }}
                />
              </div>
            </div>
            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-4 pb-1"
              style={{
                letterSpacing: "-0.04em",
                lineHeight: "1.2",
                textShadow: "0 1px 6px rgba(0,0,0,0.5)",
              }}
            >
              The Engineer
            </h3>
            <p
              className="text-neutral-400 font-light max-w-md pb-4"
              style={{ lineHeight: "1.7", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              Core foundation in <span className="text-white/90 font-medium">C++ & Data Structures</span>,
              scaled into real-world systems — banking architectures, blockchain networks,
              and full-stack applications built with{" "}
              <span className="text-white/90 font-medium">Next.js</span>,{" "}
              <span className="text-white/90 font-medium">TypeScript</span>, and{" "}
              <span className="text-white/90 font-medium">Firebase</span>.
            </p>
          </div>

          {/* Tech pills */}
          <div className="flex gap-2 flex-wrap mt-6 relative z-10">
            {["C++ / DSA", "Next.js", "TypeScript", "Firebase", "Blockchain"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-neutral-400 font-mono tracking-wide"
                >
                  {tech}
                </span>
              )
            )}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/ArtPlayerYT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 mt-6 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/15 text-white/80 hover:text-white transition-all duration-300 group/btn relative z-10 self-start"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="text-xs font-medium tracking-wide">Explore Repositories</span>
            <ExternalLink className="w-3 h-3 text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-300" />
          </a>
        </m.div>

        {/* Card 2: LUNAR AI Spotlight */}
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/[0.08] backdrop-blur-xl p-6 md:p-10 flex flex-col justify-between"
          style={{
            minHeight: "360px",
            background: "linear-gradient(135deg, rgba(10,10,11,0.9) 0%, rgba(46,2,73,0.15) 50%, rgba(10,10,11,0.9) 100%)",
          }}
        >
          {/* Silver glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
            style={{ boxShadow: "inset 0 0 80px rgba(225,225,225,0.03)" }}
          />

          <div className="relative z-10 flex-1">
            {/* Logo + Status */}
            <div className="flex items-center gap-4 mb-6">
              <LunarLogo className="w-10 h-10 md:w-12 md:h-12" isThinking={true} />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
                  System Online
                </span>
              </div>
            </div>

            <h3
              className="text-2xl md:text-3xl font-bold text-white mb-4 pb-1"
              style={{
                letterSpacing: "-0.04em",
                lineHeight: "1.2",
                textShadow: "0 0 12px rgba(255,255,255,0.15), 0 1px 6px rgba(0,0,0,0.5)",
              }}
            >
              LUNAR AI
            </h3>
            <p
              className="text-neutral-400 font-light max-w-md pb-4"
              style={{ lineHeight: "1.7", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
            >
              An elite{" "}
              <span className="text-white/90 font-medium">Space Scientist</span>{" "}
              persona powered by{" "}
              <span className="text-white/90 font-medium">Gemini 2.0 Flash</span>{" "}
              via OpenRouter. Translates complex astrophysics, orbital mechanics,
              and planetary data into clear, streaming scientific reports at 60FPS.
            </p>
          </div>

          {/* Spec grid */}
          <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
            <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1">
                Model
              </p>
              <p className="text-xs text-white/90 font-medium">Gemini 2.0 Flash</p>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1">
                Domain
              </p>
              <p className="text-xs text-white/90 font-medium">Astrophysics</p>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1">
                Delivery
              </p>
              <p className="text-xs text-white/90 font-medium">Streaming SSE</p>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1">
                Stack
              </p>
              <p className="text-xs text-white/90 font-medium">Next.js + Firebase</p>
            </div>
          </div>

          {/* Tech pills */}
          <div className="flex gap-2 flex-wrap mt-5 relative z-10">
            {["Gemini 2.0", "Prompt Engineering", "OpenRouter", "Framer Motion"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-neutral-400 font-mono tracking-wide"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </m.div>
      </div>
    </section>
  );
}
