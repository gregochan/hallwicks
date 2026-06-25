"use client";

import { useEffect, useRef, useState } from "react";

const ESTABLISHED_YEAR = 1987;
const REGIONS = "HK.China.SG";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function AnimatedYears({ play }: { play: boolean }) {
  const target = new Date().getFullYear() - ESTABLISHED_YEAR;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!play) return undefined;

    let frame = 0;
    let animationFrame = 0;
    const frames = 52;

    const animate = () => {
      frame += 1;
      const progress = Math.min(1, frame / frames);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [play, target]);

  return <strong>{value} yrs</strong>;
}

function AnimatedRegions({ play }: { play: boolean }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!play) return undefined;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setValue(REGIONS.slice(0, index));

      if (index >= REGIONS.length) {
        window.clearInterval(timer);
      }
    }, 64);

    return () => window.clearInterval(timer);
  }, [play]);

  return <strong>{value || "..."}</strong>;
}

export function StoryStats() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <aside className="stats-panel" aria-label="Hallwicks facts" ref={ref}>
      <div>
        <span className="technical-label">Founded</span>
        <strong>1987</strong>
      </div>
      <div>
        <span className="technical-label">Experience</span>
        <AnimatedYears play={inView} />
      </div>
      <div>
        <span className="technical-label">Regions</span>
        <AnimatedRegions play={inView} />
      </div>
    </aside>
  );
}
