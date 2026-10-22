export function getPinnedScrollTriggerOptions(isDesktop: boolean) {
  return {
    start: "top top" as const,
    end: "bottom bottom" as const,
    scrub: isDesktop ? 0.18 : 0.35,
  };
}
