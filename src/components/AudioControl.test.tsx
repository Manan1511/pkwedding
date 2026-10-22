import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AudioControl from "./AudioControl";

let mediaPlay: ReturnType<typeof vi.spyOn>;
let mediaPause: ReturnType<typeof vi.spyOn>;

describe("AudioControl", () => {
  beforeEach(() => {
    mediaPlay = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    mediaPause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
  });

  it("starts on request and exposes the current play or mute action", async () => {
    const user = userEvent.setup();
    render(<AudioControl />);

    await user.click(screen.getByRole("button", { name: "Play music" }));
    expect(mediaPlay).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole("button", { name: "Mute music" }),
    ).toBeInTheDocument();
  });

  it("offers a retry when the browser blocks playback", async () => {
    mediaPlay.mockRejectedValueOnce(new Error("Playback was blocked"));
    const user = userEvent.setup();
    render(<AudioControl />);

    await user.click(screen.getByRole("button", { name: "Play music" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Music could not start. Tap Play music to try again.",
    );
    expect(screen.getByRole("button", { name: "Play music" })).toBeEnabled();
  });

  it("pauses when the browser tab becomes hidden", async () => {
    const user = userEvent.setup();
    render(<AudioControl />);
    await user.click(screen.getByRole("button", { name: "Play music" }));

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    fireEvent(document, new Event("visibilitychange"));

    await waitFor(() => expect(mediaPause).toHaveBeenCalled());
  });
});
