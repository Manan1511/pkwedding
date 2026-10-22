import { wedding } from "../data/wedding";
import { formatWeddingDate } from "../lib/dates";
import { directionsUrl } from "../lib/maps";

function PhulkariRule() {
  return (
    <svg
      aria-hidden="true"
      className="jaggo-scene__phulkari"
      preserveAspectRatio="none"
      viewBox="0 0 800 40"
    >
      <defs>
        <pattern
          height="40"
          id="jaggo-phulkari-diamonds"
          patternUnits="userSpaceOnUse"
          width="42"
        >
          <path
            d="M21 2 39 20 21 38 3 20Z M21 2v36M3 20h36"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="m21 13 7 7-7 7-7-7Z" fill="currentColor" />
        </pattern>
      </defs>
      <rect fill="url(#jaggo-phulkari-diamonds)" height="40" width="800" />
    </svg>
  );
}

export default function JaggoScene() {
  const jaggo = wedding.events.find((event) => event.id === "jaggo");

  if (!jaggo || jaggo.timing.kind !== "assembly") {
    throw new Error("Jaggo event timing is missing from the shared wedding data.");
  }

  const assemblyPoint = wedding.assemblyPoints[jaggo.timing.assembly.pointId];

  return (
    <section
      aria-labelledby="jaggo-title"
      className="jaggo-scene"
      data-theme={jaggo.sceneTheme}
      id="event-jaggo"
      tabIndex={-1}
    >
      <div className="jaggo-stage">
      <picture aria-hidden="true" className="jaggo-scene__artwork">
        <img
          alt=""
          loading="lazy"
          sizes="100vw"
          src="/images/jaggo-courtyard-768.png"
          srcSet="/images/jaggo-courtyard-768.png 768w, /images/jaggo-courtyard-1536.png 1536w"
        />
      </picture>
      <div aria-hidden="true" className="jaggo-scene__light" />
      <div aria-hidden="true" className="jaggo-scene__shade" />
      <div aria-hidden="true" className="jaggo-scene__trim">
        <PhulkariRule />
      </div>
      <div className="jaggo-lanterns" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <svg key={item} viewBox="0 0 48 200" className={`jaggo-lantern jaggo-lantern--${item}`}>
            <path d="M24 0v112M15 112h18l9 17-7 32H13l-7-32 9-17ZM6 129h36M13 161h22M24 164v23m-6-11h12" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="m24 127 5 17-5 9-5-9 5-17Z" fill="currentColor" />
          </svg>
        ))}
      </div>

      <div className="jaggo-scene__content">
        <div className="jaggo-scene__story">
          <h2 id="jaggo-title" aria-label={jaggo.title}>{jaggo.title.split(" • ").map((line, i) => <span className="jaggo-title-line" key={line}>{line}{i < 2 && <span className="jaggo-title-dot"> •</span>}</span>)}</h2>
          <p className="jaggo-scene__subtitle">{jaggo.subtitle}</p>
          <p className="jaggo-scene__date">{formatWeddingDate(jaggo.date)}</p>
          <p className="jaggo-scene__invitation">{jaggo.invitationLine}</p>
        </div>

        <details className="jaggo-details">
          <summary>{jaggo.timing.assembly.time.label} · Gathering &amp; directions <span aria-hidden="true">+</span></summary>
          <div className="jaggo-details__body">
          <dl>
            <div>
              <dt>Assembly time</dt>
              <dd>{jaggo.timing.assembly.time.label}</dd>
            </div>
            <div>
              <dt>Assembly point</dt>
              <dd>{assemblyPoint.label}</dd>
              <address>{assemblyPoint.address}</address>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{jaggo.venue.name}</dd>
              <address>{jaggo.venue.address}</address>
            </div>
          </dl>
          <div className="jaggo-details__directions">
            <a
              href={directionsUrl(assemblyPoint.address)}
              rel="noreferrer"
              target="_blank"
            >
              Directions to Tulip Inn Zirakpur
            </a>
            <a
              href={directionsUrl(jaggo.venue.address)}
              rel="noreferrer"
              target="_blank"
            >
              Directions to Jaggo venue
            </a>
          </div>
          </div>
        </details>
      </div>
      <div className="jaggo-firelight" aria-hidden="true" />
      </div>
    </section>
  );
}
