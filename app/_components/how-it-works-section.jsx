"use client";

import React from "react";
import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { howItWorks } from "@/data/howItWorks";
import HowItWorksCard from "./how-it-works-card";
import { ElegantShape } from "@/components/ui/elegant-shape";
import { cn } from "@/lib/utils";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

const HowItWorksSection = () => {
  return (
    <section className="relative w-full py-20 md:py-32 bg-background overflow-hidden flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-violet-500/[0.05] blur-3xl pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-cyan-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-violet-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-amber-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-emerald-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full lg:max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-cyan-500/80" />
            <span className="text-sm text-muted-foreground tracking-wide uppercase">
              Getting Started
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                How It
              </span>
              <br />
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-foreground/90 to-violet-400"
                )}
              >
                Works
              </span>
            </h2>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Four simple steps to accelerate your career growth with AI-driven insights
              and personalized guidance.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
              -translate-x-1/2 bg-gradient-to-b from-cyan-500/30
              via-violet-500/30 to-emerald-500/30"
          />
          <div className="space-y-12 md:space-y-16">
            {howItWorks.map((item, index) => (
              <HowItWorksCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Blend masks */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
    </section>
  );
};

export default HowItWorksSection;
