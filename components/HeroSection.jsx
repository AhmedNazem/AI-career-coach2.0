"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import ParticleWaves from "./ui/demo";

const HeroSection = () => {
  return (
    <section className="relative w-full pt-36 md:pt-48 pb-32 md:pb-48">
      {/* Particle Waves Background - extends beyond section */}
      <div className="absolute inset-0 -bottom-40 md:-bottom-64 z-0 pointer-events-auto">
        <ParticleWaves />
      </div>

      <div className="relative z-10 space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title">
            Your AI Career Coach for <br />
            Professional success
          </h1>
          <p className="mx-auto max-w-[600px] text-cyan-100 md:text-xl">
            Advance your career with personalized guidance, interview prep , and
            AI-powered tools for job success
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href={"/dashboard"}>
            <Button size="lg" className="px-8 hover:bg-cyan-100">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
