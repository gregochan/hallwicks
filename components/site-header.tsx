"use client";

import { useState } from "react";

const links = [
  { href: "#story", label: "Story" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#works", label: "Works" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <header className="top-nav" aria-label="Primary navigation">
        <a className="nav-brand" href="#top" aria-label="Hallwicks home" onClick={close}>
          hallwicks
        </a>
        <nav className="nav-links" aria-label="Section links">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="nav-inquiry" href="mailto:hallwicks@gmail.com">
          <span>Inquiry</span>
          <span aria-hidden="true">+</span>
        </a>
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
        <nav aria-label="Mobile navigation">
          {links.map((link) => (
            <a href={link.href} key={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
          <a href="mailto:hallwicks@gmail.com" onClick={close}>
            Inquiry
          </a>
        </nav>
      </div>
    </>
  );
}
