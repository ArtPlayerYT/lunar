"use client";

import { m } from "framer-motion";
import { Github, ExternalLink, Code2, GraduationCap } from "lucide-react";
import { LunarLogo } from "@/components/ui/lunar-logo";

/* Shared card entry animation */
const cardEntry = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const },
  viewport: { once: true } as const,
});

/* Skills data */
const SKILLS = [
  { label: "C++", category: "core" },
  { label: "Data Structures", category: "core" },
  { label: "Next.js", category: "web" },
  { label: "TypeScript", category: "web" },
  { label: "Firebase", category: "web" },
  { label: "LLM / Gemini", category: "ai" },
  { label: "Prompt Eng.", category: "ai" },
  { label: "Tailwind CSS", category: "web" },
];

/* Repos data */
const REPOS = [
  {
    name: "LUNAR",
    desc: "Space-science AI assistant — Gemini 2.0 Flash, streaming SSE, Firebase auth & persistence.",
    tags: ["Next.js", "Gemini", "Firebase"],
  },
  {
    name: "Banking System",
    desc: "Core banking architecture with transaction pipelines and secure account management.",
    tags: ["C++", "DSA", "System Design"],
  },
  {
    name: "Blockchain Network",
    desc: "Proof-of-work chain with block validation, mining simulation, and tamper-proof ledger.",
    tags: ["C++", "Cryptography"],
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 md:py-32 relative z-10 px-4 md:px-6 max-w-6xl mx-auto"
      style={{ fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)" }}
    >
      {/* ── Section Header ── */}
      <m.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="mb-16 md:mb-20"
      >
        <p className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase mb-6">
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
          Engineer.
          <br />
          <span className="text-white/40">System Architect.</span>
        </h2>
        <p
          className="text-base md:text-lg text-neutral-400 max-w-2xl mt-6 font-light pb-4"
          style={{ lineHeight: "1.5", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          Software Engineer studying at{" "}
          <span className="text-white font-medium">NIT Jalandhar</span>.
          Grounded in C++, Data Structures, and system architecture — building
          production-grade applications with Next.js, Firebase, and LLM
          integrations.
        </p>
      </m.div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">

        {/* Card 1 — Identity */}
        <m.div
          {...cardEntry(0.05)}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col lg:col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white/70" />
              </div>
            </div>
            <h3
              className="text-xl md:text-2xl font-bold text-white mb-3 pb-1"
              style={{ letterSpacing: "-0.06em", lineHeight: "1.5" }}
            >
              NIT Jalandhar
            </h3>
            <p
              className="text-sm text-neutral-400 font-light pb-4"
              style={{ lineHeight: "1.5" }}
            >
              Pursuing engineering with a focus on algorithms, system design, and
              full-stack development. Building real-world products while
              mastering core computer science fundamentals.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap mt-auto pt-4 relative z-10">
            {["B.Tech", "Computer Science", "NIT Jalandhar"].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-neutral-500 font-mono tracking-wide"
                style={{ lineHeight: "1.5" }}
              >
                {t}
              </span>
            ))}
          </div>
        </m.div>

        {/* Card 2 — Skill Matrix */}
        <m.div
          {...cardEntry(0.12)}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col lg:col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white/70" />
              </div>
              <span className="text-[9px] font-mono text-white/30 tracking-[0.25em] uppercase">
                Stack
              </span>
            </div>
            <h3
              className="text-xl md:text-2xl font-bold text-white mb-3 pb-1"
              style={{ letterSpacing: "-0.06em", lineHeight: "1.5" }}
            >
              Skill Matrix
            </h3>

            <div className="flex flex-col gap-2 mt-2">
              {SKILLS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <span
                    className="text-xs text-white/80 font-mono tracking-wide"
                    style={{ lineHeight: "1.5" }}
                  >
                    {s.label}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase">
                    {s.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </m.div>

        {/* Card 3 — Source Code / GitHub */}
        <m.div
          {...cardEntry(0.19)}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 md:p-8 flex flex-col md:col-span-2 lg:col-span-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                <Github className="w-5 h-5 text-white/70" />
              </div>
              <span className="text-[9px] font-mono text-white/30 tracking-[0.25em] uppercase">
                Repositories
              </span>
            </div>
            <h3
              className="text-xl md:text-2xl font-bold text-white mb-3 pb-1"
              style={{ letterSpacing: "-0.06em", lineHeight: "1.5" }}
            >
              Source Code
            </h3>

            <div className="flex flex-col gap-3 mt-2">
              {REPOS.map((repo) => (
                <div
                  key={repo.name}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <p
                    className="text-sm text-white font-medium mb-1"
                    style={{ lineHeight: "1.5" }}
                  >
                    {repo.name}
                  </p>
                  <p
                    className="text-[11px] text-neutral-500 font-light mb-2"
                    style={{ lineHeight: "1.5" }}
                  >
                    {repo.desc}
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    {repo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full border border-white/[0.06] text-[9px] text-neutral-500 font-mono tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://github.com/ArtPlayerYT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 mt-6 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/15 text-white/80 hover:text-white transition-all duration-300 group/btn relative z-10 self-start"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="text-xs font-medium tracking-wide" style={{ lineHeight: "1.5" }}>
              View All Repos
            </span>
            <ExternalLink className="w-3 h-3 text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-300" />
          </a>
        </m.div>

        {/* Card 4 — LUNAR AI Spotlight (Primary Anchor) */}
        <m.div
          {...cardEntry(0.26)}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-md p-6 md:p-10 flex flex-col col-span-1 md:col-span-2 lg:col-span-3"
          style={{
            background: "linear-gradient(135deg, rgba(10,10,11,0.92) 0%, rgba(46,2,73,0.12) 40%, rgba(10,10,11,0.92) 100%)",
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"
            style={{ boxShadow: "inset 0 0 100px rgba(225,225,225,0.025)" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start md:gap-10">
            {/* Left: branding + description */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <LunarLogo className="w-11 h-11 md:w-14 md:h-14" isThinking={true} />
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400/70 tracking-[0.25em] uppercase">
                    System Online
                  </span>
                </div>
              </div>

              <h3
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 pb-1"
                style={{
                  letterSpacing: "-0.06em",
                  lineHeight: "1.5",
                  textShadow: "0 0 16px rgba(255,255,255,0.12), 0 1px 6px rgba(0,0,0,0.5)",
                }}
              >
                LUNAR AI
              </h3>
              <p
                className="text-sm md:text-base text-neutral-400 font-light max-w-lg pb-4"
                style={{ lineHeight: "1.5", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
              >
                An elite{" "}
                <span className="text-white/90 font-medium">Space Scientist</span>{" "}
                persona powered by{" "}
                <span className="text-white/90 font-medium">Gemini 2.0 Flash</span>{" "}
                via OpenRouter. Translates complex astrophysics, orbital
                mechanics, and planetary data into clear, streaming scientific
                reports.
              </p>

              <div className="flex gap-2 flex-wrap mt-2">
                {["Gemini 2.0", "Prompt Engineering", "OpenRouter", "Framer Motion", "Edge Runtime"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-neutral-400 font-mono tracking-wide"
                      style={{ lineHeight: "1.5" }}
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Right: Spec grid */}
            <div className="grid grid-cols-2 gap-3 mt-8 md:mt-0 md:w-[280px] flex-shrink-0">
              {[
                { label: "Model", value: "Gemini 2.0 Flash" },
                { label: "Domain", value: "Astrophysics" },
                { label: "Delivery", value: "Streaming SSE" },
                { label: "Stack", value: "Next.js + Firebase" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <p
                    className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase mb-1"
                    style={{ lineHeight: "1.5" }}
                  >
                    {spec.label}
                  </p>
                  <p
                    className="text-xs text-white/90 font-medium"
                    style={{ lineHeight: "1.5" }}
                  >
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
}
