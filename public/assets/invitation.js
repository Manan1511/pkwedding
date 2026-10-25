(() => {
  const couple = "Pavgun Kaur & Ashmeet Singh Sohal";
  const events = [
    {
      id: "engagement", title: "Lights, Glitz & Glam", subtitle: "Engagement", date: "2026-11-28", time: "19:00", timeLabel: "7:00 PM onwards", start: "event",
      venue: "The Imperium Beyond Luxury", venueAddress: "The Imperium Beyond Luxury, A-14, Mahatma Gandhi Rd, Block A, Wazirpur Industrial Area, Ashok Vihar, Delhi, 110052",
      line: "An evening of love, laughter & celebration",
    },
    {
      id: "sagan", title: "Sagan Ceremony", subtitle: "Sagan", date: "2026-12-04", time: "11:00", timeLabel: "11:00 AM", start: "assembly",
      assembly: "Dhillon Plaza", assemblyAddress: "Dhillon Plaza, Zirakpur, Punjab 140603",
      venue: "House no. 3200", venueAddress: "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      line: "Auspicious Beginnings & Shagna Di Shuruaat",
    },
    {
      id: "jaggo", title: "Dhol Vajda • Dil Nachda • Jashan Sajda", subtitle: "Jaggo Ceremony", date: "2026-12-04", time: "19:30", timeLabel: "7:30 PM", start: "assembly",
      assembly: "Lobby of Tulip Inn Zirakpur", assemblyAddress: "Tulip Inn Zirakpur, Chandigarh–Ambala Road, near Indian Oil Petrol Pump",
      venue: "House no. 3200", venueAddress: "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      line: "Nachdi Raat, Khushiyan De Naal!",
    },
    {
      id: "haldi-mehendi", title: "Mehfil-e-Mela", subtitle: "Haldi & Mehendi", date: "2026-12-05", time: "11:00", timeLabel: "11:00 AM", start: "assembly",
      assembly: "Lobby of Tulip Inn Zirakpur", assemblyAddress: "Tulip Inn Zirakpur, Chandigarh–Ambala Road, near Indian Oil Petrol Pump",
      venue: "House no. 3200", venueAddress: "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      line: "Meri bua ke mehndi mein zaroor aana — from Meher Kaur Thapar",
    },
    {
      id: "anand-karaj", title: "Anand Karaj", subtitle: "Anand Karaj", date: "2026-12-06", time: "10:00", timeLabel: "10:00 AM", start: "ceremony",
      assembly: "Lobby of Tulip Inn Zirakpur", assemblyAddress: "Tulip Inn Zirakpur, Chandigarh–Ambala Road, near Indian Oil Petrol Pump", assemblyTime: "09:00", assemblyLabel: "9:00 AM",
      venue: "Guru Kirpa Dashmesh Darbar", venueAddress: "Guru Kirpa Dashmesh Darbar, Rampur Kalan, Zirakpur Rajpura Road, Behind Pappi Dhaba Mohali, 140601",
      line: "Two souls united in the presence of Waheguru Ji",
    },
    {
      id: "wedding-celebration", title: "Shagna Da Rang", subtitle: "Wedding Celebration", date: "2026-12-06", time: "10:00", timeLabel: "10:00 AM onwards", start: "event",
      venue: "Crystal Resorts", venueAddress: "Crystal Resorts, Rampur Kalan, Patiala Road, Zirakpur, Punjab 140601",
      line: "Ajj Nachna, Gaunna Te Khushiyan Manana!",
    },
  ];
  window.weddingInvitationEvents = events;

  const pad = (value) => String(value).padStart(2, "0");
  const dateLabel = (value) => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    });
  };
  const eventLines = (event) => {
    const lines = [event.title, dateLabel(event.date)];
    if (event.start === "event") lines.push(`Time: ${event.timeLabel}`);
    if (event.start === "ceremony") lines.push(`Ceremony time: ${event.timeLabel}`);
    if (event.assemblyTime) lines.push(`Assembly time: ${event.assemblyLabel}`);
    else if (event.start === "assembly") lines.push(`Assembly time: ${event.timeLabel}`);
    if (event.assembly) lines.push(`Assembly point: ${event.assembly}`, event.assemblyAddress);
    lines.push(`Venue: ${event.venue}`, event.venueAddress);
    return lines;
  };
  const save = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = filename; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  const escapeIcs = (value) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
  const icsDate = (value) => value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const foldLine = (line) => {
    const encoder = new TextEncoder();
    let result = ""; let bytes = 0;
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (bytes + size > 75) { result += "\r\n "; bytes = 1; }
      result += character; bytes += size;
    }
    return result;
  };
  const calendarText = (items) => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pavgun and Ashmeet//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    for (const event of items) {
      const time = event.start === "assembly" ? event.time : event.start === "ceremony" ? event.time : event.time;
      const [year, month, day] = event.date.split("-").map(Number);
      const [hour, minute] = time.split(":").map(Number);
      const begins = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
      const location = event.start === "assembly" ? event.assemblyAddress : event.venueAddress;
      const summary = `${event.subtitle}${event.start === "assembly" ? " - Assembly" : ""} | ${couple}`;
      const description = ["All times are India Standard Time (IST).", ...eventLines(event)].join("\n");
      lines.push("BEGIN:VEVENT", `UID:${event.id}-2026@pavgun-ashmeet.wedding`, `DTSTAMP:${icsDate(new Date())}`,
        `DTSTART:${icsDate(begins)}`, `SUMMARY:${escapeIcs(summary)}`, `LOCATION:${escapeIcs(location)}`,
        `DESCRIPTION:${escapeIcs(description)}`, "END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.map(foldLine).join("\r\n") + "\r\n";
  };
  const downloadCalendar = (items) => {
    save(new Blob([calendarText(items)], { type: "text/calendar;charset=utf-8" }), items.length === 1 ? `${items[0].id}.ics` : "pavgun-ashmeet-all-celebrations.ics");
  };
  const plain = (value) => value.replace(/•/g, " - ").replace(/[–—]/g, "-").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, "");
  const escapedPdf = (value) => plain(value).replace(/[\\()]/g, "\\$&");
  const wrap = (line, max) => {
    const words = plain(line).split(/\s+/); const lines = []; let current = "";
    for (const word of words) {
      if ((current + " " + word).length > max && current) { lines.push(current); current = word; }
      else current += (current ? " " : "") + word;
    }
    if (current) lines.push(current);
    return lines;
  };
  const downloadItinerary = () => {
    const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>"];
    const pages = [];
    for (let pageIndex = 0; pageIndex < 2; pageIndex++) {
      let stream = "0.34 0.15 0.2 rg\n";
      const text = (value, x, y, size, font = "F1") => { stream += `BT /${font} ${size} Tf ${x} ${y} Td (${escapedPdf(value)}) Tj ET\n`; };
      text(couple, 48, 788, 25, "F2"); text("Wedding celebrations | All times IST", 48, 762, 10);
      let y = 715;
      events.slice(pageIndex * 3, pageIndex * 3 + 3).forEach((event) => {
        text(event.title, 48, y, 18, "F2"); y -= 23;
        eventLines(event).slice(1).forEach((line) => wrap(line, 88).forEach((part) => { text(part, 48, y, 10); y -= 15; }));
        y -= 25;
      });
      text(`${pageIndex + 1} / 2 - With love, the Thapar and Sohal families`, 48, 36, 9);
      const pageId = objects.length + 1; const contentId = pageId + 1;
      pages.push(pageId);
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
      objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
    }
    objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((page) => `${page} 0 R`).join(" ")} ] >>`;
    let pdf = "%PDF-1.4\n"; const offsets = [0];
    objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    save(new Blob([pdf], { type: "application/pdf" }), "pavgun-ashmeet-itinerary.pdf");
  };

  document.addEventListener("click", (clickEvent) => {
    const button = clickEvent.target.closest("[data-calendar-download]");
    if (!button) return;
    const key = button.dataset.calendarDownload;
    const selected = key === "all" ? events : events.filter((event) => event.id === key);
    if (selected.length) downloadCalendar(selected);
  });
  document.querySelectorAll("[data-itinerary-download]").forEach((button) => button.addEventListener("click", downloadItinerary));

  const audio = document.getElementById("weddingAudio");
  document.querySelectorAll(".music-toggle").forEach((button) => {
    const updateButton = (playing) => {
      button.setAttribute("aria-pressed", String(playing));
      button.innerHTML = `<span aria-hidden="true">${playing ? "Ⅱ" : "♫"}</span> ${playing ? "Mute music" : "Play music"}`;
    };
    if (!audio) { button.hidden = true; return; }
    button.addEventListener("click", async () => {
      if (audio.paused) {
        try { await audio.play(); updateButton(true); }
        catch (_) { button.textContent = "Tap to retry music"; }
      } else { audio.pause(); updateButton(false); }
    });
    audio.addEventListener("pause", () => updateButton(false));
    audio.addEventListener("play", () => updateButton(true));
    document.addEventListener("visibilitychange", () => { if (document.hidden) audio.pause(); });
  });

  const revealItems = document.querySelectorAll(".scroll-reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("is-visible"));
})();
