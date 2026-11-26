import { useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip);

export { gsap, useGSAP, ScrollTrigger, SplitText, Flip };

/** Media queries used with gsap.matchMedia() across the page. */
export const MQ = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023px)',
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export const NAV_OFFSET = 72;

let lenis: Lenis | null = null;

/**
 * Lenis smooth scrolling synced to GSAP's ticker so ScrollTrigger and Lenis
 * share one RAF loop (the pattern recommended in the Lenis + GSAP docs).
 * Skipped entirely for users who prefer reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenis = instance;

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Images and fonts change layout after mount; re-measure triggers.
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 1800);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      lenis = null;
    };
  }, []);
}

/** Smooth-scroll to a section id, using Lenis when active. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export const formatINR = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
