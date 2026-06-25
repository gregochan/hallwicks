"use client";

import { useEffect, useState } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "label",
  ".capability",
  ".client-logo",
  ".project-card",
].join(",");

export function CursorDot() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const cursor = document.querySelector<HTMLElement>(".cursor-dot");

    if (!cursor) return undefined;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let active = false;
    let frame = 0;

    const updateEnabled = () => {
      setEnabled(media.matches);
      document.documentElement.classList.toggle("custom-cursor", media.matches);
    };

    const animate = () => {
      x += (targetX - x) * 0.28;
      y += (targetY - y) * 0.28;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${active ? 2.1 : 1})`;
      frame = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = "1";
    };

    const onPointerOver = (event: PointerEvent) => {
      active = Boolean((event.target as Element | null)?.closest(INTERACTIVE_SELECTOR));
      cursor.classList.toggle("cursor-dot-active", active);
    };

    const onPointerOut = () => {
      active = false;
      cursor.classList.remove("cursor-dot-active");
    };

    updateEnabled();
    media.addEventListener("change", updateEnabled);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    frame = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      media.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div aria-hidden="true" className={enabled ? "cursor-dot" : "cursor-dot cursor-dot-hidden"} />;
}
