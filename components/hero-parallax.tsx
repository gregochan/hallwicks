"use client";

import { useEffect } from "react";
import Image from "next/image";

import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { useLanguage } from "@/components/language-provider";
import { TextRotate } from "@/components/ui/text-rotate";

const heroImages = [
  {
    src: "/images/projects/great-people-shanghai-02.png",
    alt: "Minimal dental treatment suite with black framed glazing",
    className: "hero-float hero-float-primary",
    depth: 1.2,
    sizes: "(max-width: 980px) 62vw, 28vw",
    priority: true,
  },
  {
    src: "/images/projects/st-george-01.png",
    alt: "Specialist medical reception and consultation corridor",
    className: "hero-float hero-float-left",
    depth: -0.7,
    sizes: "(max-width: 980px) 42vw, 18vw",
  },
  {
    src: "/images/projects/clinic-a.png",
    alt: "Clinical interior intersection with glass treatment room",
    className: "hero-float hero-float-bottom",
    depth: 0.55,
    sizes: "(max-width: 980px) 54vw, 27vw",
  },
  {
    src: "/images/projects/langham-place.png",
    alt: "Langham Place orthodontics centre interior",
    className: "hero-float hero-float-small",
    depth: -1.1,
    sizes: "(max-width: 980px) 34vw, 15vw",
  },
];

export function HeroParallax() {
  const { t } = useLanguage();

  useEffect(() => {
    const root = document.documentElement;
    const wordmark = document.querySelector<HTMLElement>(".hero-wordmark");
    const navBrand = document.querySelector<HTMLElement>(".nav-brand");
    const hero = document.querySelector<HTMLElement>(".hero");

    if (!wordmark || !navBrand || !hero) return undefined;

    let origin = wordmark.getBoundingClientRect();
    let target = navBrand.getBoundingClientRect();
    let targetScale = 0.14;

    const measure = () => {
      wordmark.style.transform = "none";
      origin = wordmark.getBoundingClientRect();
      target = navBrand.getBoundingClientRect();
      targetScale = Math.max(0.095, Math.min(0.18, target.width / origin.width));
      update();
    };

    const update = () => {
      const range = Math.max(1, hero.offsetHeight - target.bottom - 18);
      const progress = Math.max(0, Math.min(1, window.scrollY / range));
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const scale = 1 + (targetScale - 1) * eased;
      const x = target.left + (target.width - origin.width * targetScale) / 2 - origin.left;
      const y = target.top + (target.height - origin.height * targetScale) / 2 - origin.top;
      const fade = progress > 0.82 ? Math.max(0, 1 - (progress - 0.82) / 0.16) : 1;
      const brandFade = Math.max(0, Math.min(1, (progress - 0.9) / 0.1));

      wordmark.style.transform = `translate3d(${x * eased}px, ${y * eased}px, 0) scale(${scale})`;
      wordmark.style.opacity = String(fade);
      root.style.setProperty("--nav-brand-opacity", String(brandFade));
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      wordmark.style.transform = "";
      wordmark.style.opacity = "";
      root.style.removeProperty("--nav-brand-opacity");
    };
  }, []);

  return (
    <section className="hero hero-parallax" aria-labelledby="hero-title">
      <Floating sensitivity={-0.48} className="hero-floating">
        {heroImages.map((image) => (
          <FloatingElement
            className={image.className}
            depth={image.depth}
            key={image.src}
          >
            <figure
              className="hero-float-card protected-image"
              onContextMenu={(event) => event.preventDefault()}
            >
              <Image
                src={image.src}
                alt={image.alt}
                draggable={false}
                fill
                onContextMenu={(event) => event.preventDefault()}
                onDragStart={(event) => event.preventDefault()}
                priority={image.priority}
                sizes={image.sizes}
              />
            </figure>
          </FloatingElement>
        ))}
      </Floating>

      <div className="hero-grid-lines" aria-hidden="true" />
      <p className="hero-wordmark" aria-hidden="true">
        hallwicks.
      </p>

      <div className="hero-statement">
        <p className="technical-label hero-kicker">
          {t.hero.kicker}
        </p>
        <p className="technical-label hero-rotator">
          {t.hero.rotatorLabel}
          <TextRotate
            texts={[...t.hero.rotate]}
            mainClassName="hero-rotate"
            rotationInterval={2600}
            staggerDuration={0.012}
            staggerFrom="last"
            splitBy="characters"
          />
        </p>
        <h1 id="hero-title">
          {t.hero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-copy">{t.hero.copy}</p>
      </div>
    </section>
  );
}
