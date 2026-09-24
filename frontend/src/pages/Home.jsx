import React from "react";
import HeroSection from "../components/landing/HeroSection";
import CategoryShowcase from "../components/landing/CategoryShowcase";
import AboutSection from "../components/landing/AboutSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import ProcessSection from "../components/landing/ProcessSection";
import CTASection from "../components/landing/CTASection";
import NewsletterSection from "../components/landing/NewsletterSection";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <AboutSection />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <ProcessSection />
      <CTASection />
      <NewsletterSection />
      <ToastContainer />
    </div>
  );
}
