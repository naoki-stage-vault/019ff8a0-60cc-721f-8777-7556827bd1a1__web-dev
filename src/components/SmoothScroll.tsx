"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Wraps the whole app in buttery inertial scrolling (Lenis),
 * adds a gentle snap-to-nearest-chapter when the user settles,
 * parallaxes the ghost chapter numerals, and routes in-page
 * anchor clicks through the eased scrollTo.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    const ghosts = Array.from(
      document.querySelectorAll<HTMLElement>(".ghost")
    );

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);

      // parallax: ghost numerals drift slower than the page
      const vh = window.innerHeight;
      for (const g of ghosts) {
        const r = g.getBoundingClientRect();
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        g.style.transform = `translate3d(0, ${(progress * -70).toFixed(1)}px, 0)`;
      }

      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    /* ---- snap to the nearest chapter once the user settles ---- */
    let settleTimer: ReturnType<typeof setTimeout> | null = null;

    const snap = () => {
      if (!lenis.isScrolling || lenis.velocity > 0.4) return;
      const slides = Array.from(
        document.querySelectorAll<HTMLElement>("section[data-slide]")
      );
      if (!slides.length) return;

      const y = window.scrollY;
      let best = slides[0];
      let bestDist = Infinity;
      for (const s of slides) {
        const d = Math.abs(s.offsetTop - y);
        if (d < bestDist) {
          bestDist = d;
          best = s;
        }
      }
      // only nudge when we're close to a chapter boundary —
      // long pages (projects/contact on small screens) stay free-scroll
      if (bestDist < window.innerHeight * 0.3) {
        lenis.scrollTo(best.offsetTop, {
          duration: 0.8,
          easing: easeOutExpo,
        });
      }
    };

    const onScroll = () => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(snap, 280);
    };
    lenis.on("scroll", onScroll);

    /* ---- ease anchor navigation through Lenis ---- */
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        return;
      }
      const el = document.querySelector<HTMLElement>(href);
      if (!el) return;

      e.preventDefault();
      lenis.scrollTo(el.offsetTop, {
        duration: 1.15,
        easing: easeOutExpo,
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      if (settleTimer) clearTimeout(settleTimer);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
