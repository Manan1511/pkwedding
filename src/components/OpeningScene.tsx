import { useEffect, useRef, useState } from "react";

const OPENING_DURATION_MS = 1450;

interface OpeningSceneProps {
  onAudioStart: () => void;
  onComplete: () => void;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export default function OpeningScene({
  onAudioStart,
  onComplete,
}: OpeningSceneProps) {
  const [phase, setPhase] = useState<"closed" | "opening">("closed");
  const timerRef = useRef<number | null>(null);
  const audioStartedRef = useRef(false);

  const startAudio = () => {
    if (!audioStartedRef.current) {
      audioStartedRef.current = true;
      onAudioStart();
    }
  };

  const finish = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onComplete();
  };

  const openInvitation = () => {
    if (phase === "opening") {
      return;
    }

    startAudio();

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    setPhase("opening");
    timerRef.current = window.setTimeout(finish, OPENING_DURATION_MS);
  };

  const skipOpening = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    startAudio();
    finish();
  };

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return (
    <section
      aria-label="Open the invitation"
      className="opening-gate"
      data-phase={phase}
    >
      <picture aria-hidden="true" className="opening-gate__backdrop">
        <source
          type="image/avif"
          sizes="100vw"
          srcSet="/images/welcome-courtyard-768.avif 768w, /images/welcome-courtyard-1536.avif 1536w"
        />
        <source
          type="image/webp"
          sizes="100vw"
          srcSet="/images/welcome-courtyard-768.webp 768w, /images/welcome-courtyard-1536.webp 1536w"
        />
        <img
          alt=""
          decoding="async"
          fetchPriority="high"
          height={1024}
          loading="eager"
          sizes="100vw"
          src="/images/welcome-courtyard-1536.webp"
          srcSet="/images/welcome-courtyard-768.webp 768w, /images/welcome-courtyard-1536.webp 1536w"
          width={1536}
        />
      </picture>
      <div aria-hidden="true" className="opening-gate__shade" />

      <button
        aria-label="Open the invitation"
        className="opening-door"
        disabled={phase === "opening"}
        onClick={openInvitation}
        type="button"
      >
        <span aria-hidden="true" className="opening-door__leaf opening-door__leaf--left" />
        <span aria-hidden="true" className="opening-door__leaf opening-door__leaf--right" />
        <span aria-hidden="true" className="opening-door__monogram">
          P<span>&amp;</span>A
        </span>
        <span aria-hidden="true" className="opening-door__prompt">
          Open the invitation
        </span>
      </button>

      <div className="opening-gate__invitation">
        <p>Pavgun Kaur &amp; Ashmeet Singh Sohal</p>
        <a href="#welcome" onClick={skipOpening}>
          Skip the invitation opening
        </a>
      </div>
    </section>
  );
}
