"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

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
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [42, -34]);
  const imageScale = useTransform(scrollYProgress, [0, 0.55, 1], [1.08, 1, 1.06]);

  return (
    <motion.article
      className={project.className}
      initial={reduceMotion ? false : { opacity: 0, y: 74 }}
      ref={cardRef}
      transition={{
        delay: (index % 3) * 0.08,
        duration: 0.78,
        ease: [0.16, 1, 0.3, 1],
      }}
      viewport={{ amount: 0.22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div
        className="project-image-wrap protected-image"
        onContextMenu={blockImageMenu}
      >
        <motion.div
          className="project-image-motion"
          style={{
            scale: reduceMotion ? 1 : imageScale,
            y: reduceMotion ? 0 : imageY,
          }}
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
        </motion.div>
        <span className="project-index technical-label">HDL</span>
      </div>
      <div className="project-meta">
        <h3>{project.title}</h3>
        <p className="technical-label">{project.meta}</p>
      </div>
    </motion.article>
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
