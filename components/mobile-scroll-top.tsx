"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/components/language-provider";

export function MobileScrollTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.35);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      aria-label={t.scrollTop}
      className={visible ? "scroll-top scroll-top-visible" : "scroll-top"}
      href="#top"
    >
      ↑
    </a>
  );
}
