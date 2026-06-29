"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

export function StoryMeshBackground() {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shaderOffset, setShaderOffset] = useState({ x: 0.02, y: -0.02 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const background = backgroundRef.current;
    if (!background) return undefined;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const bounds = background.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const clampedX = Math.min(1, Math.max(0, x));
        const clampedY = Math.min(1, Math.max(0, y));

        background.style.setProperty("--mesh-x", `${clampedX * 100}%`);
        background.style.setProperty("--mesh-y", `${clampedY * 100}%`);
        setShaderOffset({
          x: (clampedX - 0.5) * 0.18,
          y: (clampedY - 0.5) * 0.12,
        });

        frameRef.current = null;
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div className="story-mesh-background" aria-hidden="true" ref={backgroundRef}>
      <div className="story-mesh-fallback" />
      <MeshGradient
        className="story-mesh-shader"
        colors={["#042421", "#073a35", "#0b6358", "#0bc1a5", "#0a464b", "#b8f2e6"]}
        distortion={0.96}
        swirl={0.34}
        speed={prefersReducedMotion ? 0 : 0.08}
        grainMixer={0}
        grainOverlay={0}
        rotation={22}
        scale={1.2}
        offsetX={shaderOffset.x}
        offsetY={shaderOffset.y}
        minPixelRatio={1}
        maxPixelCount={900000}
      />
      <div className="story-mesh-veil" />
    </div>
  );
}
