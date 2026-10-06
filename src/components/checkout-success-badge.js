"use client";

import { motion } from "motion/react";

export default function CheckoutSuccessBadge() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={{ scale: 1, rotate: 45, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16 }}
      className="w-14 h-14 mx-auto mb-5.5 border border-gold bg-[#1a160c] flex items-center justify-center"
    >
      <span className="text-2xl text-gold-light -rotate-45">✓</span>
    </motion.div>
  );
}
