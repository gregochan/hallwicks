"use client";

import Image from "next/image";
import { useState } from "react";
import type { CSSProperties } from "react";

const links = [
  { href: "#story", label: "Story" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#works", label: "Works" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const glassStyle = {
    backdropFilter: "blur(24px) saturate(1.62)",
    WebkitBackdropFilter: "blur(24px) saturate(1.62)",
  } satisfies CSSProperties;

  return (
    <>
      <header className="top-nav" aria-label="Primary navigation" style={glassStyle}>
        <a className="nav-brand" href="#top" aria-label="Hallwicks home" onClick={close}>
          HALLWICKS.
        </a>
        <nav className="nav-links" aria-label="Section links">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="menu-toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      <div className={open ? "mobile-menu mobile-menu-open" : "mobile-menu"} id="mobile-menu">
        <div className="mobile-menu-head">
          <button
            aria-label="Close menu"
            className="mobile-menu-close"
            onClick={close}
            type="button"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={close}>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <a className="mobile-menu-wordmark" href="#top" onClick={close}>
          HALLWICKS.
        </a>
        <Image
          alt=""
          className="mobile-menu-mark"
          draggable={false}
          height={408}
          src="/images/brand/hallwicks-mark.png"
          width={404}
        />
      </div>
    </>
  );
}
