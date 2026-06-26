"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

type Project = {
  title: string;
  meta: string;
  image: string;
  alt: string;
  className: string;
};

function blockImageMenu(event: { preventDefault: () => void }) {
  event.preventDefault();
}

function ProjectCard({
  index,
  project,
}: {
  index: number;
  project: Project;
}) {
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = card?.querySelector<HTMLElement>(".project-image-motion");

    if (!card || !image) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return undefined;

    registerGsapPlugins();

    const context = gsap.context(() => {
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 74 },
        {
          autoAlpha: 1,
          delay: (index % 3) * 0.08,
          duration: 0.78,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 78%",
            once: true,
          },
          y: 0,
        },
      );

      gsap.fromTo(
        image,
        { scale: 1.08, yPercent: 7 },
        {
          ease: "none",
          scale: 1.04,
          scrollTrigger: {
            end: "bottom top",
            scrub: true,
            start: "top bottom",
            trigger: card,
          },
          yPercent: -7,
        },
      );
    }, card);

    return () => context.revert();
  }, [index]);

  return (
    <article
      className={project.className}
      ref={cardRef}
    >
      <div
        className="project-image-wrap protected-image"
        onContextMenu={blockImageMenu}
      >
        <div
          className="project-image-motion"
        >
          <Image
            src={project.image}
            alt={project.alt}
            draggable={false}
            fill
            onContextMenu={blockImageMenu}
            onDragStart={blockImageMenu}
            sizes="(max-width: 980px) 100vw, 66vw"
          />
        </div>
      </div>
      <div className="project-meta">
        <h3>{project.title}</h3>
        <p className="technical-label">{project.meta}</p>
      </div>
    </article>
  );
}

export function WorksGallery({ projects }: { projects: Project[] }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <ProjectCard index={index} key={project.title} project={project} />
      ))}
    </div>
  );
}
