import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { ShopContext } from "../../context/ShopContext";

export default function TestimonialsSection() {
  const { products } = useContext(ShopContext);

  // Gather reviews from products that have them
  const allReviews = products
    .filter((p) => p.reviews && p.reviews.length > 0)
    .flatMap((p) =>
      p.reviews.map((r) => ({
        ...r,
        productName: p.name,
        productImage: p.image[0],
      })),
    )
    .filter((r) => r.rating >= 4)
    .slice(0, 6);

  // Fallback reviews if no product reviews exist yet
  const fallbackReviews = [
    {
      name: "Priya M.",
      rating: 5,
      comment:
        "The Lavender Dreams candle is absolutely divine. The scent fills my entire living room within minutes. Best candle I've ever owned!",
      productName: "Lavender Dreams",
    },
    {
      name: "Arjun S.",
      rating: 5,
      comment:
        "Bought the bouquet candle set as a gift — the packaging was beautiful and the craftsmanship is incredible. Will definitely order again.",
      productName: "Rose Bouquet Set",
    },
    {
      name: "Meera K.",
      rating: 4,
      comment:
        "Love that these are made from soy wax. Clean burn, no soot, and the vanilla scent is warm without being overpowering. Perfect for evenings.",
      productName: "Vanilla Bliss",
    },
    {
      name: "Rohan D.",
      rating: 5,
      comment:
        "The mini bubble candles are the cutest things ever. I keep them on my desk and they make my workspace feel so cozy.",
      productName: "Mini Bubble Collection",
    },
    {
      name: "Ananya R.",
      rating: 5,
      comment:
        "Exceptional quality. The burn time is amazing — my jar candle lasted over 50 hours. The fragrance stays consistent from first light to last.",
      productName: "Midnight Amber",
    },
    {
      name: "Vikram P.",
      rating: 4,
      comment:
        "Ordered for Diwali gifting and everyone loved them. The colors are gorgeous and each candle comes beautifully wrapped.",
      productName: "Festival Collection",
    },
  ];

  const reviews = allReviews.length >= 3 ? allReviews : fallbackReviews;

  return (
    <section className="py-20 sm:py-28">
      <div className="text-center mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prata-regular text-3xl sm:text-4xl text-gray-900"
        >
          What Our Customers Say
        </motion.h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
      >
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
              },
            }}
            className="break-inside-avoid bg-gray-50 rounded-2xl p-6 sm:p-7"
          >
            <Quote className="w-5 h-5 text-gray-300 mb-4 rotate-180" />
            <p className="text-gray-700 text-sm leading-relaxed mb-5">
              {review.comment}
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {review.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  on {review.productName}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3 h-3 ${
                      j < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
