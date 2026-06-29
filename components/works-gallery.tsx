"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useLanguage } from "@/components/language-provider";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";

type Project = {
  title: string;
  meta: string;
  image: string;
  alt: string;
  className: string;
  description?: string;
  images?: {
    alt: string;
    image: string;
  }[];
};

function blockImageMenu(event: { preventDefault: () => void }) {
  event.preventDefault();
}

function ProjectCard({
  index,
  onOpen,
  project,
  viewGallery,
  openGallery,
}: {
  index: number;
  onOpen: () => void;
  project: Project;
  viewGallery: string;
  openGallery: string;
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
      <button
        aria-label={`${openGallery} ${project.title}`}
        className="project-gallery-trigger"
        onClick={onOpen}
        type="button"
      >
        <span className="project-gallery-trigger-text">{viewGallery}</span>
      </button>
      <div
        className="project-image-wrap protected-image"
        onContextMenu={blockImageMenu}
      >
        <div
          className="project-image-motion"
        >
          <img
            src={project.image}
            alt={project.alt}
            draggable={false}
            loading="lazy"
            onContextMenu={blockImageMenu}
            onDragStart={blockImageMenu}
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
  const { t } = useLanguage();
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const activeProject = activeProjectIndex === null ? null : projects[activeProjectIndex];
  const activeImages = useMemo(() => {
    if (!activeProject) return [];

    return activeProject.images?.length
      ? activeProject.images
      : [{ alt: activeProject.alt, image: activeProject.image }];
  }, [activeProject]);

  useEffect(() => {
    window.queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!activeProject) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProjectIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveImageIndex((value) => (value + 1) % activeImages.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveImageIndex((value) => (value - 1 + activeImages.length) % activeImages.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeImages.length, activeProject]);

  const openProject = (index: number) => {
    setActiveProjectIndex(index);
    setActiveImageIndex(0);
  };

  const closeProject = () => {
    setActiveProjectIndex(null);
    setActiveImageIndex(0);
  };

  return (
    <>
      <div className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard
            index={index}
            key={project.title}
            onOpen={() => openProject(index)}
            project={project}
            openGallery={t.works.openGallery}
            viewGallery={t.works.viewGallery}
          />
        ))}
      </div>

      {mounted && activeProject ? createPortal(
        <div
          aria-modal="true"
          className="project-lightbox"
          onClick={closeProject}
          role="dialog"
        >
          <button
            aria-label={t.works.closeGallery}
            className="project-lightbox-close"
            onClick={closeProject}
            type="button"
          >
            {t.works.closeGallery}
          </button>
          <div className="project-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="project-lightbox-media protected-image" onContextMenu={blockImageMenu}>
              <img
                src={activeImages[activeImageIndex].image}
                alt={activeImages[activeImageIndex].alt}
                draggable={false}
                loading="eager"
                onContextMenu={blockImageMenu}
                onDragStart={blockImageMenu}
              />
            </div>
            <div className="project-lightbox-meta">
              <div>
                <p className="technical-label">{activeProject.meta}</p>
                <h3>{activeProject.title}</h3>
                {activeProject.description ? <p>{activeProject.description}</p> : null}
              </div>
              <div className="project-lightbox-controls">
                <button
                  disabled={activeImages.length <= 1}
                  onClick={() => setActiveImageIndex((value) => (value - 1 + activeImages.length) % activeImages.length)}
                  type="button"
                >
                  {t.works.previous}
                </button>
                <span>{activeImageIndex + 1} / {activeImages.length}</span>
                <button
                  disabled={activeImages.length <= 1}
                  onClick={() => setActiveImageIndex((value) => (value + 1) % activeImages.length)}
                  type="button"
                >
                  {t.works.next}
                </button>
              </div>
              {activeImages.length > 1 ? (
                <div className="project-lightbox-thumbs">
                  {activeImages.map((image, index) => (
                    <button
                      aria-label={`${t.works.showImage} ${index + 1}`}
                      aria-pressed={index === activeImageIndex}
                      key={`${image.image}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      type="button"
                    >
                      <img src={image.image} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
