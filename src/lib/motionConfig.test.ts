import { describe, expect, it } from "vitest";
import { getPinnedScrollTriggerOptions } from "./motionConfig";

describe("pinned scene scroll timing", () => {
  it("ends the scrub where the sticky stage releases", () => {
    expect(getPinnedScrollTriggerOptions(true)).toMatchObject({
      start: "top top",
      end: "bottom bottom",
    });
  });

  it("uses a tighter scrub on desktop than on mobile", () => {
    expect(getPinnedScrollTriggerOptions(true).scrub).toBeLessThan(
      getPinnedScrollTriggerOptions(false).scrub,
    );
  });
});
