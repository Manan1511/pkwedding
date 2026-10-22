import { useEffect, useState } from "react";
import { wedding } from "../data/wedding";
import { formatWeddingDate, istToUtc } from "../lib/dates";
import InvitationActions from "./InvitationActions";

const countdownUnits = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

function getCountdown(now: number) {
  const target = istToUtc(
    wedding.countdownTarget.date,
    wedding.countdownTarget.time.value,
  ).getTime();
  let remaining = Math.max(0, Math.floor((target - now) / 1000));

  const days = Math.floor(remaining / 86_400);
  remaining %= 86_400;
  const hours = Math.floor(remaining / 3_600);
  remaining %= 3_600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return { days, hours, minutes, seconds };
}

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  const countdown = getCountdown(now);
  const target = istToUtc(
    wedding.countdownTarget.date,
    wedding.countdownTarget.time.value,
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section aria-labelledby="countdown-title" className="countdown">
      <div className="countdown__intro">
        <h2 id="countdown-title">Until Anand Karaj</h2>
        <p>
          <time dateTime={target.toISOString()}>
            {formatWeddingDate(wedding.countdownTarget.date)} at{" "}
            {wedding.countdownTarget.time.label} IST
          </time>
        </p>
      </div>
      <ul aria-live="off" className="countdown__units">
        {countdownUnits.map(({ key, label }) => (
          <li key={key}>
            <span className="countdown__number" data-countdown-unit={key}>
              {String(countdown[key]).padStart(2, "0")}
            </span>
            <span className="countdown__label">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FamilyProfile({
  label,
  family,
}: {
  label: string;
  family: (typeof wedding.families)["bride"];
}) {
  return (
    <section className="family-profile">
      <p className="family-profile__side">{label}</p>
      <h3>{family.name}</h3>
      <dl>
        <div>
          <dt>Father</dt>
          <dd>{family.father}</dd>
        </div>
        <div>
          <dt>Mother</dt>
          <dd>{family.mother}</dd>
        </div>
        <div>
          <dt>Dada Ji</dt>
          <dd>{family.dadaJi}</dd>
        </div>
        <div>
          <dt>Dadi</dt>
          <dd>{family.dadi}</dd>
        </div>
      </dl>
    </section>
  );
}

export default function WelcomeScene() {
  const firstEvent = wedding.events[0];
  const lastEvent = wedding.events[wedding.events.length - 1];

  return (
    <section aria-labelledby="welcome-title" className="welcome-scene" id="welcome">
      <div className="welcome-hero">
        <picture aria-hidden="true" className="welcome-hero__artwork">
          <source
            sizes="100vw"
            srcSet="/images/welcome-courtyard-768.webp 768w, /images/welcome-courtyard-1536.webp 1536w"
          />
          <img
            alt=""
            fetchPriority="high"
            src="/images/welcome-courtyard-1536.png"
          />
        </picture>
        <div className="welcome-hero__shade" />
        <div className="welcome-hero__copy">
          <p className="welcome-hero__blessing">{wedding.invitationCopy.blessing}</p>
          <h1 id="welcome-title" tabIndex={-1}>
            {wedding.families.bride.name.split(" ")[0]} <span>&amp;</span>{" "}
            {wedding.families.groom.name.split(" ")[0]}
          </h1>
          <p className="welcome-hero__full-names">
            {wedding.families.bride.name} <span aria-hidden="true">·</span>{" "}
            {wedding.families.groom.name}
          </p>
          <p className="welcome-hero__date-range">
            {formatWeddingDate(firstEvent.date)} <span>to</span>{" "}
            {formatWeddingDate(lastEvent.date)}
          </p>
          <p className="welcome-hero__introduction">
            {wedding.invitationCopy.introduction}
          </p>
          <div className="welcome-hero__punjabi" lang="pa">
            {wedding.invitationCopy.punjabiBlessing.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <a className="welcome-hero__link" href="#event-engagement">
            Scroll into the celebrations
            <span className="scene-scroll-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function FamilyWelcome() {
  return (
      <section aria-labelledby="family-title" className="family-welcome illustrated-interlude" id="our-families" tabIndex={-1}>
        <svg aria-hidden="true" className="family-welcome__motif" viewBox="0 0 180 48" fill="none">
          <path pathLength="1" d="M4 25H55C70 25 75 7 90 7s20 18 35 18h51" />
          <path pathLength="1" d="M4 30H55C70 30 75 42 90 42s20-12 35-12h51" />
          <path d="M72 20c2-7 7-10 13-10-1 6-5 10-13 10ZM108 29c-2 7-7 10-13 10 1-6 5-10 13-10Z" />
          <circle cx="90" cy="24" r="4" />
        </svg>
        <div className="family-welcome__heading">
          <h2 id="family-title">With the love and blessings of our families</h2>
          <p>{wedding.invitationCopy.closing}</p>
        </div>
        <div className="family-welcome__profiles">
          <FamilyProfile family={wedding.families.bride} label="Bride’s family" />
          <FamilyProfile family={wedding.families.groom} label="Groom’s family" />
        </div>
        <InvitationActions />
      </section>
  );
}
