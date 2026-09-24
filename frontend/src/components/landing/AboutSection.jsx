import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80";

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3"
        >
          About Us
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prata-regular text-3xl sm:text-4xl text-gray-900 mb-4"
        >
          Crafted to Bring Calm
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed"
        >
          At Wick & Aura, we believe that fragrances have the power to shift
          moods, stir memories, and bring peace into everyday spaces.
        </motion.p>
      </div>

      {/* Two column layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl aspect-square">
          <img
            src={ABOUT_IMAGE}
            alt="Handcrafted candles with dried flowers"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="lg:pl-4">
          <h3 className="prata-regular text-2xl sm:text-3xl text-gray-900 mb-6">
            Made with Intention
          </h3>

          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Each candle is hand-poured with care using natural soy wax,
              clean-burning wicks, and blends of essential oils chosen for
              their soothing notes. From soft florals to warm woods, every
              scent tells a quiet story. One that turns your home into a place
              of comfort and calm.
            </p>
            <p>
              We pour not just wax, but intention. Creating pieces that help
              you pause, breathe, and find stillness in simple moments.
            </p>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center justify-center mt-8 bg-black text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
