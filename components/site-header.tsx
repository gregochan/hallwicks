"use client";

import Image from "next/image";
import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { languages } from "@/lib/i18n";

const links = [
  { href: "#story", key: "story" },
  { href: "#capabilities", key: "capabilities" },
  { href: "#works", key: "works" },
  { href: "#contact", key: "contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const close = () => setOpen(false);

  return (
    <>
      <header className="top-nav" aria-label="Primary navigation">
        <a className="nav-brand" href="#top" aria-label={t.nav.home} onClick={close}>
          HALLWICKS.
        </a>
        <nav className="nav-links" aria-label="Section links">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {t.nav[link.key]}
            </a>
          ))}
        </nav>
        <div className="language-switch" aria-label="Language selector">
          {languages.map((item, index) => (
            <span key={item}>
              <button
                aria-pressed={language === item}
                className={language === item ? "language-active" : undefined}
                onClick={() => setLanguage(item)}
                type="button"
              >
                {item.toUpperCase()}
              </button>
              {index === 0 ? <span aria-hidden="true">|</span> : null}
            </span>
          ))}
        </div>
        <button
          aria-controls="mobile-menu"
          aria-expanded={open}
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          className="menu-toggle"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <Image
          alt=""
          className="nav-ribbon-mark"
          draggable={false}
          height={408}
          priority
          src="/images/brand/hallwicks-mark.png"
          unoptimized
          width={404}
        />
      </header>

      <div className={open ? "mobile-menu mobile-menu-open" : "mobile-menu"} id="mobile-menu">
        <div className="mobile-menu-head">
          <button
            aria-label={t.nav.closeMenu}
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
              <span>{t.nav[link.key]}</span>
            </a>
          ))}
        </nav>
        <div className="mobile-language-switch" aria-label="Language selector">
          {languages.map((item, index) => (
            <span key={item}>
              <button
                aria-pressed={language === item}
                className={language === item ? "language-active" : undefined}
                onClick={() => setLanguage(item)}
                type="button"
              >
                {item.toUpperCase()}
              </button>
              {index === 0 ? <span aria-hidden="true">|</span> : null}
            </span>
          ))}
        </div>
        <a className="mobile-menu-wordmark" href="#top" onClick={close}>
          HALLWICKS.
        </a>
        <Image
          alt=""
          className="mobile-menu-mark"
          draggable={false}
          height={408}
          src="/images/brand/hallwicks-mark.png"
          unoptimized
          width={404}
        />
      </div>
    </>
  );
}
