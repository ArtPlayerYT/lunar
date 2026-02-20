"use client";

import { m } from "framer-motion";
import { Cpu, Zap, Eye, Globe } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Multimodal Processing",
    desc: "Seamlessly analyze text, code, images, and audio in a single stream."
  },
  {
    icon: Zap,
    title: "Sub-second Latency",
    desc: "Responses delivered at the speed of thought."
  },
  {
    icon: Globe,
    title: "Cosmic Reasoning",
    desc: "Accessing the entirety of human knowledge with deep comprehension."
  },
  {
    icon: Cpu,
    title: "Adaptive Memory",
    desc: "Context-aware interactions that evolve with your conversation."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative z-10 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
             
             <f.icon className="w-8 h-8 text-lunar-silver mb-6 group-hover:text-white transition-colors" />
             
             <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
             <p className="text-sm text-gray-400 leading-relaxed">
               {f.desc}
             </p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
