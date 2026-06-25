"use client";

import { motion, useReducedMotion } from "motion/react";

export function ClientLogoGrid({ clients }: { clients: string[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="client-logo-grid" aria-label="Selected Hallwicks clients">
      {clients.map((client, index) => (
        <motion.div
          className="client-logo"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          key={client}
          transition={{
            delay: index * 0.06,
            duration: 0.56,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ amount: 0.4, once: true }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        >
          <span>{client}</span>
        </motion.div>
      ))}
    </div>
  );
}
