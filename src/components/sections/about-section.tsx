"use client";

import { m } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { LunarLogo } from "@/components/ui/lunar-logo";

const MatrixItem = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 group">
    <span className="h-1.5 w-1.5 bg-neutral-600 group-hover:bg-white transition-colors duration-300 rounded-full" />
    <span className="text-sm font-mono text-neutral-400 group-hover:text-white transition-colors duration-300">
      {label}
    </span>
  </div>
);

export function AboutSection() {
  return (
    <section id="about" className="py-32 relative z-10 px-6 max-w-7xl mx-auto font-sans">
      {/* Visual Hierarchy & Typography */}
      <m.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <h2 
          className="text-[4rem] md:text-[5rem] lg:text-[6rem] leading-[0.9] font-bold tracking-[-0.05em] text-white max-w-5xl"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
        >
          Architect of Code.<br />
          <span className="text-white/50">Storyteller of the Night.</span>
        </h2>
      </m.div>

      {/* The Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
        
        {/* Card 1: Technical Core (Wide) */}
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.1 }}
           viewport={{ once: true }}
           className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-12 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-sm font-mono text-neutral-400 mb-4 tracking-widest uppercase">01 // Engineering Source</h3>
            <h4 className="text-3xl font-bold text-white mb-6" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Technical Core</h4>
            <p className="text-neutral-300 leading-relaxed text-lg max-w-xl" style={{ lineHeight: "1.5" }}>
               Forged at <span className="text-white font-medium">NIT Jalandhar</span>, my foundation lies in the deep logic of C++ and Data Structures & Algorithms. I build scalable, secure systems—from banking architectures to decentralized blockchain networks.
            </p>
          </div>
          
          <div className="mt-8 flex gap-4 flex-wrap relative z-10">
             {["C++", "DSA", "Blockchain", "System Design"].map((tech) => (
                <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-neutral-300">
                   {tech}
                </span>
             ))}
          </div>
        </m.div>

        {/* Card 2: AI Intersection (Tall) */}
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           viewport={{ once: true }}
           className="md:col-span-1 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-12 flex flex-col justify-between"
        >
           <div className="absolute inset-0 bg-gradient-to-b from-nebula-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           
           <div className="relative z-10">
              <h3 className="text-sm font-mono text-neutral-400 mb-4 tracking-widest uppercase">02 // Intelligence</h3>
              <h4 className="text-3xl font-bold text-white mb-6" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>The AI Intersection</h4>
              <p className="text-neutral-300 leading-relaxed mb-6" style={{ lineHeight: "1.5" }}>
                 Bridging the gap between human intent and machine execution. My work integrates LLMs, optimizes workflows with Gemini, and automates educational ecosystems via the Google Classroom API.
              </p>
           </div>

           {/* Decorative AI Visualization Element */}
           <div className="relative h-40 w-full mt-auto mb-4 overflow-hidden rounded-xl border border-white/5 bg-black/50">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-nebula-violet/20 blur-xl animate-pulse" />
                 <div className="absolute w-16 h-16 border border-white/20 rounded-full animate-[spin_4s_linear_infinite]" />
                 <div className="absolute w-24 h-24 border border-white/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              </div>
           </div>
        </m.div>

        {/* Card 3: Creative Engine (Wide) */}
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           viewport={{ once: true }}
           className="md:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-12 flex flex-col justify-between"
        >
           <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
             <div className="flex-1">
                <h3 className="text-sm font-mono text-neutral-400 mb-4 tracking-widest uppercase">03 // Vision</h3>
                <h4 className="text-3xl font-bold text-white mb-6" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Creative Engine</h4>
                <p className="text-neutral-300 leading-relaxed text-lg" style={{ lineHeight: "1.5" }}>
                   Member of the <span className="text-white font-medium">Videography Club</span>. From cinematography to technical scriptwriting, I apply the &quot;storyteller&apos;s mindset&quot; to code—ensuring every user journey has a compelling narrative arc.
                </p>
             </div>
             {/* Visual Element representing camera/lens */}
             <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center shrink-0">
                <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm" />
             </div>
           </div>
        </m.div>

        {/* Card 4: LUNAR AI — Product Spotlight (Full Width) */}
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.4 }}
           viewport={{ once: true }}
           className="md:col-span-3 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-nebula-violet/5 backdrop-blur-md p-8 md:p-12"
           style={{ paddingBottom: "2rem" }}
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-nebula-violet/10 via-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
            {/* Animated Logo */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <LunarLogo className="w-20 h-20 md:w-24 md:h-24" isThinking={true} />
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">LIVE</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-sm font-mono text-neutral-400 mb-4 tracking-widest uppercase">04 // Product Spotlight</h3>
              <h4 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ 
                  letterSpacing: "-0.06em",
                  textShadow: "0 0 10px rgba(255,255,255,0.2), 0 1px 6px rgba(0,0,0,0.5)",
                  lineHeight: "1.2",
                }}
              >
                LUNAR: Frontier Space Intelligence
              </h4>
              <p className="text-neutral-300 text-lg mb-6 max-w-3xl" style={{ lineHeight: "1.5" }}>
                LUNAR represents the pinnacle of my work in <span className="text-white font-medium">Prompt Engineering</span> and <span className="text-white font-medium">AI Automation</span>. 
                It is an elite intelligence layer forged to translate complex cosmic data into clear, student-friendly scientific reports, 
                leveraging the full multimodal power of the Google AI Studio ecosystem.
              </p>

              {/* Tech Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                  <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-1">Model</p>
                  <p className="text-sm text-white font-medium">Gemini 2.0 Flash</p>
                  <p className="text-xs text-neutral-400 mt-1">Sub-second latency, high-reasoning accuracy</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                  <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-1">Specialization</p>
                  <p className="text-sm text-white font-medium">Astrophysics & Space Science</p>
                  <p className="text-xs text-neutral-400 mt-1">Custom-engineered System Directive</p>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                  <p className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase mb-1">Interface</p>
                  <p className="text-sm text-white font-medium">60FPS Kinetic UI</p>
                  <p className="text-xs text-neutral-400 mt-1">Streaming responses, real-time render</p>
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex gap-3 flex-wrap">
                {["Gemini 2.0", "Prompt Engineering", "Next.js", "Streaming API", "OpenRouter", "Framer Motion"].map((tech) => (
                  <span key={tech} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </m.div>

        {/* Card 5: GitHub — Open Source Contributions */}
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.5 }}
           viewport={{ once: true }}
           className="md:col-span-3 relative group overflow-visible rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 md:p-12"
        >
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
            {/* GitHub Icon with Silver Glow */}
            <div className="flex items-center justify-center shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Github
                  className="w-16 h-16 md:w-20 md:h-20 relative z-10"
                  style={{
                    color: "#E1E1E1",
                    filter: "drop-shadow(0 0 8px rgba(225,225,225,0.2))",
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1" style={{ overflow: "visible" }}>
              <h3 className="text-sm font-mono text-neutral-400 mb-4 tracking-widest uppercase">05 // Source Code</h3>
              <h4
                className="text-3xl font-bold text-white mb-4"
                style={{
                  textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                  lineHeight: "1.2",
                }}
              >
                Open Source Contributions
              </h4>
              <p
                className="text-neutral-300 text-lg max-w-3xl mb-8"
                style={{
                  lineHeight: "1.5",
                  overflow: "visible",
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }}
              >
                Explore the source code for <span className="text-white font-medium">LUNAR</span> and other engineering projects, from <span className="text-white font-medium">C++ frameworks</span> to <span className="text-white font-medium">blockchain solutions</span>. Access the core logic forged by a Software Engineer &amp; Multimedia Strategist from NIT Jalandhar.
              </p>

              {/* Explore Repositories Button */}
              <a
                href="https://github.com/ArtPlayerYT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white transition-all duration-300 group/btn"
              >
                <Github className="w-4 h-4" style={{ filter: "drop-shadow(0 0 4px rgba(225,225,225,0.3))" }} />
                <span className="text-sm font-medium tracking-wide">Explore Repositories</span>
                <ExternalLink className="w-3 h-3 text-neutral-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-300" />
              </a>
            </div>
          </div>
        </m.div>

      </div>

      {/* Core Competencies Grid */}
      <m.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-20 border-t border-white/10 pt-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
               <h5 className="text-white font-medium mb-6">Development</h5>
               <div className="space-y-3">
                  <MatrixItem label="C++ & DSA" />
                  <MatrixItem label="Blockchain Architecture" />
                  <MatrixItem label="Secure Banking Systems" />
                  <MatrixItem label="API Development" />
               </div>
            </div>
            
            <div>
               <h5 className="text-white font-medium mb-6">AI & Automation</h5>
               <div className="space-y-3">
                  <MatrixItem label="Prompt Engineering" />
                  <MatrixItem label="LLM Integration" />
                  <MatrixItem label="Gemini Workflows" />
                  <MatrixItem label="Google Classroom API" />
               </div>
            </div>

            <div>
               <h5 className="text-white font-medium mb-6">Creative</h5>
               <div className="space-y-3">
                  <MatrixItem label="Visual Storytelling" />
                  <MatrixItem label="Technical Scriptwriting" />
                  <MatrixItem label="Video Production" />
                  <MatrixItem label="Cinematography" />
               </div>
            </div>
        </div>
      </m.div>
    </section>
  );
}
