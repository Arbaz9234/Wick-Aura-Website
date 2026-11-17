import React from "react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-cover bg-center px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
      style={{ backgroundImage: `url(${assets.heroBG})` }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-6 left-4 sm:left-[5vw] md:left-[7vw] lg:left-[9vw] z-20"
      >
        <img src={assets.logoHome} alt="Wick & Aura" className="w-28 sm:w-32" />
      </motion.div>
      {/* Content */}
      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-around gap-10 pb-10 pt-28 md:min-h-[85vh] md:flex-row md:justify-center md:gap-4 md:py-8 lg:min-h-[95vh] lg:gap-8 lg:py-16 sm:pb-0">
        <div className="w-full max-w-2xl md:w-1/2 md:shrink-0">
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
            className="prata-regular mb-5 text-4xl leading-[1.12] text-white sm:text-5xl md:text-4xl lg:mb-6 lg:text-6xl"
          >
            Where Fragrance
            <br />
            Meets <span className="text-amber-200">Artistry</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-7 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base md:text-sm lg:mb-9 lg:text-lg"
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
              className="group inline-flex items-center justify-center gap-2 bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-amber-50 sm:px-8 sm:py-4 sm:text-sm"
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
            className="hero-trust-badges mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold tracking-wide sm:mt-10 sm:gap-x-6"
          >
            <span className="text-sm">100% Soy Wax</span>
            <span className="w-1 h-1 rounded-full bg-amber-200" />
            <span className="text-sm">Hand-poured</span>
            <span className="w-1 h-1 rounded-full bg-amber-200" />
            <span className="text-sm">Eco-friendly</span>
          </motion.div>
        </div>

        <motion.img
          src={assets.bannerimg}
          alt="Lit candle in a decorative glass holder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-auto w-[min(88vw,430px)] object-contain sm:w-full md:w-[46%] md:max-w-none md:shrink lg:w-[48%] lg:max-w-[680px]"
        />
      </div>
    </section>
  );
}
