"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

type RevealSectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function RevealSection({
  children,
  className,
  ...props
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return undefined;

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        section,
        {
          autoAlpha: 0,
          clipPath: "inset(0 0 10% 0)",
          y: 56,
        },
        {
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.92,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
          y: 0,
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      className={className}
      ref={sectionRef}
      {...props}
    >
      {children}
    </section>
  );
}
