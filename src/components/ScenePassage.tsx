import type { CSSProperties } from "react";
import type { EventId } from "../data/wedding";

export const passageDirections = [
  { to: "engagement", kind: "velvet", caption: "An evening dressed in emerald and gold", fromColor: "#f2e3c7", toColor: "#10271e" },
  { to: "sagan", kind: "curtain", caption: "With blessings, a new beginning", fromColor: "#10271e", toColor: "#f2dfbc" },
  { to: "jaggo", kind: "dusk", caption: "As evening falls, Punjab comes alive", fromColor: "#f2dfbc", toColor: "#10152c" },
  { to: "haldi-mehendi", kind: "sunrise", caption: "And morning arrives in the colours of joy", fromColor: "#10152c", toColor: "#f9e6ae" },
  { to: "anand-karaj", kind: "flowers", caption: "From celebration to a sacred promise", fromColor: "#f9e6ae", toColor: "#e8eff0" },
  { to: "wedding-celebration", kind: "blossom", caption: "Two families. A lifetime of love.", fromColor: "#e8eff0", toColor: "#6b2135" },
] as const;

export default function ScenePassage({ to }: { to: EventId }) {
  const direction = passageDirections.find(p => p.to === to)!;
  const hasThreads = direction.kind === "velvet" || direction.kind === "curtain" || direction.kind === "blossom";
  return <div id={`transition-${to}`} tabIndex={-1} className={`scene-passage scene-passage--${direction.kind}`} data-passage={direction.kind} data-to={to} data-from-color={direction.fromColor} data-to-color={direction.toColor}>
    <div className="passage-stage">
      <div className="passage-world" aria-hidden="true">
        <div className="passage-atmosphere" />
        <div className="passage-sun" />
        <div className="passage-stars">{Array.from({ length: 30 }, (_, i) => <i key={i} style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 19 + 5) % 80}%`, "--star-size": `${i % 4 === 0 ? 4 : 2}px` } as CSSProperties} />)}</div>
        <div className="passage-drape passage-drape--left" />
        <div className="passage-drape passage-drape--right" />
        <div className="passage-blooms">{Array.from({ length: 18 }, (_, i) => <svg className="passage-bloom" key={i} viewBox="0 0 80 80" style={{ "--bloom-x": `${(i * 31) % 110 - 5}%`, "--bloom-y": `${(i * 23) % 100}%` } as CSSProperties}><g fill={direction.kind === "blossom" ? "#d992a4" : i % 2 ? "#f8ca56" : "#fff0ca"}>{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="40" cy="24" rx="12" ry="20" transform={`rotate(${a} 40 40)`}/>)}</g><circle cx="40" cy="40" r="9" fill="#b58545" /></svg>)}</div>
      </div>
      <div className="passage-words">
        {hasThreads && <svg className="passage-thread passage-thread--before" viewBox="0 0 80 220" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M40 0 C12 60 68 135 40 220" /></svg>}
        <p>{direction.caption}</p>
        {hasThreads && <svg className="passage-thread passage-thread--after" viewBox="0 0 80 220" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M40 0 C68 70 12 150 40 220" /></svg>}
      </div>
    </div>
  </div>;
}
