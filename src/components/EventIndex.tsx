import type { WeddingEvent } from "../data/wedding";
import { wedding } from "../data/wedding";
import { formatWeddingDate } from "../lib/dates";
import { directionsUrl } from "../lib/maps";

function timingRows(event: WeddingEvent) {
  if (event.timing.kind === "event") {
    return [{ label: "Time", value: event.timing.eventTime.label }];
  }

  if (event.timing.kind === "ceremony") {
    return [
      { label: "Ceremony time", value: event.timing.ceremonyTime.label },
      ...(event.timing.assembly
        ? [{ label: "Assembly time", value: event.timing.assembly.time.label }]
        : []),
    ];
  }

  return [{ label: "Assembly time", value: event.timing.assembly.time.label }];
}

function assemblyFor(event: WeddingEvent) {
  if (event.timing.kind === "event" || !event.timing.assembly) {
    return null;
  }

  return wedding.assemblyPoints[event.timing.assembly.pointId];
}

function EventEntry({ event }: { event: WeddingEvent }) {
  const isJaggo = event.id === "jaggo";
  const assemblyPoint = assemblyFor(event);

  return (
    <li className={`event-index__entry${isJaggo ? " event-index__entry--jaggo" : ""}`}>
      <article
        aria-labelledby={`event-card-title-${event.id}`}
        className="event-entry"
        data-theme={event.sceneTheme}
        id={isJaggo ? "event-jaggo-card" : `event-${event.id}`}
        tabIndex={-1}
      >
        <div className="event-entry__date">
          <time dateTime={event.date}>{formatWeddingDate(event.date)}</time>
        </div>
        <div className="event-entry__main">
          <div className="event-entry__heading">
            <div>
              <h3 id={`event-card-title-${event.id}`}>{event.title}</h3>
              <p className="event-entry__subtitle">{event.subtitle}</p>
            </div>
            {isJaggo && (
              <a className="event-entry__scene-link" href="#event-jaggo">
                Open the Jaggo scene
              </a>
            )}
          </div>
          <p className="event-entry__invitation">{event.invitationLine}</p>
          {event.invitationByline && (
            <p className="event-entry__byline">{event.invitationByline}</p>
          )}

          <dl className="event-entry__timing">
            {timingRows(event).map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            {assemblyPoint && (
              <div>
                <dt>Assembly point</dt>
                <dd>
                  <span>{assemblyPoint.label}</span>
                  <address>{assemblyPoint.address}</address>
                </dd>
              </div>
            )}
          </dl>

          <div className="event-entry__locations">
            {assemblyPoint && (
              <a
                href={directionsUrl(assemblyPoint.address)}
                rel="noreferrer"
                target="_blank"
              >
                Directions to {assemblyPoint.label.replace(/^Lobby Of /, "")}
              </a>
            )}
            <div className="event-entry__venue">
              <h4>Venue</h4>
              <p>{event.venue.name}</p>
              <address>{event.venue.address}</address>
              <a
                href={directionsUrl(event.venue.address)}
                rel="noreferrer"
                target="_blank"
              >
                Directions to {isJaggo ? "Jaggo venue" : event.venue.name}
              </a>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function EventIndex() {
  return (
    <section
      aria-labelledby="celebrations-title"
      className="event-index"
      id="celebrations"
    >
      <div className="event-index__heading">
        <h2 id="celebrations-title">Every celebration, at a glance</h2>
        <p>Dates, gathering times, and venues for the celebrations ahead.</p>
      </div>
      <ol className="event-index__list">
        {wedding.events.map((event) => (
          <EventEntry event={event} key={event.id} />
        ))}
      </ol>
    </section>
  );
}
