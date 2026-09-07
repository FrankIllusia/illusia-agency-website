'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SIZZLE_CLIPS = [
  '/images/airo-web.mp4',
  '/images/disney-tron-web.mp4',
  '/images/hunger-games-web.mp4',
  '/images/wooooo-energy-web.mp4',
  '/images/innovation-vertiport-web.mp4',
  '/images/mike-tyson-recap-web.mp4',
];

export default function ParallaxVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const clipIndexRef = useRef(0);
  const clipTimesRef = useRef<number[]>(SIZZLE_CLIPS.map(() => 0));

  /* The element already carries autoPlay/muted/playsInline, but Safari still
     refuses inline autoplay in Low Power Mode and Low Data Mode, and paints its
     own play button over the clip when it does. There's no way to suppress that
     overlay — the only fix is to get playback started, so retry on every signal
     that might let it through. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* Muted has to hold as a property, not just the server-rendered attribute. */
    video.muted = true;

    const attempt = () => { video.play().catch(() => {}); };
    attempt();
    video.addEventListener('canplay', attempt);
    video.addEventListener('loadeddata', attempt);

    /* A user gesture lifts the block, so the visitor's first touch or scroll is
       the reliable second chance. */
    const opts = { once: true, passive: true } as const;
    window.addEventListener('touchstart', attempt, opts);
    window.addEventListener('scroll', attempt, opts);

    /* Also start on entry rather than leaving a 17MB clip decoding offscreen. */
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) attempt(); else video.pause(); },
      { threshold: 0.1 }
    );
    io.observe(video);

    return () => {
      video.removeEventListener('canplay', attempt);
      video.removeEventListener('loadeddata', attempt);
      window.removeEventListener('touchstart', attempt);
      window.removeEventListener('scroll', attempt);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;

      // Save where this clip is up to
      if (video) clipTimesRef.current[clipIndexRef.current] = video.currentTime;

      setFading(true);

      setTimeout(() => {
        const nextIndex = (clipIndexRef.current + 1) % SIZZLE_CLIPS.length;
        clipIndexRef.current = nextIndex;

        const v = videoRef.current;
        if (!v) return;

        const resumeAt = clipTimesRef.current[nextIndex];

        const seekAndPlay = () => {
          v.currentTime = resumeAt;
          v.play().catch(() => {});
        };

        v.src = SIZZLE_CLIPS[nextIndex];
        v.addEventListener('loadedmetadata', seekAndPlay, { once: true });
        v.load();

        setFading(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    gsap.fromTo(
      video,
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      <video
        ref={videoRef}
        src={SIZZLE_CLIPS[0]}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '130%',
          top: '-15%',
          objectFit: 'cover',
          display: 'block',
          opacity: fading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.25) 100%)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
