import React from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1602607718529-20f36c78804b?w=1400&q=80";

export default function HeroSection() {
  return (
    <section className="relative w-screen -ml-4 sm:-ml-[5vw] md:-ml-[7vw] lg:-ml-[9vw] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-6 left-4 sm:left-[5vw] md:left-[7vw] lg:left-[9vw] z-20"
      >
        <img
          src={assets.logoHome}
          alt="Wick & Aura"
          className="w-28 sm:w-32 brightness-0 invert"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] min-h-[85vh] flex items-center">
        <div className="max-w-2xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-amber-200 text-sm tracking-[0.2em] uppercase font-medium">
                Handcrafted with love
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="prata-regular text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.15] mb-6"
          >
            Where Fragrance
            <br />
            Meets <span className="text-amber-200">Artistry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          >
            Each Wick & Aura candle is hand-poured with premium soy wax and
            curated fragrances — designed to transform your space into a sensory
            experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <Link
              to="/collection"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-amber-50 transition-colors group"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-6 mt-14 text-gray-400 text-xs tracking-wide"
          >
            <span>100% Soy Wax</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>Hand-poured</span>
            <span className="w-1 h-1 rounded-full bg-gray-500" />
            <span>Eco-friendly</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
