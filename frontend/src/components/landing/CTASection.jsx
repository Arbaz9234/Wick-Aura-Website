import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gray-950 text-white px-6 sm:px-12 lg:px-20 py-16 sm:py-20 text-center"
      >
        {/* Decorative background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-amber-200/80 text-xs tracking-[0.2em] uppercase font-medium">
              Start your journey
            </span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>

          <h2 className="prata-regular text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
            Light Up Your <span className="text-amber-200">Space</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Discover handcrafted candles that transform ordinary moments into
            extraordinary experiences. Every scent tells a story.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-amber-50 transition-colors group"
            >
              Browse Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-medium tracking-wider uppercase hover:bg-white/10 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
