"use client";

import Image from "next/image";

import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import { TextRotate } from "@/components/ui/text-rotate";

const heroImages = [
  {
    src: "/images/project-shanghai-center.png",
    alt: "Minimal dental treatment suite with black framed glazing",
    label: "dental clinic // 1,000 sqm",
    className: "hero-float hero-float-primary",
    depth: 1.2,
    sizes: "(max-width: 980px) 62vw, 28vw",
    priority: true,
  },
  {
    src: "/images/project-st-george.png",
    alt: "Specialist medical reception and consultation corridor",
    label: "medical center // hong kong",
    className: "hero-float hero-float-left",
    depth: -0.7,
    sizes: "(max-width: 980px) 42vw, 18vw",
  },
  {
    src: "/images/hero-clinical-intersection.png",
    alt: "Clinical interior intersection with glass treatment room",
    label: "workflow // planning",
    className: "hero-float hero-float-bottom",
    depth: 0.55,
    sizes: "(max-width: 980px) 54vw, 27vw",
  },
  {
    src: "/images/project-k11-veterinary.png",
    alt: "Veterinary healthcare interior with stainless treatment counter",
    label: "veterinary hospital // durable care",
    className: "hero-float hero-float-small",
    depth: -1.1,
    sizes: "(max-width: 980px) 34vw, 15vw",
  },
];

export function HeroParallax() {
  return (
    <section className="hero hero-parallax" aria-labelledby="hero-title">
      <Floating sensitivity={-0.48} className="hero-floating">
        {heroImages.map((image) => (
          <FloatingElement
            className={image.className}
            depth={image.depth}
            key={image.src}
          >
            <figure className="hero-float-card">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={image.priority}
                sizes={image.sizes}
              />
              <figcaption className="technical-label">{image.label}</figcaption>
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
          est. 1987 // hk + sg + prc
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
          <span>of care,</span>
          <span>precision, and space.</span>
        </h1>
        <p className="hero-copy">
          Hallwicks creates medical, dental, and specialist care interiors
          across Hong Kong, Singapore, and PRC. Since 1987, the studio has
          turned clinical workflow into calm, precise space.
        </p>
      </div>
    </section>
  );
}
