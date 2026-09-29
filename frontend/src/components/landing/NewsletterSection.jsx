import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simulate subscription
    setSubmitted(true);
    toast.success("Welcome to the Wick & Aura family!", {
      autoClose: 3000,
    });

    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
          Stay Connected
        </p>
        <h2 className="prata-regular text-3xl sm:text-4xl text-gray-900 mb-4">
          Join Our Community
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-10">
          Be the first to know about new fragrances, limited editions, and
          exclusive offers. We promise only good things in your inbox.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-3.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gray-900/10 transition-shadow"
          />
          <button
            type="submit"
            disabled={submitted}
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitted ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-5">
          No spam, unsubscribe anytime. We respect your inbox.
        </p>
      </motion.div>
    </section>
  );
}
