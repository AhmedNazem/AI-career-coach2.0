"use client";

import React from "react";
import ShaderBackground from "@/components/ui/shader-background";

const StatsSection = () => {
  return (
    <section className="w-full py-12 md:py-24 relative overflow-hidden">
      {/* WebGL Shader Background */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>

      {/* Gradient overlay for smooth blending with page */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/40 via-transparent to-background/40" />

      {/* Stats Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-white drop-shadow-lg">
              50+
            </h3>
            <p className="text-gray-300/90">Industries Covered</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-white drop-shadow-lg">
              1000+
            </h3>
            <p className="text-gray-300/90">Interview Questions</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-white drop-shadow-lg">
              95%
            </h3>
            <p className="text-gray-300/90">Success Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-bold text-white drop-shadow-lg">
              24/7
            </h3>
            <p className="text-gray-300/90">AI Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
