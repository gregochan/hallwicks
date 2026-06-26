"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useState } from "react";

export function StoryMeshBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <div className="story-mesh-background" aria-hidden="true">
      <div className="story-mesh-fallback" />
      <MeshGradient
        className="story-mesh-shader"
        colors={["#f7fbfa", "#ffffff", "#c9f1ea", "#0bc1a5", "#62aedd", "#b5dcd4"]}
        distortion={0.86}
        swirl={0.34}
        speed={prefersReducedMotion ? 0 : 0.12}
        grainMixer={0}
        grainOverlay={0}
        rotation={18}
        scale={1.18}
        offsetX={0.08}
        offsetY={-0.04}
        minPixelRatio={1}
        maxPixelCount={900000}
      />
      <div className="story-mesh-veil" />
    </div>
  );
}
