import { motion, type Variants, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

// Subtle scroll-in: starts at ~80% opacity and a small offset, settles to full.
// Never hides content fully — so SEO, print, and screenshots always see the page,
// and Recharts inside the section gets non-zero dimensions on mount.
const variants: Variants = {
  hidden: { opacity: 0.82, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
};

export function RevealSection({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.05 }} variants={variants}>
      {children}
    </motion.div>
  );
}
