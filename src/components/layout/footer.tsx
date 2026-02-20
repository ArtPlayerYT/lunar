"use client";

import { m } from "framer-motion";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 py-12 md:py-20 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nebula-violet/5 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <m.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="mb-8"
        >
          <span className="text-xs font-display tracking-[0.3em] text-gray-500 uppercase">
            Deep Space Intelligence
          </span>
        </m.div>

        <div className="flex items-center gap-6 mb-12">
          <m.a
            href="https://github.com/ArtPlayerYT"
             whileHover={{ scale: 1.2, color: "#fff" }}
            className="text-gray-500 transition-colors"
          >
            <Github className="w-5 h-5" />
          </m.a>
        </div>

        <div className="flex flex-col gap-2 text-[10px] uppercase tracking-widest text-gray-600">
           <p>Powered by aayush.aē</p>
           <p>&copy; {new Date().getFullYear()} LUNAR. All Systems Nominal.</p>
        </div>
      </div>
    </footer>
  );
}
