import React, { useContext } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShopContext } from "../../context/ShopContext";

const CATEGORY_IMAGES = {
  "Bouquet Candles":
    "https://images.unsplash.com/photo-1608181831688-ba943e63506e?w=600&q=80",
  "Jar Candles":
    "https://images.unsplash.com/photo-1602607718529-20f36c78804b?w=600&q=80",
  "Mini & Bubble Candles":
    "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80",
};

const categories = [
  {
    name: "Bouquet Candles",
    tagline: "Sculpted floral arrangements you can light",
    query: "Bouquet Candles",
  },
  {
    name: "Jar Candles",
    tagline: "Premium fragrances in elegant glass",
    query: "Jar Candles",
  },
  {
    name: "Mini & Bubble",
    tagline: "Tiny treasures, big impressions",
    query: "Mini & Bubble Candles",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function CategoryShowcase() {
  const { products } = useContext(ShopContext);

  const getCategoryCount = (cat) =>
    products.filter((p) => p.category === cat).length;

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3"
        >
          Our Collections
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prata-regular text-3xl sm:text-4xl text-gray-900"
        >
          Find Your Perfect Candle
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
      >
        {categories.map((cat) => (
          <motion.div key={cat.name} variants={cardVariants}>
            <Link
              to={`/collection?category=${encodeURIComponent(cat.query)}`}
              className="group block relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5]"
            >
              <img
                src={CATEGORY_IMAGES[cat.query]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-white text-xl sm:text-2xl font-semibold mb-1">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{cat.tagline}</p>
                <span className="inline-flex items-center gap-1.5 text-white/80 text-xs tracking-wide uppercase group-hover:text-white transition-colors">
                  Shop Now
                  <svg
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
