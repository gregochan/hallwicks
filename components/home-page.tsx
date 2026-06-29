"use client";

import type { FormEvent } from "react";

import { ClientLogoGrid } from "@/components/client-logo-grid";
import { CursorDot } from "@/components/cursor-dot";
import { HeroParallax } from "@/components/hero-parallax";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { MobileScrollTop } from "@/components/mobile-scroll-top";
import { RevealSection } from "@/components/reveal-section";
import { SiteHeader } from "@/components/site-header";
import { StoryStats } from "@/components/story-stats";
import { StoryMeshBackground } from "@/components/ui/story-mesh-background";
import { WorksGallery } from "@/components/works-gallery";
import type { SiteContent } from "@/lib/content/types";
import { localizeCapability, localizeEnvironment, localizeProject } from "@/lib/i18n";

function ServiceIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    strokeWidth: 2,
  };

  return (
    <svg className="service-icon" viewBox="0 0 48 48" aria-hidden="true">
      {name === "planning" && (
        <>
          <circle cx="24" cy="12" r="5" {...common} />
          <path d="M24 3v4M24 17v4M14 42l10-21 10 21M18 31h12" {...common} />
        </>
      )}
      {name === "management" && (
        <>
          <path d="M8 10h12v12H8zM28 6h12v12H28zM28 28h12v12H28z" {...common} />
          <path d="M20 16h8M34 18v10M20 22l8 8" {...common} />
        </>
      )}
      {name === "analysis" && (
        <>
          <path d="M10 8h28v32H10z" {...common} />
          <path d="M17 33V24M24 33V16M31 33V27" {...common} />
          <path d="M16 39h18" {...common} />
        </>
      )}
      {name === "site" && (
        <>
          <path d="M13 38c1-8 21-8 22 0H13z" {...common} />
          <path d="M19 20c0 6 10 6 10 0" {...common} />
          <path d="M18 19h12l-2-7h-8l-2 7zM14 16h20" {...common} />
          <path d="M34 11l3-3M36 18h5M34 25l4 4" {...common} />
          <path d="M38 12l3 3M39 22l3-3" {...common} />
        </>
      )}
      {name === "interior" && (
        <>
          <path d="M12 24h24c3 0 5 2 5 5v6H7v-6c0-3 2-5 5-5z" {...common} />
          <path d="M12 24v-7c0-4 3-7 7-7h10c4 0 7 3 7 7v7" {...common} />
          <path d="M10 35v6M38 35v6" {...common} />
        </>
      )}
      {name === "brand" && (
        <>
          <path d="M10 14h28v20H10z" {...common} />
          <path d="M18 24h12M18 25h12" {...common} />
          <path d="M14 38h20" {...common} />
        </>
      )}
    </svg>
  );
}

function EnvironmentIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "square" as const,
    strokeLinejoin: "miter" as const,
    strokeWidth: 2,
  };

  return (
    <svg className="environment-icon" viewBox="0 0 48 48" aria-hidden="true">
      {name === "medical" && (
        <>
          <path d="M8 12h32v28H8z" {...common} />
          <path d="M24 18v16M16 26h16M14 8h20" {...common} />
        </>
      )}
      {name === "procedure" && (
        <>
          <path d="M8 16h32v18H8z" {...common} />
          <path d="M14 16v-5h20v5M14 34v5h20v-5" {...common} />
          <path d="M17 25h14M24 18v14" {...common} />
        </>
      )}
      {name === "lab" && (
        <>
          <path d="M18 8h12M21 8v11L12 36c-1 2 0 4 3 4h18c3 0 4-2 3-4l-9-17V8" {...common} />
          <path d="M17 31h14" {...common} />
        </>
      )}
      {name === "dental" && (
        <>
          <path d="M16 8c-5 3-6 11-3 17l5 13 4-10h4l4 10 5-13c3-6 2-14-3-17-3-2-6-1-8 1-2-2-5-3-8-1z" {...common} />
          <path d="M18 17h12" {...common} />
        </>
      )}
      {name === "veterinary" && (
        <>
          <circle cx="15" cy="16" r="4" {...common} />
          <circle cx="25" cy="12" r="4" {...common} />
          <circle cx="34" cy="18" r="4" {...common} />
          <circle cx="20" cy="28" r="4" {...common} />
          <path d="M17 39c-3-7 3-13 8-13s11 6 8 13H17z" {...common} />
        </>
      )}
    </svg>
  );
}

function HomePageContent({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage();
  const capabilities = content.capabilities.map((item) => localizeCapability(item, language));
  const environments = content.environments.map((item) => localizeEnvironment(item, language));
  const projects = content.projects.map((project) => localizeProject(project, language));

  const handleInquirySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const projectType = String(data.get("project-type") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`Hallwicks inquiry${projectType ? ` // ${projectType}` : ""}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:hallwicks@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <SiteHeader />

      <main id="top">
        <HeroParallax />

        <RevealSection className="story-section section-stack" id="story" aria-labelledby="story-title">
          <StoryMeshBackground />
          <div className="section-heading-block">
            <p className="technical-label">{t.story.label}</p>
            <div aria-hidden="true" />
            <h2 id="story-title">{t.story.title}</h2>
          </div>
          <div className="story-content-grid">
            <div className="story-copy">
              {t.story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <StoryStats />
          </div>
        </RevealSection>

        <RevealSection
          className="capabilities-section"
          id="capabilities"
          aria-labelledby="capabilities-title"
        >
          <div className="section-stack capabilities-intro">
            <div className="section-heading-block">
              <p className="technical-label">{t.capabilities.label}</p>
              <div aria-hidden="true" />
              <h2 id="capabilities-title">{t.capabilities.title}</h2>
            </div>
            <p>{t.capabilities.intro}</p>
          </div>
          <div className="capability-grid" aria-label="Core capabilities">
            {capabilities.map((item) => (
              <article className="capability" key={item.number}>
                <div className="capability-top">
                  <ServiceIcon name={item.icon} />
                  <span className="technical-label">{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="environments-section section-stack" aria-labelledby="env-title">
          <div className="section-heading-block">
            <p className="technical-label">{t.environments.label}</p>
            <div aria-hidden="true" />
            <h2 id="env-title">{t.environments.title}</h2>
          </div>
          <div className="environment-list">
            {environments.map((environment) => (
              <article className="environment-item" key={environment.title}>
                <EnvironmentIcon name={environment.icon} />
                <h3>{environment.title}</h3>
                <p>{environment.copy}</p>
              </article>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="client-section section-stack" aria-labelledby="client-title">
          <div className="section-heading-block">
            <p className="technical-label">{t.clients.label}</p>
            <div aria-hidden="true" />
            <h2 id="client-title">{t.clients.title}</h2>
          </div>
          <ClientLogoGrid clients={content.clients} columns={content.settings?.logoColumns} />
        </RevealSection>

        <RevealSection className="works-section" id="works" aria-labelledby="works-title">
          <div className="works-heading">
            <div>
              <p className="technical-label">{t.works.label}</p>
              <h2 id="works-title">{t.works.title}</h2>
            </div>
          </div>
          <WorksGallery projects={projects} />
        </RevealSection>

        <RevealSection className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-copy">
            <p className="technical-label">{t.contact.label}</p>
            <h2 id="contact-title">{t.contact.title}</h2>
            <p>{t.contact.copy}</p>
            <a className="contact-link" href="mailto:hallwicks@gmail.com">
              hallwicks@gmail.com
            </a>
          </div>
          <form
            className="contact-form"
            onSubmit={handleInquirySubmit}
          >
            <label>
              <span>{t.contact.name}</span>
              <input name="name" autoComplete="name" />
            </label>
            <label>
              <span>{t.contact.email}</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label>
              <span>{t.contact.projectType}</span>
              <input name="project-type" />
            </label>
            <label>
              <span>{t.contact.message}</span>
              <textarea name="message" rows={4} />
            </label>
            <button type="submit">
              <span>{t.contact.submit}</span>
              <span aria-hidden="true">+</span>
            </button>
          </form>
        </RevealSection>
      </main>

      <footer className="site-footer">
        <p className="footer-brand">hallwicks</p>
        <p className="technical-label">{t.footer.legal}</p>
        <div className="footer-links">
          <a href="#story">{t.footer.history}</a>
          <a href="#capabilities">{t.footer.services}</a>
          <a href="#works">{t.footer.projects}</a>
          <a href="mailto:hallwicks@gmail.com">{t.footer.email}</a>
        </div>
      </footer>
      <MobileScrollTop />
      <CursorDot />
    </>
  );
}

export function HomePage({ content }: { content: SiteContent }) {
  return (
    <LanguageProvider>
      <HomePageContent content={content} />
    </LanguageProvider>
  );
}
