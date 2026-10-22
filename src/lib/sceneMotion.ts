import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPinnedScrollTriggerOptions } from "./motionConfig";

/** Authored passages connect the worlds; the ceremonies themselves remain readable. */
export function setupWeddingJourney(root: HTMLElement): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed = false;
  let context: gsap.Context | undefined;
  const desktopBreakpoint = window.matchMedia("(min-width: 58rem)");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => target.classList.toggle("is-in-view", isIntersecting));
  }, { threshold: 0.05 });
  root.querySelectorAll(".ceremony-scene, .scene-passage, .illustrated-interlude, .welcome-scene").forEach(scene => observer.observe(scene));

  const buildMotion = () => {
    context?.revert();
    delete root.dataset.motionReady;
    if (reduced.matches) return;
    root.dataset.motionReady = "true";
    gsap.registerPlugin(ScrollTrigger);
    const pinnedScroll = getPinnedScrollTriggerOptions(desktopBreakpoint.matches);
    context = gsap.context(() => {
      gsap.to(".welcome-hero__artwork", { scale: 1.12, yPercent: -4, ease: "none",
        scrollTrigger: { trigger: ".welcome-scene", ...pinnedScroll } });

      root.querySelectorAll<HTMLElement>(".scene-passage").forEach(passage => {
        const $ = gsap.utils.selector(passage);
        const stage = passage.querySelector<HTMLElement>(".passage-stage")!;
        const kind = passage.dataset.passage;
        const words = $(".passage-words");
        const caption = $(".passage-words p");
        const stars = $(".passage-stars");
        const sun = $(".passage-sun");
        const blooms = gsap.utils.toArray<HTMLElement>(".passage-bloom", passage);
        const threads = gsap.utils.toArray<SVGPathElement>(".passage-thread path", passage);
        const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: {
          trigger: passage, ...pinnedScroll, invalidateOnRefresh: true,
        } });
        const visibleIntro = kind === "dusk" || kind === "sunrise";
        gsap.set(caption, {
          opacity: visibleIntro ? .84 : 0,
          y: visibleIntro ? 18 : 0,
          filter: "blur(0px)",
          clipPath: "inset(0)",
        });
        gsap.set(threads, { strokeDasharray: 1, strokeDashoffset: 1 });
        timeline.fromTo(stage, { backgroundColor: passage.dataset.fromColor }, { backgroundColor: passage.dataset.toColor, duration: 1 }, 0);

        if (kind === "velvet") {
          // The emerald wings begin together and lift apart to reveal the invitation line.
          timeline.to($(".passage-drape--left"), { xPercent: -110, rotation: -4, duration: .58, ease: "power3.out" }, .08)
            .to($(".passage-drape--right"), { xPercent: 110, rotation: 4, duration: .58, ease: "power3.out" }, .08)
            .fromTo(caption, { clipPath: "inset(0 50% 0 50%)", opacity: 0, filter: "blur(8px)" }, { clipPath: "inset(0)", opacity: 1, filter: "blur(0px)", duration: .32, ease: "power2.out" }, .36)
            .to(threads[0], { strokeDashoffset: 0, duration: .25 }, .34)
            .to(threads[1], { strokeDashoffset: 0, duration: .25 }, .56);
        } else if (kind === "curtain") {
          // Maroon curtains close first, hold the blessing, then sweep outward.
          gsap.set($(".passage-drape--left"), { xPercent: -110 });
          gsap.set($(".passage-drape--right"), { xPercent: 110 });
          timeline.to($(".passage-drape--left"), { xPercent: 0, duration: .23, ease: "power2.in" }, .02)
            .to($(".passage-drape--right"), { xPercent: 0, duration: .23, ease: "power2.in" }, .02)
            .fromTo(caption, { y: 22, opacity: 0, filter: "blur(5px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: .28, ease: "power2.out" }, .25)
            .to(threads[0], { strokeDashoffset: 0, duration: .24 }, .25)
            .to($(".passage-drape--left"), { xPercent: -110, rotation: -2, duration: .42, ease: "power2.inOut" }, .52)
            .to($(".passage-drape--right"), { xPercent: 110, rotation: 2, duration: .42, ease: "power2.inOut" }, .52)
            .to(threads[1], { strokeDashoffset: 0, duration: .22 }, .55);
        } else if (kind === "dusk") {
          // Keep the line readable while the warm day shifts into night.
          timeline.fromTo($(".passage-atmosphere"), { opacity: 0 }, { opacity: .92, duration: .58 }, .08)
            .fromTo(sun, { yPercent: -10, scale: 1, opacity: .92 }, { yPercent: 120, scale: .5, opacity: 0, duration: .62 }, .02)
            .fromTo(stars, { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .4 }, .42)
            .to(caption, { opacity: 1, y: 0, duration: .3, ease: "power2.out" }, .12)
            .to(words, { color: "#fff4dc", duration: .36 }, .34)
            .to(stars, { opacity: .48, duration: .14 }, .88);
        } else if (kind === "sunrise") {
          // A low golden sun climbs into the morning sky and carries the caption upward.
          timeline.fromTo($(".passage-atmosphere"), { opacity: 0 }, { opacity: .68, duration: .55 }, .02)
            .fromTo(sun, { yPercent: 115, scale: .52, opacity: 0 }, { yPercent: 0, scale: 1, opacity: .95, duration: .68, ease: "power2.out" }, .04)
            .to(caption, { y: 0, opacity: 1, duration: .34, ease: "power2.out" }, .12)
            .to(words, { color: "#273e37", duration: .36 }, .46)
            .to(sun, { scale: 1.34, opacity: .58, duration: .22 }, .76);
        } else if (kind === "flowers") {
          // A warm diagonal petal sweep clears into the stillness of the morning.
          gsap.set(blooms, { opacity: 0, scale: .25, rotation: -24 });
          timeline.to(blooms, { opacity: .9, scale: 1.7, rotation: 0, stagger: .008, duration: .26, ease: "back.out(1.3)" }, .04)
            .fromTo(caption, { opacity: 0, scale: .94, filter: "blur(6px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: .32, ease: "power2.out" }, .38)
            .to(blooms, { x: i => (i % 2 ? 1 : -1) * window.innerWidth * .72, y: -140, rotation: i => i % 2 ? 115 : -115, opacity: 0, stagger: .006, duration: .42, ease: "power2.inOut" }, .52);
        } else {
          // Blush blossoms gather at the edges, then arc away around the final line.
          gsap.set(blooms, { opacity: 0, scale: 1.35, x: i => (i % 2 ? 1 : -1) * 55 });
          timeline.to(blooms, { opacity: .82, x: 0, scale: 2.4, stagger: .007, duration: .32, ease: "power2.out" }, .04)
            .fromTo(caption, { clipPath: "inset(0 50% 0 50%)", opacity: 0, scale: .96 }, { clipPath: "inset(0)", opacity: 1, scale: 1, duration: .4, ease: "power2.out" }, .34)
            .to(blooms, { x: i => (i % 2 ? 1 : -1) * window.innerWidth * .78, y: -80, rotation: i => i % 2 ? 78 : -78, opacity: 0, stagger: .005, duration: .4, ease: "power2.inOut" }, .54)
            .to(threads[0], { strokeDashoffset: 0, duration: .2 }, .32)
            .to(threads[1], { strokeDashoffset: 0, duration: .2 }, .58);
        }
        timeline.to(caption, { opacity: 0, y: -12, duration: .06 }, .94);
      });

      gsap.fromTo(".family-welcome__motif path", { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        stagger: .12,
        ease: "none",
        scrollTrigger: { trigger: ".family-welcome", start: "top 82%", end: "top 36%", scrub: .45 },
      });

      root.querySelectorAll<HTMLElement>(".ceremony-scene").forEach(scene => {
        const select = gsap.utils.selector(scene);
        const kind = scene.id.replace("event-", "");
        const trigger = { trigger: scene, ...pinnedScroll };
        if (kind === "engagement") gsap.to(select(".ceremony-art"), { scale: 1.08, transformOrigin: "50% 20%", ease: "none", scrollTrigger: trigger });
        if (kind === "sagan") gsap.to(select(".ceremony-art"), { xPercent: -3, ease: "none", scrollTrigger: trigger });
        if (kind === "jaggo") gsap.to(select(".ceremony-light"), { opacity: 1, ease: "none", scrollTrigger: trigger });
        if (kind === "haldi-mehendi") gsap.to(select(".scene-ornaments"), { rotation: 8, yPercent: -12, ease: "none", scrollTrigger: trigger });
        if (kind === "anand-karaj") gsap.to(select(".ceremony-art"), { yPercent: -4, ease: "none", scrollTrigger: trigger });
        if (kind === "wedding-celebration") gsap.to(select(".ceremony-art"), { scale: 1.1, transformOrigin: "65% 70%", ease: "none", scrollTrigger: trigger });
      });
    }, root);
    root.dataset.motionReady = "true";
  };
  buildMotion();
  reduced.addEventListener("change", buildMotion);
  desktopBreakpoint.addEventListener("change", buildMotion);
  const refresh = () => { if (!disposed && !reduced.matches) ScrollTrigger.refresh(); };
  void document.fonts?.ready.then(refresh);
  root.addEventListener("load", refresh, true);
  const onVisibility = () => root.classList.toggle("is-paused", document.hidden);
  document.addEventListener("visibilitychange", onVisibility);
  onVisibility();
  return () => {
    disposed = true;
    observer.disconnect();
    context?.revert();
    reduced.removeEventListener("change", buildMotion);
    desktopBreakpoint.removeEventListener("change", buildMotion);
    root.removeEventListener("load", refresh, true);
    document.removeEventListener("visibilitychange", onVisibility);
    delete root.dataset.motionReady;
  };
}
