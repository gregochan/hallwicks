"use client";

import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsapPlugins() {
  if (registered) return;

  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
  registered = true;
}

export { Flip, gsap, ScrollTrigger, SplitText };
