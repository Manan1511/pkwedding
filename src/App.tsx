import { useCallback, useEffect, useRef, useState } from "react";
import AudioControl, { type AudioControlHandle } from "./components/AudioControl";
import EventNav from "./components/EventNav";
import OpeningScene from "./components/OpeningScene";
import WeddingJourney from "./components/WeddingJourney";
import { wedding, type EventId } from "./data/wedding";

const OPENED_SESSION_KEY = "pavgun-ashmeet:invitation-open";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function readRequestedEvent(): EventId | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash.slice(1);
  const event = wedding.events.find((candidate) => `event-${candidate.id}` === hash);
  return event?.id ?? null;
}

function hasOpenedThisSession() {
  try {
    return window.sessionStorage.getItem(OPENED_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function readRequestedPassage(): EventId | null {
  const hash = window.location.hash.slice(1);
  return wedding.events.find(event => `transition-${event.id}` === hash)?.id ?? null;
}

function readRequestedFamilies() {
  return typeof window !== "undefined" && window.location.hash === "#our-families";
}

function shouldEnterImmediately() {
  return readRequestedEvent() !== null || readRequestedPassage() !== null || readRequestedFamilies() || hasOpenedThisSession() || prefersReducedMotion();
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(shouldEnterImmediately);
  const [requestedEvent] = useState(readRequestedEvent);
  const [requestedPassage] = useState(readRequestedPassage);
  const [requestedFamilies] = useState(readRequestedFamilies);
  const audioRef = useRef<AudioControlHandle>(null);

  const completeEntry = useCallback(() => {
    try {
      window.sessionStorage.setItem(OPENED_SESSION_KEY, "true");
    } catch {
      // The invitation remains usable when session storage is unavailable.
    }
    setHasEntered(true);
  }, []);

  const startAudio = useCallback(() => {
    void audioRef.current?.startFromGesture();
  }, []);

  useEffect(() => {
    if (!hasEntered) {
      return;
    }

    try {
      window.sessionStorage.setItem(OPENED_SESSION_KEY, "true");
    } catch {
      // The invitation remains usable when session storage is unavailable.
    }

    if (requestedEvent || requestedPassage || requestedFamilies) {
      const targetId = requestedEvent
        ? `event-${requestedEvent}`
        : requestedPassage
          ? `transition-${requestedPassage}`
          : "our-families";
      const target = document.getElementById(targetId);
      target?.focus({ preventScroll: true });

      let scrollFrame: number | null = null;
      const scrollToRequestedEvent = () => {
        scrollFrame = window.requestAnimationFrame(() => {
          target?.scrollIntoView?.({
            behavior: prefersReducedMotion() || requestedPassage || requestedFamilies ? "auto" : "smooth",
            block: "start",
          });
        });
      };

      if (document.readyState === "complete") {
        scrollToRequestedEvent();
      } else {
        window.addEventListener("load", scrollToRequestedEvent, { once: true });
      }

      return () => {
        window.removeEventListener("load", scrollToRequestedEvent);
        if (scrollFrame !== null) {
          window.cancelAnimationFrame(scrollFrame);
        }
      };
    }

    document.getElementById("welcome-title")?.focus({ preventScroll: true });
  }, [hasEntered, requestedEvent, requestedPassage, requestedFamilies]);

  return (
    <div className="wedding-app">
      <div
        aria-hidden={!hasEntered}
        className="site-content"
        inert={!hasEntered}
      >
        <header className="site-header">
          <a aria-label="Pavgun and Ashmeet home" className="site-brand" href="#welcome">
            <span>P</span>
            <small>&amp;</small>
            <span>A</span>
          </a>
          <EventNav />
          <AudioControl ref={audioRef} />
        </header>

        <main className="site-main" id="main-content" tabIndex={-1}>
          <WeddingJourney active={hasEntered} />
        </main>

        <footer className="site-footer">
          <a href="#welcome">Back to the welcome</a>
        </footer>
      </div>

      {!hasEntered && (
        <OpeningScene onAudioStart={startAudio} onComplete={completeEntry} />
      )}
    </div>
  );
}
