"use client";
import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

const HeroTerminal = () => {
  const [terminalStep, setTerminalStep] = useState(0);

  const steps = [
    { text: "Scanning resume parsing engine...", delay: 800 },
    { text: "Identifying skill gaps in React & Node.js...", delay: 1800 },
    { text: "Optimizing keywords for ATS systems...", delay: 2800 },
    { text: "Synthesizing customized mock interview...", delay: 3800 },
    { text: "Generating personalized 6-month career roadmap...", delay: 4800 },
    { text: "Ready. Your career coach is online.", delay: 5800, highlight: true },
  ];

  useEffect(() => {
    const timeouts = steps.map((step, index) => {
      return setTimeout(() => {
        setTerminalStep(index);
      }, step.delay);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black/80 border border-cyan-500/20 backdrop-blur-md">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-white/5">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-500/70">
          <Terminal size={14} />
          <span>ai-career-coach ~ bash</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 sm:p-8 text-left font-mono text-sm sm:text-base min-h-[250px] sm:min-h-[300px] flex flex-col space-y-3 relative">
        {steps.filter((_, i) => i <= terminalStep).map((step, index) => (
          <div 
            key={index} 
            className="flex items-start animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <span className="text-cyan-500 mr-3">{'>'}</span>
            <span className={step.highlight ? "text-green-400 font-semibold" : "text-gray-300"}>
              {step.text}
            </span>
          </div>
        ))}
        {/* Blinking Cursor */}
        <div className="flex items-center mt-2">
          <span className="text-cyan-500 mr-3">{'>'}</span>
          <span className="w-2.5 h-5 sm:h-6 bg-cyan-400 animate-pulse inline-block"></span>
        </div>
      </div>
    </div>
  );
};

export default HeroTerminal;
