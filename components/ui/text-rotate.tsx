"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { gsap, registerGsapPlugins, SplitText } from "@/lib/animation/gsap";

interface TextRotateProps {
  texts: string[];
  rotationInterval?: number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "words" | "characters" | "lines" | string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number | "random";
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

function getSplitType(splitBy: TextRotateProps["splitBy"]) {
  if (splitBy === "words") return "words";
  if (splitBy === "lines") return "lines";
  return "chars,words";
}

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      rotationInterval = 2000,
      loop = true,
      auto = true,
      splitBy = "characters",
      staggerDuration = 0.012,
      staggerFrom = "last",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
    },
    ref,
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const textRef = useRef<HTMLSpanElement | null>(null);
    const splitRef = useRef<SplitText | null>(null);

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext],
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [currentTextIndex, handleIndexChange, loop, texts.length]);

    const previous = useCallback(() => {
      const previousIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;

      if (previousIndex !== currentTextIndex) {
        handleIndexChange(previousIndex);
      }
    }, [currentTextIndex, handleIndexChange, loop, texts.length]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [currentTextIndex, handleIndexChange, texts.length],
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(
      ref,
      () => ({
        jumpTo,
        next,
        previous,
        reset,
      }),
      [jumpTo, next, previous, reset],
    );

    useEffect(() => {
      if (!auto) return undefined;

      const intervalId = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(intervalId);
    }, [auto, next, rotationInterval]);

    useEffect(() => {
      const container = containerRef.current;
      const text = textRef.current;

      if (!container || !text) return undefined;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      splitRef.current?.revert();
      splitRef.current = null;

      if (reduceMotion) return undefined;

      registerGsapPlugins();

      const split = new SplitText(text, {
        charsClass: cn("text-rotate-char", elementLevelClassName),
        linesClass: cn("text-rotate-word text-rotate-line", splitLevelClassName),
        type: getSplitType(splitBy),
        wordsClass: cn("text-rotate-word", splitLevelClassName),
      });

      splitRef.current = split;

      const targets =
        splitBy === "words"
          ? split.words
          : splitBy === "lines"
            ? split.lines
            : split.chars;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, yPercent: 110 },
        {
          autoAlpha: 1,
          duration: 0.52,
          ease: "power3.out",
          stagger: {
            amount: Math.max(0.001, targets.length * staggerDuration),
            from: staggerFrom,
          },
          yPercent: 0,
        },
      );

      return () => {
        split.revert();
        splitRef.current = null;
      };
    }, [currentTextIndex, elementLevelClassName, splitBy, splitLevelClassName, staggerDuration, staggerFrom]);

    return (
      <span className={cn("text-rotate", mainClassName)} ref={containerRef}>
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <span
          aria-hidden="true"
          className={cn(
            "text-rotate-track",
            splitBy === "lines" && "text-rotate-track-lines",
          )}
          key={currentTextIndex}
          ref={textRef}
        >
          {texts[currentTextIndex]}
        </span>
      </span>
    );
  },
);

TextRotate.displayName = "TextRotate";

export { TextRotate };
