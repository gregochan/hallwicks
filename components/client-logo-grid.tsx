"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, type CSSProperties } from "react";

import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import type { Client } from "@/lib/content/types";

export function ClientLogoGrid({ clients }: { clients: Client[] }) {
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
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 78%",
            once: true,
          },
          stagger: 0.16,
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
          className={`client-logo${client.logoSize ? ` client-logo-${client.logoSize}` : ""}`}
          key={client.name}
          style={{ "--logo-index": index } as CSSProperties}
        >
          {client.image ? (
            <img
              alt={client.alt || `${client.name} logo`}
              draggable={false}
              height={112}
              loading="lazy"
              onContextMenu={(event) => event.preventDefault()}
              src={client.image}
              width={240}
            />
          ) : (
            <span>{client.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}
