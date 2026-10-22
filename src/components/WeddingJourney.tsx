import { Fragment, useLayoutEffect, useRef } from "react";
import WelcomeScene from "./WelcomeScene";
import CeremonyScene from "./CeremonyScene";
import { wedding } from "../data/wedding";
import { Countdown, FamilyWelcome } from "./WelcomeScene";
import { setupWeddingJourney } from "../lib/sceneMotion";
import ScenePassage from "./ScenePassage";

export default function WeddingJourney({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!active || !root.current) return;
    return setupWeddingJourney(root.current);
  }, [active]);

  return (
    <div className="wedding-journey" ref={root}>
      <WelcomeScene />
      <div className="invitation-countdown illustrated-interlude"><Countdown /></div>
      {wedding.events.map((event, index) => <Fragment key={event.id}><ScenePassage to={event.id} /><CeremonyScene event={event} index={index} /></Fragment>)}
      <FamilyWelcome />
    </div>
  );
}
