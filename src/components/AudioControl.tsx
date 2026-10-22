import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type AudioState = "paused" | "starting" | "playing" | "muted" | "blocked" | "error";

export interface AudioControlHandle {
  startFromGesture: () => Promise<void>;
}

const AudioControl = forwardRef<AudioControlHandle>(function AudioControl(_, ref) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const stateRef = useRef<AudioState>("paused");
  const [state, setState] = useState<AudioState>("paused");

  const updateState = useCallback((nextState: AudioState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const startFromGesture = useCallback(async () => {
    const audio = audioRef.current;

    if (
      !audio ||
      stateRef.current === "starting" ||
      stateRef.current === "playing" ||
      stateRef.current === "muted"
    ) {
      return;
    }

    audio.muted = false;
    audio.volume = 0.24;
    updateState("starting");

    try {
      await audio.play();
      updateState("playing");
    } catch {
      audio.muted = true;
      updateState("blocked");
    }
  }, [updateState]);

  useImperativeHandle(ref, () => ({ startFromGesture }), [startFromGesture]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleError = () => updateState("error");
    const handlePause = () => {
      if (stateRef.current === "playing" || stateRef.current === "muted") {
        updateState("paused");
      }
    };
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        (stateRef.current === "playing" || stateRef.current === "muted")
      ) {
        audio.pause();
        audio.muted = false;
        updateState("paused");
      }
    };

    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
    };
  }, [updateState]);

  const toggleMusic = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (stateRef.current === "playing") {
      audio.muted = true;
      updateState("muted");
      return;
    }

    if (stateRef.current === "muted") {
      audio.muted = false;
      updateState("playing");
      return;
    }

    void startFromGesture();
  };

  const buttonLabel =
    state === "playing" ? "Mute music" : state === "muted" ? "Unmute music" : "Play music";
  const statusMessage =
    state === "starting"
      ? "Starting music…"
      : state === "blocked"
        ? "Music could not start. Tap Play music to try again."
        : state === "error"
          ? "Music could not load. Reload the invitation to try again."
          : "";

  return (
    <div className="audio-control">
      <button
        aria-label={buttonLabel}
        aria-pressed={state === "muted"}
        className="audio-control__button"
        onClick={toggleMusic}
        type="button"
      >
        <span aria-hidden="true" className="audio-control__bars">
          <i />
          <i />
          <i />
        </span>
        <span>{buttonLabel}</span>
      </button>
      <span aria-live="polite" className="audio-control__status" role="status">
        {statusMessage}
      </span>
      <audio
        ref={audioRef}
        aria-hidden="true"
        className="wedding-audio"
        loop
        preload="none"
        src="/audio/indian-wedding.mp3"
        tabIndex={-1}
      />
    </div>
  );
});

export default AudioControl;
