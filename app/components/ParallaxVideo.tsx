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
        playsInline
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
