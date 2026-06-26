"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

export function ClientLogoGrid({ clients }: { clients: string[] }) {
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        ".client-logo",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 78%",
            once: true,
          },
          stagger: 0.12,
          y: 0,
        },
      );
    }, grid);

    return () => context.revert();
  }, []);

  return (
    <div className="client-logo-grid" aria-label="Selected Hallwicks clients" ref={gridRef}>
      {clients.map((client, index) => (
        <div
          className="client-logo"
          key={client}
          style={{ "--logo-index": index } as CSSProperties}
        >
          <span>{client}</span>
        </div>
      ))}
    </div>
  );
}
