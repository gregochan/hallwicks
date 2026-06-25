"use client";

import { useEffect, useState } from "react";

export function MobileScrollTop() {
  const [visible, setVisible] = useState(false);

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
      aria-label="Scroll to top"
      className={visible ? "scroll-top scroll-top-visible" : "scroll-top"}
      href="#top"
    >
      ↑
    </a>
  );
}
