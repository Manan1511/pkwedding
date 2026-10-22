import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wedding } from "./data/wedding";
import App from "./App";

vi.mock("./lib/sceneMotion", () => ({
  setupWeddingJourney: vi.fn(() => vi.fn()),
}));

let mediaPlay: ReturnType<typeof vi.spyOn>;

function setReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? matches : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("wedding invitation prototype", () => {
  beforeEach(() => {
    history.replaceState({}, "", "/");
    sessionStorage.clear();
    setReducedMotion(false);
    mediaPlay = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  async function finishOpening() {
    const skip = screen.queryByRole("link", {
      name: "Skip the invitation opening",
    });

    if (skip) {
      await userEvent.setup().click(skip);
    }
  }

  it("keeps the invitation inactive until it is opened or skipped", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("button", { name: "Open the invitation" }),
    ).toBeVisible();
    expect(document.querySelector(".site-content")).toHaveAttribute("inert");

    await user.click(screen.getByRole("button", { name: "Open the invitation" }));
    expect(document.querySelector(".opening-gate")).toHaveAttribute(
      "data-phase",
      "opening",
    );
    expect(document.querySelector(".site-content")).toHaveAttribute("inert");

    await user.click(
      screen.getByRole("link", { name: "Skip the invitation opening" }),
    );

    expect(document.querySelector(".site-content")).not.toHaveAttribute("inert");
    expect(sessionStorage.getItem("pavgun-ashmeet:invitation-open" )).toBe("true");
    expect(mediaPlay).toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { level: 1, name: "Pavgun & Ashmeet" }),
    ).toBeVisible();
  });

  it("shows all six stable event shortcuts and the countdown", async () => {
    render(<App />);
    await finishOpening();

    const nav = screen.getByRole("navigation", {
      name: "Celebration shortcuts",
    });
    expect(within(nav).getAllByRole("link")).toHaveLength(6);

    for (const event of wedding.events) {
      expect(
        within(nav).getByRole("link", {
          name: event.id === "anand-karaj" ? event.title : new RegExp(event.subtitle),
        }),
      ).toHaveAttribute("href", `#event-${event.id}`);
    }

    expect(
      screen.getByRole("heading", { name: "Until Anand Karaj" }),
    ).toBeInTheDocument();
  });

  it("shows the full Jaggo timing, assembly point, venue, and separate directions", async () => {
    render(<App />);
    await finishOpening();

    const jaggo = document.getElementById("event-jaggo");
    expect(jaggo).not.toBeNull();
    const scene = within(jaggo as HTMLElement);

    await userEvent.setup().click(scene.getByText(/Gathering & directions/));

    expect(
      scene.getByRole("heading", {
        name: "Dhol Vajda • Dil Nachda • Jashan Sajda",
      }),
    ).toBeInTheDocument();
    expect(scene.getByText("Jaggo Ceremony")).toBeInTheDocument();
    for (const time of scene.getAllByText("7:30 pm")) expect(time).toBeInTheDocument();
    expect(scene.getByText("Lobby Of Tulip Inn")).toBeInTheDocument();
    expect(
      scene.getByText(
        "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      ),
    ).toBeInTheDocument();
    expect(
      scene.getByRole("link", { name: "Directions to Tulip Inn Zirakpur" }),
    ).toHaveAttribute("href", expect.stringContaining("maps"));
    expect(
      scene.getByRole("link", { name: "Directions to Jaggo venue" }),
    ).toHaveAttribute("href", expect.stringContaining("maps"));
  });

  it("waits for the initial page load before scrolling to a requested event", () => {
    const animationFrames: FrameRequestCallback[] = [];
    const readyStateDescriptor = Object.getOwnPropertyDescriptor(
      document,
      "readyState",
    );
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "interactive",
    });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    history.replaceState({}, "", "/#event-sagan");
    render(<App />);

    expect(
      screen.queryByRole("button", { name: "Open the invitation" }),
    ).not.toBeInTheDocument();
    const eventCard = document.getElementById("event-sagan");
    expect(eventCard).toHaveFocus();
    expect(eventCard?.scrollIntoView).not.toHaveBeenCalled();
    expect(animationFrames).toHaveLength(0);

    act(() => window.dispatchEvent(new Event("load")));
    expect(animationFrames).toHaveLength(1);
    act(() => animationFrames[0](0));

    expect(eventCard?.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    if (readyStateDescriptor) {
      Object.defineProperty(document, "readyState", readyStateDescriptor);
    } else {
      Reflect.deleteProperty(document, "readyState");
    }
  });

  it("opens directly at the family section for a family deep link", () => {
    const animationFrames: FrameRequestCallback[] = [];
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    history.replaceState({}, "", "/#our-families");
    render(<App />);

    expect(
      screen.queryByRole("button", { name: "Open the invitation" }),
    ).not.toBeInTheDocument();
    const families = document.getElementById("our-families");
    expect(families).toHaveFocus();
    expect(animationFrames).toHaveLength(1);

    act(() => animationFrames[0](0));
    expect(families?.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });

  it("shows the complete page without an opening gate when reduced motion is preferred", () => {
    setReducedMotion(true);
    render(<App />);

    expect(
      screen.queryByRole("button", { name: "Open the invitation" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".site-content")).not.toHaveAttribute("inert");
  });

  it("keeps every supplied family name available in the welcome", async () => {
    render(<App />);
    await finishOpening();

    for (const family of [wedding.families.bride, wedding.families.groom]) {
      expect(screen.getByText(family.name)).toBeInTheDocument();
      expect(screen.getByText(family.father)).toBeInTheDocument();
      expect(screen.getByText(family.mother)).toBeInTheDocument();
      expect(screen.getByText(family.dadaJi)).toBeInTheDocument();
      expect(screen.getByText(family.dadi)).toBeInTheDocument();
    }
  });
});
