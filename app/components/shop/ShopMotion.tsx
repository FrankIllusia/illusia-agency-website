'use client';

/* ── Shop motion ──────────────────────────────────────────────────────────────
   The scroll language from the Joby-style template (flagpole-site) and Shore
   Reply — hero that parallaxes and fades as you leave it, a rail that pins and
   travels sideways with a progress bar, photography drifting inside its crop,
   magnetic CTAs — rebuilt on GSAP/ScrollTrigger so it shares one runtime (and
   the Lenis loop in `fx.tsx`) with the rest of the site. Those sites use
   framer-motion; pulling that in here would mean two animation engines
   fighting over the same scroll position.

   Presentation-neutral like `fx.tsx`: nothing here sets colour or type, so the
   shop keeps its own look and only gains movement.
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
import { prefersReducedMotion } from '../fx';

gsap.registerPlugin(ScrollTrigger, SplitText);

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/* ── HeroScroll ───────────────────────────────────────────────────────────────
   As the hero scrolls away the photo sinks and swells slightly while the copy
   drifts down faster and fades — the depth effect both reference heroes use
   (image y 18% / scale 1.12, copy y 40% / fade by 70%).
   Targets `[data-hero-media]` and `[data-hero-copy]` inside the section.
──────────────────────────────────────────────────────────────────────────── */
export function HeroScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const scrub = {
        trigger: el,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      };
      gsap.to('[data-hero-media]', {
        yPercent: 18,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: scrub,
      });
      gsap.to('[data-hero-copy]', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: scrub,
      });
      gsap.to('[data-hero-copy]', {
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { ...scrub, end: '70% top' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

/* ── PinnedRail ───────────────────────────────────────────────────────────────
   Pins the section and converts vertical scroll into sideways travel across
   the track, with a hairline progress bar underneath — the Joby "poles" /
   Shore Reply "night" pattern. Only engages on wide screens and only when the
   track actually overflows; otherwise it is a plain row (and on touch the row
   stays natively swipeable).
──────────────────────────────────────────────────────────────────────────── */
export function PinnedRail({
  children,
  head,
  className,
  trackClassName,
}: {
  children: ReactNode;
  head?: ReactNode;
  className?: string;
  trackClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    const track = trackRef.current;
    if (!el || !track || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      // Measured from layout offsets, not scrollWidth: the children are the
      // things being translated, and transforms leak into scrollWidth, which
      // would shrink the distance on every refresh.
      const dist = () => {
        const last = track.lastElementChild as HTMLElement | null;
        return last ? last.offsetLeft + last.offsetWidth - track.clientWidth : 0;
      };
      if (dist() < 40) return;

      el.classList.add('is-pinned');
      gsap.to(track.children, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      return () => el.classList.remove('is-pinned');
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={className}>
      {head}
      <div ref={trackRef} className={trackClassName}>
        {children}
      </div>
      <div className="rail-bar" aria-hidden>
        <i ref={barRef} />
      </div>
    </section>
  );
}

/* ── DriftImage ───────────────────────────────────────────────────────────────
   Photography moves inside its crop as the frame crosses the viewport. The
   layer is oversized (inset -8% top/bottom) so the drift never exposes an
   edge; hover zoom on the <img> itself still works because the transform
   lives on this wrapper, not the image.
──────────────────────────────────────────────────────────────────────────── */
export function DriftImage({
  children,
  amount = 8,
  className = 'drift',
  style,
}: {
  children: ReactNode;
  /** Travel in percent of the frame, each way. */
  amount?: number;
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
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ── Magnetic ─────────────────────────────────────────────────────────────────
   CTA leans toward the cursor while hovered and springs back on leave.
   Pointer-only: touch devices never fire mousemove, so nothing changes there.
──────────────────────────────────────────────────────────────────────────── */
export function Magnetic({
  children,
  strength = 0.35,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * strength);
      yTo((e.clientY - r.top - r.height / 2) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [strength]);

  return (
    <span ref={ref} style={{ display: 'inline-flex' }}>
      {children}
    </span>
  );
}

/* ── WipeText ─────────────────────────────────────────────────────────────────
   landonorris.com's headline reveal: a solid block sweeps across each line,
   the words appear underneath it, then the block retracts off the far side.
   Fires once on entry. The block takes `currentColor`, so it is white on the
   shop's black and needs no colour of its own.
──────────────────────────────────────────────────────────────────────────── */
export function WipeText({
  children,
  delay = 0,
  start = 'top 85%',
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
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
        type: 'lines,words',
        linesClass: 'wipe-line',
        autoSplit: true,
        onSplit: (self) => {
          const tl = gsap.timeline({
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          });
          self.lines.forEach((line, i) => {
            const block = document.createElement('span');
            block.className = 'wipe-block';
            line.appendChild(block);
            const words = line.querySelectorAll('div, span:not(.wipe-block)');
            gsap.set(words, { opacity: 0 });
            const at = i * 0.12;
            tl.fromTo(block, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, at)
              .set(words, { opacity: 1 }, at + 0.45)
              .to(block, { scaleX: 0, transformOrigin: 'right center', duration: 0.5, ease: 'power3.inOut' }, at + 0.45);
          });
          return tl;
        },
      });
      return () => split.revert();
    }, el);

    return () => ctx.revert();
  }, [delay, start]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/* ── SplitTakeover ────────────────────────────────────────────────────────────
   landonorris.com's "On track / Off track" section. Two portrait crops slide
   in from the screen edges around a two-column headline; keep scrolling and a
   full-bleed photo rises from the bottom edge (clip-path) and settles over the
   whole stage while the sides push back out. Driven by a sticky stage inside
   a tall section — sticky survives Lenis, a GSAP pin would also work but would
   add a second spacer the rest of the page has to account for.
   Below 900px it collapses to a plain stacked layout.
──────────────────────────────────────────────────────────────────────────── */
export function SplitTakeover({
  left,
  right,
  center,
  takeover,
  className = 'lx',
}: {
  left: ReactNode;
  right: ReactNode;
  center: ReactNode;
  takeover: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      el.classList.add('is-staged');
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          // A number, not `true`: the timeline trails the scrollbar by ~1s,
          // which smooths out wheel steps instead of snapping to each one.
          scrub: 1.2,
        },
      });
      // 0 → 0.28  sides glide in as the section scrolls up into place
      tl.fromTo(q('.lx-left'), { xPercent: -70, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: 'power3.out' }, 0)
        .fromTo(q('.lx-right'), { xPercent: 70, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.28, ease: 'power3.out' }, 0)
        // 0.28 → 0.42  hold while the headline is read
        // 0.42 → 0.62  stage dissolves: figures drift out and fade, copy lifts away
        .to(q('.lx-left'), { xPercent: -18, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.42)
        .to(q('.lx-right'), { xPercent: 18, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, 0.42)
        .to(q('.lx-center'), { yPercent: -10, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, 0.44)
        // 0.45 → 0.75  takeover rises from the bottom edge and settles
        .fromTo(q('.lx-take'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, ease: 'power2.inOut' }, 0.45)
        .fromTo(q('.lx-take img'), { scale: 1.2 }, { scale: 1, duration: 0.42, ease: 'power2.out' }, 0.45);

      // Exit: once the stage unsticks, the photo dims and drifts as it scrolls
      // away, so the grid rises out of it instead of meeting a hard edge.
      // Separate trigger so the fade happens during the hand-off, not before
      // it (which left a screen of empty black).
      gsap.fromTo(
        q('.lx-take'),
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: 'power1.in',
          scrollTrigger: { trigger: el, start: 'bottom bottom', end: 'bottom 25%', scrub: 1.2 },
        }
      );
      gsap.fromTo(
        q('.lx-take img'),
        { yPercent: 0 },
        {
          yPercent: 12,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: { trigger: el, start: 'bottom bottom', end: 'bottom top', scrub: 1.2 },
        }
      );
      return () => el.classList.remove('is-staged');
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={className}>
      <div className="lx-stage">
        <div className="lx-side lx-left">{left}</div>
        <div className="lx-side lx-right">{right}</div>
        <div className="lx-center">{center}</div>
        <div className="lx-take">{takeover}</div>
      </div>
    </section>
  );
}
