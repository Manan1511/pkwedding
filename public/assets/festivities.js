(() => {
  const panels = document.getElementById("eventPanels");
  const events = window.weddingInvitationEvents;
  if (!panels || !Array.isArray(events)) return;

  const scenes = {
    engagement: {
      title: "Lights, Glitz & Glam",
      subtitle: "Engagement",
      transition: "emerald",
      color: "#172a27",
      accent: "#e4c98d",
    },
    sagan: {
      title: "Sagan Ceremony",
      subtitle: "Auspicious Beginnings & Shagna Di Shuruaat",
      transition: "curtain",
      color: "#54212f",
      accent: "#f0c980",
    },
    jaggo: {
      title: "Jaggo Ceremony",
      subtitle: "Dhol Vajda • Dil Nachda • Jashan Sajda",
      transition: "nightfall",
      color: "#161a38",
      accent: "#f6b45b",
    },
    "haldi-mehendi": {
      title: "Mehfil-e-Mela",
      subtitle: "Haldi & Mehendi",
      transition: "sunrise",
      color: "#35492f",
      accent: "#f6d176",
    },
    "anand-karaj": {
      title: "Anand Karaj",
      subtitle: "",
      transition: "morning",
      color: "#647b83",
      accent: "#f1dcaa",
    },
    "wedding-celebration": {
      title: "Shagna Da Rang",
      subtitle: "Wedding Celebration",
      transition: "blossom",
      color: "#552333",
      accent: "#f2cba7",
    },
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);

  const stripLeadingPlace = (address, place) => {
    const escapedPlace = place.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return address.replace(new RegExp(`^${escapedPlace}\\s*,?\\s*`, "i"), "");
  };

  const mapsUrl = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const pageAssetUrl = (path) => new URL(path, document.baseURI).href;
  const cssImageUrl = (path) => `url("${pageAssetUrl(path)}")`;

  const dateLabel = (date) => {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const locationMarkup = ({ label, name, address, directionLabel, time, mapAddress }) => {
    const accessibleDirectionLabel = label === "Assembly point"
      ? `Directions to assembly at ${name}`
      : `Directions to venue at ${name}`;

    return `
      <div class="event-location">
        <span class="event-location__label">${escapeHtml(label)}</span>
        <strong class="event-location__name">${escapeHtml(name)}</strong>
        ${time ? `<span class="event-location__time">${escapeHtml(time)}</span>` : ""}
        <p class="event-location__address">${escapeHtml(address)}</p>
        <a class="event-action event-action--directions" href="${escapeHtml(mapsUrl(mapAddress || (address ? `${name}, ${address}` : name)))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessibleDirectionLabel)}">
          ${escapeHtml(directionLabel)} <span aria-hidden="true">↗</span>
        </a>
      </div>`;
  };

  const renderLocation = (event) => {
    const parts = [];

    if (event.assembly) {
      const assemblyName = event.assembly.replace(/\s+Zirakpur$/i, "");
      parts.push(locationMarkup({
        label: "Assembly point",
        name: assemblyName,
        address: stripLeadingPlace(event.assemblyAddress || "", event.assembly),
        directionLabel: "Directions to assembly",
        time: event.assemblyTime ? `Assembly at ${event.assemblyLabel}` : "",
        mapAddress: event.assemblyAddress || assemblyName,
      }));
    }

    parts.push(locationMarkup({
      label: "Venue",
      name: event.venue,
      address: stripLeadingPlace(event.venueAddress, event.venue),
      directionLabel: event.assembly ? "Directions to venue" : "Get directions",
      time: "",
    }));

    return parts.join("");
  };

  const renderEvent = (event, index) => {
    const scene = scenes[event.id];
    if (!scene) return "";

    const asset = `images/${event.id}-portrait`;
    const eventTime = event.start === "assembly"
      ? `Assembly · ${event.timeLabel}`
      : event.start === "ceremony"
        ? `Ceremony · ${event.timeLabel}`
        : event.timeLabel;
    const loading = index === 0 ? "eager" : "lazy";
    const fetchPriority = index === 0 ? "high" : "auto";

    return `
      <article
        class="event-panel"
        id="event-${escapeHtml(event.id)}"
        data-transition="${scene.transition}"
        data-art="${asset}-1024.avif"
        data-color="${scene.color}"
        style="--scene-color:${scene.color};--scene-accent:${scene.accent}"
        aria-labelledby="event-title-${escapeHtml(event.id)}"
      >
        <div class="event-panel__portrait">
          <picture class="event-panel__picture" aria-hidden="true">
            <source
              type="image/avif"
              srcset="${asset}-768.avif 768w, ${asset}-1024.avif 1024w"
              sizes="(max-width: 720px) 100vw, 680px"
            />
            <source
              type="image/webp"
              srcset="${asset}-768.webp 768w, ${asset}-1024.webp 1024w"
              sizes="(max-width: 720px) 100vw, 680px"
            />
            <img
              src="${asset}-768.webp"
              width="1024"
              height="1536"
              loading="${loading}"
              decoding="async"
              fetchpriority="${fetchPriority}"
              alt=""
            />
          </picture>
          <div class="event-panel__shade" aria-hidden="true"></div>

          <div class="event-panel__content">
            <time class="event-date" datetime="${escapeHtml(event.date)}">${escapeHtml(dateLabel(event.date))}</time>
            <p class="event-time">${escapeHtml(eventTime)}</p>
            <h3 class="event-title" id="event-title-${escapeHtml(event.id)}">${escapeHtml(scene.title)}</h3>
            ${scene.subtitle ? `<p class="event-subtitle">${escapeHtml(scene.subtitle)}</p>` : ""}
            <div class="event-title-rule" aria-hidden="true"><span></span><i></i><span></span></div>
            <div class="event-locations">${renderLocation(event)}</div>
            <div class="event-actions">
              <button
                class="event-action event-action--calendar"
                type="button"
                data-calendar-download="${escapeHtml(event.id)}"
                aria-label="Save ${escapeHtml(scene.title)} to your calendar"
              >Save the date <span aria-hidden="true">↓</span></button>
            </div>
          </div>
        </div>
      </article>`;
  };

  panels.innerHTML = events.map(renderEvent).join("");

  const scenesInOrder = Array.from(panels.querySelectorAll(".event-panel"));
  const loadArtwork = (panel) => {
    if (!panel || panel.classList.contains("art-ready")) return;
    panel.style.setProperty("--scene-art", cssImageUrl(panel.dataset.art));

    const nextPanel = panel.nextElementSibling;
    if (nextPanel?.matches(".event-panel")) {
      panel.style.setProperty("--next-art", cssImageUrl(nextPanel.dataset.art));
      panel.style.setProperty("--next-color", nextPanel.dataset.color);
      panel.classList.add("has-next-scene");
    }
    panel.classList.add("art-ready");
  };

  if ("IntersectionObserver" in window) {
    const artworkObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadArtwork(entry.target);
        artworkObserver.unobserve(entry.target);
      });
    }, { rootMargin: "100% 0px" });

    scenesInOrder.forEach((panel) => artworkObserver.observe(panel));

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("has-festivities-motion");
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-entered");
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

      scenesInOrder.forEach((panel) => revealObserver.observe(panel));
    }
  } else {
    scenesInOrder.forEach(loadArtwork);
    scenesInOrder.forEach((panel) => panel.classList.add("is-entered"));
  }

  const initialPanel = document.getElementById(window.location.hash.slice(1));
  if (initialPanel?.matches(".event-panel")) {
    window.requestAnimationFrame(() => {
      loadArtwork(initialPanel);
      initialPanel.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
})();
