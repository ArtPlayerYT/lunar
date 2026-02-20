"use client";

import { ChatInterface } from "@/components/chat-interface";
import { Atmosphere } from "@/components/ui/atmosphere";
import { m } from "framer-motion";

export default function LunarAiPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-true-black text-lunar-silver font-sans selection:bg-nebula-violet/30 selection:text-white">
      <Atmosphere />
      <m.div
        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full h-full p-4 md:p-6"
        style={{ willChange: "transform, opacity, filter" }}
      >
        <ChatInterface />
      </m.div>
    </main>
  );
}

