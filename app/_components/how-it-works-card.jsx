"use client";

import React from "react";
import { motion } from "framer-motion";

const stepColors = [
  {
    gradient: "from-cyan-400 to-emerald-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
  },
  {
    gradient: "from-violet-400 to-purple-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "shadow-violet-500/20",
  },
  {
    gradient: "from-amber-400 to-orange-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  {
    gradient: "from-emerald-400 to-teal-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
];

const HowItWorksCard = ({ item, index }) => {
  const colors = stepColors[index % stepColors.length];
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className={`relative flex items-center gap-8 md:gap-12
        ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
        flex-col md:text-left text-center z-10`}
    >
      {/* Card Content */}
      <div className="flex-1 w-full">
        <div
          className={`relative rounded-2xl border ${colors.border}
            bg-card/50 backdrop-blur-sm p-6 md:p-8
            shadow-lg ${colors.glow}
            transition-all duration-500
            hover:shadow-xl hover:scale-[1.02]
            hover:border-opacity-60`}
        >
          {/* Step number badge */}
          <div
            className={`absolute -top-4 ${isEven ? "left-6 md:left-8" : "left-6 md:right-8 md:left-auto"}
              flex items-center gap-2`}
          >
            <span
              className={`inline-flex items-center justify-center
                w-8 h-8 rounded-full text-sm font-bold
                bg-gradient-to-br ${colors.gradient} text-background`}
            >
              {index + 1}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-widest
                ${colors.text}`}
            >
              Step {index + 1}
            </span>
          </div>

          <div className="mt-3 flex items-start gap-4">
            {/* Icon */}
            <div
              className={`hidden md:flex shrink-0 w-14 h-14 rounded-xl
                ${colors.bg} ${colors.border} border
                items-center justify-center`}
            >
              {item.icon}
            </div>

            <div className="space-y-2 flex-1 relative z-10">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Node (visible on md+) */}
      <div className="hidden md:flex flex-col items-center shrink-0 relative z-10">
        <div
          className={`relative flex items-center justify-center
            w-12 h-12 rounded-full border-2 ${colors.border}
            ${colors.bg} backdrop-blur-sm`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-gradient-to-br
              ${colors.gradient} animate-pulse`}
          />
        </div>
      </div>

      {/* Spacer for layout balance */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
};

export default HowItWorksCard;
