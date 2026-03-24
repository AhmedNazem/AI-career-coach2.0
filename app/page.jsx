import HeroSection from "@/components/HeroSection";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FeaturesSection from "./_components/features-section";
import StatsSection from "./_components/stats-section";
import HowItWorksSection from "./_components/how-it-works-section";
import TestimonialsSection from "./_components/testimonials-section";
import FaqsSection from "./_components/faqs-section";
import { InteractiveHero } from "@/components/ui/interactive-hero/interactive-hero";

const Home = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <HeroSection />

      <FeaturesSection />

      <StatsSection />

      <HowItWorksSection />

      <TestimonialsSection />

      <FaqsSection />

      <section className="w-full py-24">
        <div className="container mx-auto px-4 md:px-6">
          <InteractiveHero className="border border-primary/20 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
                Ready to Accelerate Your Career?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                Join thousands of professionals who are advancing their careers
                with AI-powered guidance.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-11 mt-5 animate-bounce"
                >
                  Start Your Journey Today{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </InteractiveHero>
        </div>
      </section>
    </div>
  );
};

export default Home;

