"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type RevealSectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function RevealSection({
  children,
  className,
  ...props
}: RevealSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 56 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ amount: 0.18, once: true }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
