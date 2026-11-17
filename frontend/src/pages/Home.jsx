import React from "react";
import HeroSection from "../components/landing/HeroSection";
import CategoryShowcase from "../components/landing/CategoryShowcase";
import AboutSection from "../components/landing/AboutSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import ProcessSection from "../components/landing/ProcessSection";
import CTASection from "../components/landing/CTASection";
import NewsletterSection from "../components/landing/NewsletterSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <main className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <CategoryShowcase />
        <AboutSection />
        <FeaturesSection />
        {/* <TestimonialsSection /> */}
        <ProcessSection />
        <CTASection />
        <NewsletterSection />
      </main>
    </div>
  );
}
