(() => {
  const panels = document.getElementById("eventPanels");
  const events = window.weddingInvitationEvents;
  if (!panels || !Array.isArray(events)) return;
  const artworkVersions = {
    engagement: "-v3",
    sagan: "-v2",
    jaggo: "-v2",
    "anand-karaj": "-v4",
    "wedding-celebration": "-v2",
  };
  const eventVideos = {
    engagement: "engagement-motion.mp4?rev=20261029",
    sagan: "sagan-motion.mp4",
    jaggo: "jaggo-motion.mp4",
    "haldi-mehendi": "haldi-mehendi-motion.mp4?rev=20261029-v2",
    "anand-karaj": "anand-karaj-motion.mp4?rev=20261030-v4",
    "wedding-celebration": "celebration-motion.mp4?rev=20261029",
  };

  const scenes = {
    engagement: {
      title: "Engagement",
      subtitle: "Lights, Glitz & Glam",
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

  const locationMarkup = ({ label, name, address, directionLabel, time, mapAddress, mapUrl }) => {
    const accessibleDirectionLabel = label === "Assembly point"
      ? `Directions to assembly at ${name}`
      : `Directions to venue at ${name}`;

    return `
      <div class="event-location">
        <span class="event-location__label">${escapeHtml(label)}</span>
        <strong class="event-location__name">${escapeHtml(name)}</strong>
        ${time ? `<span class="event-location__time">${escapeHtml(time)}</span>` : ""}
        <p class="event-location__address">${escapeHtml(address)}</p>
        <a class="event-action event-action--directions" href="${escapeHtml(mapUrl || mapsUrl(mapAddress || (address ? `${name}, ${address}` : name)))}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(accessibleDirectionLabel)}">
          ${escapeHtml(directionLabel)} <span aria-hidden="true">↗</span>
        </a>
      </div>`;
  };

  const renderLocation = (event) => {
    const parts = [];

    if (event.assembly) {
      const assemblyName = event.assembly;
      parts.push(locationMarkup({
        label: "Assembly point",
        name: assemblyName,
        address: stripLeadingPlace(event.assemblyAddress || "", event.assembly),
        directionLabel: "Directions to assembly",
        time: event.assemblyTime ? `Assembly at ${event.assemblyLabel}` : "",
        mapAddress: event.assemblyMapAddress || event.assemblyAddress || assemblyName,
      }));
    }

    parts.push(locationMarkup({
      label: "Venue",
      name: event.venue,
      address: stripLeadingPlace(event.venueAddress, event.venue),
      directionLabel: event.assembly ? "Directions to venue" : "Get directions",
      time: "",
      mapAddress: event.venueMapAddress || event.venueAddress,
      mapUrl: event.venueMapUrl,
    }));

    return parts.join("");
  };

  const renderEvent = (event, index) => {
    const scene = scenes[event.id];
    if (!scene) return "";

    const asset = `images/${event.id}-portrait-motion${artworkVersions[event.id] || ""}`;
    const eventTime = event.start === "assembly"
      ? `${event.timeLabel} onwards`
      : event.start === "ceremony"
        ? `Ceremony · ${event.timeLabel}`
        : event.timeLabel;
    const loading = index === 0 ? "eager" : "lazy";
    const fetchPriority = index === 0 ? "high" : "auto";
    const video = eventVideos[event.id]
      ? `<video
            class="event-panel__video"
            data-video-src="videos/${escapeHtml(eventVideos[event.id])}"
            width="720"
            height="1080"
            muted
            playsinline
            preload="none"
            aria-hidden="true"
            tabindex="-1"
          ></video>`
      : "";

    return `
      <article
        class="event-panel"
        id="event-${escapeHtml(event.id)}"
        data-transition="${scene.transition}"
        data-art="${asset}-1024.avif"
        data-color="${scene.color}"
        style="--scene-color:${scene.color};--scene-accent:${scene.accent}${scenes[events[index + 1]?.id] ? `;--next-color:color-mix(in srgb, ${scenes[events[index + 1].id].color} 78%, #0b1014)` : ""}"
        aria-labelledby="event-title-${escapeHtml(event.id)}"
      >
        <header class="event-panel__heading">
          <h3 class="event-title event-copy event-copy--title" id="event-title-${escapeHtml(event.id)}">${escapeHtml(scene.title)}</h3>
          <div class="event-panel__schedule">
            <time class="event-date event-copy event-copy--date" datetime="${escapeHtml(event.date)}">${escapeHtml(dateLabel(event.date))}</time>
            <p class="event-time event-copy event-copy--time">${escapeHtml(eventTime)}</p>
          </div>
        </header>
        <div class="event-panel__media">
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
            ${video}
            <div class="event-panel__shade" aria-hidden="true"></div>
          </div>
        </div>
        <div class="event-panel__details">
          <div class="event-panel__content">
            ${scene.subtitle ? `<p class="event-subtitle event-copy event-copy--subtitle">${escapeHtml(scene.subtitle)}</p>` : ""}
            ${event.id === "haldi-mehendi" ? `<p class="event-quote event-copy event-copy--quote"><strong>${escapeHtml(event.line)}</strong></p>` : ""}
            <div class="event-title-rule event-copy event-copy--rule" aria-hidden="true"><span></span><i></i><span></span></div>
            <div class="event-locations event-copy event-copy--locations">${renderLocation(event)}</div>
            <div class="event-actions event-copy event-copy--actions">
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
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const loadArtwork = (panel) => {
    if (!panel || panel.classList.contains("art-ready")) return;
    panel.style.setProperty("--scene-art", cssImageUrl(panel.dataset.art));

    const nextPanel = panel.nextElementSibling;
    if (nextPanel?.matches(".event-panel")) {
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

    if (!reducedMotion.matches) {
      const panelRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-entered");
          panelRevealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.05 });

      scenesInOrder.forEach((panel) => panelRevealObserver.observe(panel));
      document.body.classList.add("has-festivities-motion");

      const copyRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-entered");
          copyRevealObserver.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -72px 0px", threshold: 0 });

      scenesInOrder.forEach((panel) => {
        panel.querySelectorAll(".event-copy").forEach((copy) => copyRevealObserver.observe(copy));
      });
    }
  } else {
    scenesInOrder.forEach(loadArtwork);
    scenesInOrder.forEach((panel) => panel.classList.add("is-entered"));
  }

  const panelsWithVideo = scenesInOrder.filter((panel) => panel.querySelector(".event-panel__video"));
  if ("IntersectionObserver" in window && panelsWithVideo.length) {
    const visibleVideoPanels = new Set();
    const syncVideo = (panel) => {
      const video = panel.querySelector(".event-panel__video");
      if (reducedMotion.matches) {
        panel.classList.remove("event-panel--video-ready");
        video.pause();
        return;
      }
      if (document.hidden || !visibleVideoPanels.has(panel)) {
        video.pause();
        return;
      }
      if (video.ended) {
        video.pause();
        return;
      }

      if (!video.src) {
        video.src = window.__weddingPreloadedVideoSources?.[video.dataset.videoSrc]
          || pageAssetUrl(video.dataset.videoSrc);
        video.preload = "metadata";
        video.load();
      }

      video.play().catch(() => {
        // The poster and matching illustration stay visible if autoplay fails.
      });
    };

    panelsWithVideo.forEach((panel) => {
      const video = panel.querySelector(".event-panel__video");
      video.addEventListener("playing", () => panel.classList.add("event-panel--video-ready"));
      video.addEventListener("ended", () => {
        video.pause();
        panel.classList.add("event-panel--video-ready");
      });
      video.addEventListener("error", () => panel.classList.remove("event-panel--video-ready"));
    });

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleVideoPanels.add(entry.target);
        else visibleVideoPanels.delete(entry.target);
        syncVideo(entry.target);
      });
    }, { rootMargin: "0px", threshold: 0 });

    panelsWithVideo.forEach((panel) => videoObserver.observe(panel));
    document.addEventListener("visibilitychange", () => panelsWithVideo.forEach(syncVideo));
    reducedMotion.addEventListener?.("change", () => panelsWithVideo.forEach(syncVideo));
  }

  const initialPanel = document.getElementById(window.location.hash.slice(1));
  if (initialPanel?.matches(".event-panel")) {
    window.requestAnimationFrame(() => {
      loadArtwork(initialPanel);
      initialPanel.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
})();
