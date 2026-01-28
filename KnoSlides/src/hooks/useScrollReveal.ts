/**
 * useScrollReveal Hook
 * 
 * Detects when an element enters the viewport for scroll-triggered animations.
 */

import { useState, useEffect, useRef, RefObject } from 'react';

export interface ScrollRevealOptions {
  /** Threshold for intersection (0-1) */
  threshold?: number;
  /** Root margin for intersection */
  rootMargin?: string;
  /** Only trigger once */
  once?: boolean;
  /** Delay before marking as revealed (ms) */
  delay?: number;
}

export interface ScrollRevealState {
  /** Ref to attach to the element */
  ref: RefObject<HTMLDivElement>;
  /** Whether the element is in view */
  isInView: boolean;
  /** Whether the element has been revealed (for once: true) */
  hasRevealed: boolean;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}): ScrollRevealState => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    once = true,
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already revealed and once is true, don't observe
    if (hasRevealed && once) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true);
                setHasRevealed(true);
              }, delay);
            } else {
              setIsInView(true);
              setHasRevealed(true);
            }
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once, delay, hasRevealed]);

  return { ref, isInView, hasRevealed };
};

export default useScrollReveal;
