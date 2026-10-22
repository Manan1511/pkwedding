import { wedding } from "../data/wedding";

export default function EventNav() {
  return (
    <nav aria-label="Celebration shortcuts" className="event-nav">
      <ul>
        {wedding.events.map((event) => (
          <li key={event.id}>
            <a className="event-nav__link" href={`#event-${event.id}`}>
              {event.id === "anand-karaj" ? event.title : event.subtitle}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
