import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function smoothScrollTo(target: string | HTMLElement) {
  const lenis = lenisInstance;
  if (!lenis) {
    if (typeof target === "string") {
      const el = document.querySelector<HTMLElement>(target);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return;
  }
  const navEl = document.querySelector<HTMLElement>(".nav");
  const navHeight = navEl?.offsetHeight ?? 0;
  lenis.scrollTo(target, {
    offset: -navHeight - 8,
    duration: 1.3,
  });
}

export function useSmoothScroll(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    /* Matched to rogue-rosy.webflow.io (2026-10-15). That site does **not**
       use Lenis — it runs SmoothScroll.js 1.4.10 with:

         frameRate 150, animationTime 1000, stepSize 100, pulseAlgorithm 1,
         pulseScale 4, pulseNormalize 1, accelerationDelta 50,
         accelerationMax 3, keyboardSupport 1, arrowScroll 50

       We stay on Lenis rather than swapping libraries: `getLenis()` drives the
       Science rail and its `?s=` deep links, `data-lenis-prevent` guards four
       inner-scroll regions, and ScrollTrigger is synced to Lenis's own tick.
       Replacing it would break all three for a scroll feel we can get by
       tuning. So the settings below map that config onto Lenis:

       - `animationTime: 1000` -> `duration: 1` — a long, floaty glide per
         wheel impulse, where the previous build used a lerp.
       - `pulseAlgorithm`/`pulseScale: 4` -> the expo-out easing below, which
         is the curve that decelerates to the same long tail.
       - `stepSize: 100` is close to a full native notch, so the wheel
         multiplier comes back up near 1 (it was 0.7 for the old reference).

       **`lerp` and `duration` are mutually exclusive in Lenis** — passing both
       silently drops the lerp, so this is a duration build and carries no
       `lerp` key at all. Touch stays native, as it is on the reference:
       SmoothScroll.js only intercepts the wheel.

       Not reproducible here: `accelerationMax: 3`, which ramps the step when
       wheel events arrive in quick succession. Lenis has no equivalent. */
    const lenis = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.95,
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey)
        return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;

      // Hash routes (e.g. "#/product/p1") aren't valid CSS selectors and
      // aren't in-page anchors — let the browser handle them.
      if (href.startsWith("#/")) return;

      let dest: HTMLElement | null;
      try {
        dest = document.querySelector<HTMLElement>(href);
      } catch {
        return;
      }
      if (!dest) return;

      event.preventDefault();
      smoothScrollTo(dest);
    };

    document.addEventListener("click", onAnchorClick);

    /* Every trigger on the page is measured at mount, when the webfonts have
       usually not swapped in yet — and Oswald is far narrower than the
       fallback, so headings reflow and every start/end below them is stale.
       One refresh once the faces are in fixes the lot. */
    let fontsPending = true;
    void document.fonts?.ready.then(() => {
      if (fontsPending) ScrollTrigger.refresh();
    });

    return () => {
      fontsPending = false;
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);
}
