import { wedding, type WeddingEvent } from "../data/wedding";
import { formatWeddingDate } from "../lib/dates";
import { directionsUrl } from "../lib/maps";
import { downloadCalendar } from "../lib/invitationDownloads";

function SceneOrnaments({ kind }: { kind: string }) {
  return <div className={`scene-ornaments scene-ornaments--${kind}`} aria-hidden="true">
    {Array.from({ length: kind === "anand-karaj" ? 7 : 12 }, (_, i) => (
      <span className="scene-ornament" key={i} style={{ "--i": i } as React.CSSProperties}>
        {kind === "engagement" ? <svg viewBox="0 0 24 100"><path d="M12 0v58M12 58 3 77l9 20 9-20-9-19ZM3 77h18" fill="none" stroke="currentColor"/><path d="m12 65 4 12-4 12-4-12Z" fill="currentColor"/></svg>
          : kind === "anand-karaj" ? <svg viewBox="0 0 60 300"><path d="M30 0v300" stroke="currentColor" fill="none"/>{[40,75,110,145,180,215,250].map(y=><g key={y} fill="currentColor"><ellipse cx="25" cy={y} rx="6" ry="10" transform={`rotate(-35 25 ${y})`}/><ellipse cx="35" cy={y+9} rx="6" ry="10" transform={`rotate(35 35 ${y+9})`}/></g>)}</svg>
          : <svg viewBox="0 0 40 40"><g fill="currentColor">{[0,60,120,180,240,300].map(a=><ellipse key={a} cx="20" cy="11" rx="5" ry="10" transform={`rotate(${a} 20 20)`}/>)}</g><circle cx="20" cy="20" r="4" fill="var(--scene-flower-heart, #bd7235)"/></svg>}
      </span>
    ))}
  </div>;
}

export default function CeremonyScene({ event, index }: { event: WeddingEvent; index: number }) {
  const assembly = event.timing.kind === "event" ? undefined : event.timing.assembly;
  const point = assembly ? wedding.assemblyPoints[assembly.pointId] : undefined;
  const time = event.timing.kind === "event" ? event.timing.eventTime : event.timing.kind === "ceremony" ? event.timing.ceremonyTime : event.timing.assembly.time;
  const timingLabel = event.timing.kind === "assembly" ? "Assembly time" : event.timing.kind === "ceremony" ? "Ceremony time" : "Time";
  const image = event.id === "jaggo" ? "jaggo-courtyard" : event.id;

  return <section className={`ceremony-scene ceremony-scene--${event.id}`} data-theme={event.sceneTheme} id={`event-${event.id}`} tabIndex={-1} aria-labelledby={`scene-title-${event.id}`}>
    <div className="ceremony-stage">
      <picture className="ceremony-art" aria-hidden="true">
        <img alt="" loading="lazy" decoding="async" src={`/images/${image}-1536.png`} srcSet={`/images/${image}-768.webp 768w, /images/${image}-1536.webp 1536w`} sizes="100vw" />
      </picture>
      <div className="ceremony-veil" aria-hidden="true" />
      <div className="ceremony-light" aria-hidden="true" />
      <SceneOrnaments kind={event.id} />
      <div className="ceremony-copy">
        <p className="ceremony-chapter"><span>{String(index + 1).padStart(2, "0")}</span> {event.subtitle}</p>
        <h2 id={`scene-title-${event.id}`} aria-label={event.title}>
          {event.id === "jaggo" ? event.title.split(" • ").map((line, i) => <span className="ceremony-title-line" key={line}>{line}{i < 2 && <span className="ceremony-title-dot"> •</span>}</span>) : event.title}
        </h2>
        <p className="ceremony-date">{formatWeddingDate(event.date)}</p>
        <p className="ceremony-invitation">{event.invitationLine}</p>
        {event.invitationByline && <p className="ceremony-byline">{event.invitationByline}</p>}
        <div className="ceremony-when"><span>{timingLabel}</span><strong>{time.label}</strong></div>
        <p className="ceremony-venue">{event.venue.name}</p>
      </div>
      <details className="ceremony-details">
        <summary>{event.id === "jaggo" ? `${time.label} · Gathering & directions` : "Venue & gathering details"}<span aria-hidden="true">+</span></summary>
        <div className="ceremony-details__body">
          <dl>
            {event.timing.kind !== "assembly" && <div><dt>{timingLabel}</dt><dd>{time.label}</dd></div>}
            {assembly && point && <><div><dt>Assembly time</dt><dd>{assembly.time.label}</dd></div><div><dt>Assembly point</dt><dd>{point.label}</dd><address>{point.address}</address></div></>}
            <div><dt>Venue</dt><dd>{event.venue.name}</dd><address>{event.venue.address}</address></div>
          </dl>
          <div className="ceremony-directions">
            {point && <a href={directionsUrl(point.address)} rel="noreferrer" target="_blank">Directions to {assembly?.pointId === "tulip-inn" ? "Tulip Inn Zirakpur" : point.label}</a>}
            <a href={directionsUrl(event.venue.address)} rel="noreferrer" target="_blank">Directions to {event.id === "jaggo" ? "Jaggo venue" : event.venue.name}</a>
            <button onClick={() => downloadCalendar([event])}>Save this date</button>
          </div>
        </div>
      </details>
      <a className="ceremony-next" href={index < wedding.events.length - 1 ? `#transition-${wedding.events[index + 1].id}` : "#our-families"} aria-label={index < wedding.events.length - 1 ? `Continue to ${wedding.events[index + 1].subtitle}` : "Continue to our families"}><span>Continue</span>↓</a>
    </div>
  </section>;
}
