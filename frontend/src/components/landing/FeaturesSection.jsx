import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Droplets, Heart, Palette, Wind } from "lucide-react";
import { assets } from "../../assets/assets";
const features = [
  {
    id: "soy-wax",
    label: "Soy Wax",
    icon: Leaf,
    title: "100% Natural Soy Wax",
    description:
      "Our candles are made from premium, sustainably sourced soy wax — clean-burning with no harmful toxins. They produce 90% less soot than paraffin candles, so you can breathe easy while enjoying every scent.",
    image: assets.soyTab1,
    stats: [
      { label: "Burn Time", value: "40-60 hrs" },
      { label: "Soot", value: "Near Zero" },
      { label: "Source", value: "Sustainable" },
    ],
  },
  {
    id: "fragrance",
    label: "Fragrance",
    icon: Wind,
    title: "Curated Scent Profiles",
    description:
      "Each fragrance is developed by expert perfumers using a blend of essential oils and premium fragrance oils. From fresh florals to warm gourmands — every Wick & Aura candle tells a scent story.",
    image: assets.fragranceTab2,
    stats: [
      { label: "Profiles", value: "12+" },
      { label: "Oils Used", value: "Essential" },
      { label: "Throw", value: "Room-filling" },
    ],
  },
  {
    id: "hand-poured",
    label: "Handcrafted",
    icon: Heart,
    title: "Hand-Poured with Care",
    description:
      "Every candle is hand-poured in small batches to ensure consistency and quality. Our artisans shape, cure, and inspect each piece — no two candles are exactly alike, and that's the beauty of it.",
    image: assets.handcraftedTab3,
    stats: [
      { label: "Batch Size", value: "Small" },
      { label: "Process", value: "Hand-poured" },
      { label: "QC Checks", value: "Triple" },
    ],
  },
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    title: "A Palette for Every Mood",
    description:
      "Choose from our wide range of colors to match your décor, your mood, or the season. Each pigment is carefully chosen to complement the fragrance — because a candle should look as good as it smells.",
    image: assets.colorsTab4,
    stats: [
      { label: "Colors", value: "20+" },
      { label: "Dyes", value: "Non-toxic" },
      { label: "Match", value: "Any Décor" },
    ],
  },
];

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(features[0].id);
  const active = features.find((f) => f.id === activeTab);

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm tracking-[0.25em] uppercase text-gray-500 mb-3"
        >
          Why Wick & Aura
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prata-regular text-3xl sm:text-4xl text-gray-900"
        >
          Crafted Differently
        </motion.h2>
      </div>

      {/* Tab buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
        {features.map((f) => {
          const Icon = f.icon;
          const isActive = activeTab === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-black text-white shadow-lg shadow-black/10"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center"
        >
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text content */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              {active.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base mb-8">
              {active.description}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {active.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 rounded-xl bg-gray-50 p-1.5 text-center sm:p-4"
                >
                  <p className="text-sm font-bold leading-tight text-gray-900 sm:text-lg">
                    {stat.value}
                  </p>
                  <p className="mt-1 whitespace-normal text-[8px] tracking-normal text-gray-500 uppercase sm:text-xs sm:tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
