import React from "react";
import { motion } from "framer-motion";
import { Truck, RotateCcw, ShieldCheck, Gift } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on orders above ₹499",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "100% secure checkout with encrypted payments",
  },
  {
    icon: Gift,
    title: "Gift Wrapping",
    description: "Premium gift packaging available on all orders",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function ProcessSection() {
  return (
    <section className="py-16 sm:py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
      >
        {policies.map((policy) => {
          const Icon = policy.icon;
          return (
            <motion.div
              key={policy.title}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1.5">
                {policy.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {policy.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
