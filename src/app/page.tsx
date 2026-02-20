"use client";

import { AboutSection } from "@/components/sections/about-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/hero-section";
import { Atmosphere } from "@/components/ui/atmosphere";
import { m } from "framer-motion";
import { lazy, Suspense } from "react";

const InteractiveBackground = lazy(() => import("@/components/ui/interactive-background").then(m => ({ default: m.InteractiveBackground })));

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen relative overflow-x-hidden selection:bg-nebula-violet/30 selection:text-white bg-true-black">
      <Atmosphere />
      <Suspense fallback={null}>
        <InteractiveBackground />
      </Suspense>
      <Header />
      
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col relative z-10"
        style={{ willChange: "opacity" }}
      >
         <HeroSection />
         <FeaturesSection />
         <AboutSection />
         <Footer />
      </m.div>
    </main>
  );
}

