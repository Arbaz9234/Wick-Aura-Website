import { motion } from "framer-motion";

const variants = {
  // Forward (PUSH / REPLACE): new page slides up from bottom
  forward: {
    initial: { y: "6%", opacity: 0 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: "-2%", opacity: 0, scale: 0.97 },
  },
  // Backward (POP): previous page scales up, current slides down
  backward: {
    initial: { y: "-2%", opacity: 0, scale: 0.97 },
    animate: { y: 0, opacity: 1, scale: 1 },
    exit: { y: "6%", opacity: 0 },
  },
};

const transition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-out
};

export default function PageTransition({ children, direction = "forward" }) {
  const v = variants[direction] || variants.forward;

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={transition}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
