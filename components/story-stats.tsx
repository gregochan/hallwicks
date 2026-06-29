"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/language-provider";

const ESTABLISHED_YEAR = 1987;

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

function AnimatedYears({ play, suffix }: { play: boolean; suffix: string }) {
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

  return <strong>{value} {suffix}</strong>;
}

function AnimatedRegions({ play, regions }: { play: boolean; regions: string }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!play) return undefined;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setValue(regions.slice(0, index));

      if (index >= regions.length) {
        window.clearInterval(timer);
      }
    }, 64);

    return () => window.clearInterval(timer);
  }, [play, regions]);

  return <strong>{value || "..."}</strong>;
}

export function StoryStats() {
  const { ref, inView } = useInView<HTMLElement>();
  const { t } = useLanguage();

  return (
    <aside className="stats-panel" aria-label="Hallwicks facts" ref={ref}>
      <div>
        <span className="technical-label">{t.story.stats.founded}</span>
        <strong>1987</strong>
      </div>
      <div>
        <span className="technical-label">{t.story.stats.experience}</span>
        <AnimatedYears play={inView} suffix={t.story.stats.yearSuffix} />
      </div>
      <div>
        <span className="technical-label">{t.story.stats.regions}</span>
        <AnimatedRegions
          key={t.story.stats.regionText}
          play={inView}
          regions={t.story.stats.regionText}
        />
      </div>
    </aside>
  );
}
