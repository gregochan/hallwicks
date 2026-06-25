"use client";

import { useEffect } from "react";
import Image from "next/image";

import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
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
      targetScale = Math.max(0.1, Math.min(0.2, target.height / origin.height));
      update();
    };

    const update = () => {
      const range = Math.max(1, hero.offsetHeight - target.bottom - 18);
      const progress = Math.max(0, Math.min(1, window.scrollY / range));
      const eased = 1 - Math.pow(1 - progress, 3);
      const x = target.left - origin.left;
      const y = target.top - origin.top;
      const scale = 1 + (targetScale - 1) * eased;
      const depth = Math.sin(progress * Math.PI) * 150;
      const tilt = Math.sin(progress * Math.PI) * -7;
      const fade = progress > 0.94 ? Math.max(0, 1 - (progress - 0.94) / 0.06) : 1;
      const brandFade = Math.max(0, Math.min(1, (progress - 0.92) / 0.08));
      const shadow = Math.sin(progress * Math.PI) * 0.2;

      wordmark.style.transform = `perspective(900px) translate3d(${x * eased}px, ${y * eased}px, ${depth}px) rotateX(${tilt}deg) scale(${scale})`;
      wordmark.style.opacity = String(fade);
      wordmark.style.filter = `drop-shadow(0 ${Math.round(22 * shadow)}px ${Math.round(38 * shadow)}px rgba(0, 0, 0, ${shadow}))`;
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
      wordmark.style.filter = "";
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
      <div className="hero-green-dot" aria-hidden="true" />
      <p className="hero-wordmark" aria-hidden="true">
        hallwicks.
      </p>

      <div className="hero-statement">
        <p className="technical-label hero-kicker">
          est. 1987 // hk + china + sg
        </p>
        <p className="technical-label hero-rotator">
          specialized environments //
          <TextRotate
            texts={["medical centers", "dental clinics", "veterinary hospitals"]}
            mainClassName="hero-rotate"
            rotationInterval={2600}
            staggerDuration={0.012}
            staggerFrom="last"
            splitBy="characters"
          />
        </p>
        <h1 id="hero-title">
          <span>the intersection</span>
          <span>of care, precision,</span>
          <span>and space.</span>
        </h1>
        <p className="hero-copy">
          Hallwicks creates medical, dental, and specialist care interiors
          across Hong Kong, China, and Singapore. Since 1987, the studio has
          turned clinical workflow into calm, precise space.
        </p>
      </div>
    </section>
  );
}
