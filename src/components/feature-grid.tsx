import { GlassCard } from "@/components/ui/glass-card";
import { Zap, Brain, MessageSquare, Terminal } from "lucide-react";

const features = [
  {
    title: "Instant Response",
    description: "Powered by Gemini 2.0 Flash for lightning-fast latency.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    colSpan: "col-span-1 md:col-span-2",
  },
  {
    title: "Deep Reasoning",
    description: "Complex problem solving with advanced logical capabilities.",
    icon: <Brain className="w-6 h-6 text-nebula-violet" />,
    colSpan: "col-span-1",
  },
  {
    title: "Code Execution",
    description: "Generate, debug, and understand code in real-time.",
    icon: <Terminal className="w-6 h-6 text-green-400" />,
    colSpan: "col-span-1",
  },
  {
    title: "Natural Dialogue",
    description: "Fluid, context-aware conversations that feel human.",
    icon: <MessageSquare className="w-6 h-6 text-supernova-blue" />,
    colSpan: "col-span-1 md:col-span-2",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
       <h2 className="text-3xl md:text-5xl font-display font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-lunar-silver to-gray-500">
        System Capabilities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <GlassCard 
            key={index} 
            className={`flex flex-col gap-4 p-8 hover:bg-white/10 transition-colors cursor-default group ${feature.colSpan}`}
            glow={true}
          >
            <div className="bg-white/5 p-3 rounded-xl w-fit group-hover:bg-white/10 transition-colors">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 font-display">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
