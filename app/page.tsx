import { ExperienceYears } from "@/components/experience-years";
import { HeroParallax } from "@/components/hero-parallax";
import { WorksGallery } from "@/components/works-gallery";

const capabilities = [
  {
    number: "01",
    icon: "planning",
    title: "Space Planning",
    copy: "Functional zoning, clinical adjacencies, circulation, and sterile workflow planning for specialist environments.",
  },
  {
    number: "02",
    icon: "management",
    title: "Project Management",
    copy: "Consultant coordination, programme control, procurement alignment, and execution discipline from brief to handover.",
  },
  {
    number: "03",
    icon: "analysis",
    title: "Cost Analysis",
    copy: "Early-stage budgeting, specification control, and value planning calibrated to healthcare-grade requirements.",
  },
  {
    number: "04",
    icon: "site",
    title: "On-Site Management",
    copy: "Field supervision, installation sequencing, and detail control for highly serviced medical fit-outs.",
  },
  {
    number: "05",
    icon: "interior",
    title: "Interior Design",
    copy: "Precise interior architecture, custom joinery, lighting, finishes, and furniture systems for care settings.",
  },
  {
    number: "06",
    icon: "brand",
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
    title: "Great People Branemark Center",
    meta: "Shanghai, China // Dental Center // 2019",
    image: "/images/projects/great-people-shanghai-02.png",
    alt: "Great People Shanghai dental center interior",
    className: "project-card project-card-large",
  },
  {
    title: "St. George Medical Center",
    meta: "Hong Kong // Specialist Clinic // 2019",
    image: "/images/projects/st-george-01.png",
    alt: "Minimal medical reception and corridor with black structural details",
    className: "project-card project-card-tall",
  },
  {
    title: "Conch Hospital",
    meta: "Anhui, China // Dental Department // 2019",
    image: "/images/projects/conch-hospital.png",
    alt: "Conch Hospital dental department interior",
    className: "project-card project-card-square",
  },
  {
    title: "Clinic A K11 TST",
    meta: "Hong Kong // Dental Clinic // 2019",
    image: "/images/projects/clinic-a.png",
    alt: "Clinic A at K11 dental clinic interior",
    className: "project-card project-card-wide",
  },
  {
    title: "Clinic A Dental Section",
    meta: "Hong Kong // Clinical Interior // 2019",
    image: "/images/projects/clinic-a-03.png",
    alt: "Clinic A dental section detail",
    className: "project-card project-card-small",
  },
  {
    title: "Langham Place Orthodontics",
    meta: "Kowloon, Hong Kong // Orthodontics Centre // 2019",
    image: "/images/projects/langham-place.png",
    alt: "Langham Place orthodontics centre",
    className: "project-card project-card-tall",
  },
  {
    title: "Varios Dental Clinic",
    meta: "Hong Kong // Dental Clinic",
    image: "/images/projects/varios-dental.png",
    alt: "Varios Dental Clinic interior",
    className: "project-card project-card-small",
  },
  {
    title: "VSH Wanchai MRI",
    meta: "Hong Kong // Veterinary Hospital // MRI Suite",
    image: "/images/projects/vsh-mri.png",
    alt: "VSH Wanchai MRI suite interior",
    className: "project-card project-card-tall",
  },
  {
    title: "Monnis Restaurant",
    meta: "Mongolia // Hospitality // 2016",
    image: "/images/projects/monnis-restaurant.png",
    alt: "Monnis Restaurant interior",
    className: "project-card project-card-tall",
  },
  {
    title: "Private Residence",
    meta: "Residential // Interior Design",
    image: "/images/projects/residential.png",
    alt: "Private residence interior",
    className: "project-card project-card-small",
  },
];

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

export default function Home() {
  return (
    <>
      <header className="top-nav" aria-label="Primary navigation">
        <a className="nav-brand" href="#top" aria-label="Hallwicks home">
          hallwicks
        </a>
        <nav className="nav-links" aria-label="Section links">
          <a href="#story">Story</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#works">Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-inquiry" href="mailto:hallwicks@gmail.com">
          <span>Inquiry</span>
          <span aria-hidden="true">+</span>
        </a>
      </header>

      <main id="top">
        <HeroParallax />

        <section className="story-section section-stack" id="story" aria-labelledby="story-title">
          <div className="section-heading-block">
            <p className="technical-label">01 // our story</p>
            <div aria-hidden="true" />
            <h2 id="story-title">
              Designed for care environments where precision is operational.
            </h2>
          </div>
          <div className="story-content-grid">
            <div className="story-copy">
              <p>
                Hallwicks Design Limited has spent nearly four decades developing
                focused design capability for medical and dental clinics across
                Hong Kong, China, and Singapore.
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
                <ExperienceYears />
              </div>
              <div>
                <span className="technical-label">regions</span>
                <strong>HK.China.SG</strong>
              </div>
            </aside>
          </div>
        </section>

        <section
          className="capabilities-section"
          id="capabilities"
          aria-labelledby="capabilities-title"
        >
          <div className="section-stack capabilities-intro">
            <div className="section-heading-block">
              <p className="technical-label">02 // capabilities</p>
              <div aria-hidden="true" />
              <h2 id="capabilities-title">One-stop clinical design intelligence.</h2>
            </div>
            <p>
              From spatial strategy to the last site detail, Hallwicks connects
              technical planning with minimalist interior expression.
            </p>
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
        </section>

        <section className="environments-section section-stack" aria-labelledby="env-title">
          <div className="section-heading-block">
            <p className="technical-label">03 // environments</p>
            <div aria-hidden="true" />
            <h2 id="env-title">Specialized environments, exact requirements.</h2>
          </div>
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
          <WorksGallery projects={projects} />
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
