import Image from "next/image";

import { HeroParallax } from "@/components/hero-parallax";

const capabilities = [
  {
    number: "01",
    title: "Space Planning",
    copy: "Functional zoning, clinical adjacencies, circulation, and sterile workflow planning for specialist environments.",
  },
  {
    number: "02",
    title: "Project Management",
    copy: "Consultant coordination, programme control, procurement alignment, and execution discipline from brief to handover.",
  },
  {
    number: "03",
    title: "Cost Analysis",
    copy: "Early-stage budgeting, specification control, and value planning calibrated to healthcare-grade requirements.",
  },
  {
    number: "04",
    title: "On-Site Management",
    copy: "Field supervision, installation sequencing, and detail control for highly serviced medical fit-outs.",
  },
  {
    number: "05",
    title: "Interior Design",
    copy: "Precise interior architecture, custom joinery, lighting, finishes, and furniture systems for care settings.",
  },
  {
    number: "06",
    title: "Brand Experience",
    copy: "Spatial identity systems that translate a clinical brand into reception, treatment, and consultation spaces.",
  },
];

const environments = [
  ["medical centers", "specialist reception, consultation, imaging, and treatment suites"],
  ["dental clinics", "operatories, sterilization flows, laboratory support, and patient-facing touchpoints"],
  ["veterinary hospitals", "durable healthcare interiors for treatment, waiting, prep, and recovery zones"],
];

const projects = [
  {
    title: "Shanghai Center",
    meta: "medical + dental // 2019 // 1,000 sqm",
    image: "/images/project-shanghai-center.png",
    alt: "Minimal dental suite with black framed glazing and clinical lighting",
    className: "project-card project-card-large",
  },
  {
    title: "St. George Medical Center",
    meta: "hong kong // specialist clinic // 2019",
    image: "/images/project-st-george.png",
    alt: "Minimal medical reception and corridor with black structural details",
    className: "project-card project-card-tall",
  },
  {
    title: "Clinic A at K11",
    meta: "tst // dental + healthcare // 800 sqm",
    image: "/images/project-k11-veterinary.png",
    alt: "Clinical healthcare interior with stainless steel work surface and black door frames",
    className: "project-card project-card-square",
  },
];

export default function Home() {
  return (
    <>
      <header className="top-nav" aria-label="Primary navigation">
        <a className="nav-brand" href="#top" aria-label="Hallwicks home">
          hallwicks
        </a>
        <nav className="nav-links" aria-label="Section links">
          <a href="#story">story__</a>
          <a href="#capabilities">capabilities__</a>
          <a href="#works">works__</a>
          <a href="#contact">contact__</a>
        </nav>
        <a className="nav-inquiry" href="mailto:hallwicks@gmail.com">
          <span>inquiry</span>
          <span aria-hidden="true">+</span>
        </a>
      </header>

      <main id="top">
        <HeroParallax />

        <section className="story-section section-grid" id="story" aria-labelledby="story-title">
          <div className="section-marker">
            <p className="technical-label">01 // our story</p>
            <div aria-hidden="true" />
          </div>
          <div className="story-copy">
            <h2 id="story-title">
              Designed for care environments where precision is operational.
            </h2>
            <p>
              Hallwicks Design Limited has spent nearly four decades developing
              focused design capability for medical and dental clinics across
              Hong Kong, Singapore, and PRC.
            </p>
            <p>
              The studio works closely with clients to translate clinical
              workflow, brand image, budget, and patient experience into
              bespoke interiors that feel calm, exacting, and enduring.
            </p>
          </div>
          <aside className="stats-panel" aria-label="Hallwicks facts">
            <div>
              <span className="technical-label">founded</span>
              <strong>1987</strong>
            </div>
            <div>
              <span className="technical-label">experience</span>
              <strong>38 yrs</strong>
            </div>
            <div>
              <span className="technical-label">regions</span>
              <strong>hk.sg.prc</strong>
            </div>
          </aside>
        </section>

        <section
          className="capabilities-section"
          id="capabilities"
          aria-labelledby="capabilities-title"
        >
          <div className="section-grid capabilities-intro">
            <div className="section-marker">
              <p className="technical-label">02 // capabilities</p>
              <div aria-hidden="true" />
            </div>
            <h2 id="capabilities-title">One-stop clinical design intelligence.</h2>
            <p>
              From spatial strategy to the last site detail, Hallwicks connects
              technical planning with minimalist interior expression.
            </p>
          </div>
          <div className="capability-grid" aria-label="Core capabilities">
            {capabilities.map((item) => (
              <article className="capability" key={item.number}>
                <div className="capability-top">
                  <span aria-hidden="true">+</span>
                  <span className="technical-label">{item.number}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="environments-section section-grid" aria-labelledby="env-title">
          <div className="section-marker">
            <p className="technical-label">03 // environments</p>
            <div aria-hidden="true" />
          </div>
          <h2 id="env-title">Specialized environments, exact requirements.</h2>
          <div className="environment-list">
            {environments.map(([title, copy]) => (
              <article className="environment-item" key={title}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="works-section" id="works" aria-labelledby="works-title">
          <div className="works-heading">
            <div>
              <p className="technical-label">04 // selected works</p>
              <h2 id="works-title">Featured works.</h2>
            </div>
            <a className="text-trigger" href="mailto:hallwicks@gmail.com">
              <span>request portfolio</span>
              <span aria-hidden="true">+</span>
            </a>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article className={project.className} key={project.title}>
                <div className="project-image-wrap">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 980px) 100vw, 66vw"
                  />
                  <span className="project-index technical-label">hdl</span>
                </div>
                <div className="project-meta">
                  <h3>{project.title}</h3>
                  <p className="technical-label">{project.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="contact-copy">
            <p className="technical-label">05 // inquiry</p>
            <h2 id="contact-title">Let&apos;s talk.</h2>
            <p>
              Start a conversation about a clinic, medical center, dental suite,
              or healthcare environment that needs disciplined design thinking.
            </p>
            <a className="contact-link" href="mailto:hallwicks@gmail.com">
              hallwicks@gmail.com
            </a>
          </div>
          <form
            className="contact-form"
            action="mailto:hallwicks@gmail.com"
            method="post"
            encType="text/plain"
          >
            <label>
              <span>name</span>
              <input name="name" autoComplete="name" />
            </label>
            <label>
              <span>email</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label>
              <span>project type</span>
              <input name="project-type" />
            </label>
            <label>
              <span>message</span>
              <textarea name="message" rows={4} />
            </label>
            <button type="submit">
              <span>submit inquiry</span>
              <span aria-hidden="true">+</span>
            </button>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p className="footer-brand">hallwicks</p>
        <p className="technical-label">hallwicks design limited // © 2026</p>
        <div className="footer-links">
          <a href="#story">history</a>
          <a href="#capabilities">services</a>
          <a href="#works">projects</a>
          <a href="mailto:hallwicks@gmail.com">email</a>
        </div>
      </footer>
    </>
  );
}
