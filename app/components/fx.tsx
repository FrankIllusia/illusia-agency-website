'use client';

/* ── Scroll FX primitives ─────────────────────────────────────────────────────
   Scroll-reveal building blocks, ported from the Charlie's Horse `fx.tsx` but
   rebuilt on GSAP/ScrollTrigger — this site already pins with ScrollTrigger
   (Hero, LogoParallax), so a second animation runtime would just fight it.

   These are presentation-neutral on purpose: every wrapper is a plain block
   that inherits layout from its parent, so dropping one around existing markup
   animates it without moving it. Nothing here sets colour, size, or spacing.

   Smooth scrolling is Lenis rather than GSAP's ScrollSmoother: ScrollSmoother
   transforms a wrapper element, and `position: sticky` (Hero, LogoParallax,
   .work-sticky) does not survive a transformed ancestor. Lenis drives real
   scroll position, so sticky keeps working.
──────────────────────────────────────────────────────────────────────────── */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* useLayoutEffect warns during SSR; on the client we want pre-paint so the
   "hidden" starting state is never visible as a flash. */
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const EASE = 'power3.out'; // ≈ cubic-bezier(.16,1,.3,1), the Charlie's Horse feel

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Lenis singleton ──────────────────────────────────────────────────────────
   Nav needs to scroll to sections, and native scrollIntoView fights Lenis for
   control of scroll position. Nav reads this instead.
──────────────────────────────────────────────────────────────────────────── */
let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Scroll to an element through Lenis, falling back to native when it is off. */
export function scrollToEl(el: Element) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el as HTMLElement, { duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

/* ── SmoothScroll ─────────────────────────────────────────────────────────────
   Renders no DOM of its own — Lenis drives window scroll, so there is no
   wrapper to disturb the existing layout. Mount once, in the root layout.
──────────────────────────────────────────────────────────────────────────── */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.05,
      // Native smooth scrolling on touch feels better than an emulated one.
      syncTouch: false,
    });
    lenisInstance = lenis;

    // Drive Lenis from GSAP's ticker so both run on one rAF loop, and let
    // ScrollTrigger recompute on every Lenis frame or pinned sections drift.
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}

/* ── Reveal ───────────────────────────────────────────────────────────────────
   Fade + rise as the element enters. With `stagger`, the element's own direct
   children are revealed in sequence instead of the element as a whole — that
   is the card-grid case (Work, Services, Team, Clients).
──────────────────────────────────────────────────────────────────────────── */
export function Reveal({
  children,
  y = 64,
  delay = 0,
  duration = 1.05,
  stagger,
  // Fires a little later than the usual 88% so the movement happens while the
  // element is on screen rather than finishing just as it clears the fold.
  start = 'top 82%',
  className,
  style,
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  duration?: number;
  /** Stagger the direct children instead of the wrapper, in seconds. */
  stagger?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets: Element[] =
      stagger != null ? Array.from(el.children) : [el];
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: EASE,
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start, once: true },
          // Drop the inline transform/visibility so hover states and any
          // existing transforms on these nodes are not left overridden.
          clearProps: 'transform,visibility,opacity',
        }
      );
    }, el);

    return () => ctx.revert();
  }, [y, delay, duration, stagger, start]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ── RiseIn ───────────────────────────────────────────────────────────────────
   Headline lines rise out from behind a mask. SplitText's `mask: 'lines'` adds
   the clipping wrapper, and autoSplit re-splits on resize/font swap so the
   mask never cuts the wrong place.
──────────────────────────────────────────────────────────────────────────── */
export function RiseIn({
  children,
  delay = 0,
  stagger = 0.12,
  duration = 1.15,
  start = 'top 84%',
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'fx-line',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration,
            delay,
            ease: EASE,
            stagger,
            scrollTrigger: { trigger: el, start, once: true },
          }),
      });
      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, [delay, stagger, duration, start]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ── ScrubText ────────────────────────────────────────────────────────────────
   Words start dim and light up one by one as the block travels the viewport.
   Tied to scroll position (scrub), not fired once — scrolling back up unlights
   them again.
──────────────────────────────────────────────────────────────────────────── */
export function ScrubText({
  children,
  from = 0.16,
  start = 'top 85%',
  end = 'bottom 55%',
  className,
  style,
}: {
  children: ReactNode;
  /** Resting opacity of a word before it lights up. */
  from?: number;
  start?: string;
  end?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, {
        type: 'words',
        wordsClass: 'fx-word',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: from },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.4,
              scrollTrigger: { trigger: el, start, end, scrub: true },
            }
          ),
      });
      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, [from, start, end]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ── ParallaxY ────────────────────────────────────────────────────────────────
   Drifts vertically against the page as it crosses the viewport. Keep `offset`
   modest — this sits inside cropped/rounded containers, and a large value
   exposes the container edge.
──────────────────────────────────────────────────────────────────────────── */
export function ParallaxY({
  children,
  offset = 60,
  className,
  style,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: offset },
        {
          y: -offset,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [offset]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
