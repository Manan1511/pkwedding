import { wedding, type WeddingEvent } from "../data/wedding";
import { formatWeddingDate, istToUtc } from "./dates";

const couple = `${wedding.families.bride.name} & ${wedding.families.groom.name}`;

export function eventLines(event: WeddingEvent): string[] {
  const lines = [event.title, event.subtitle, formatWeddingDate(event.date)];
  if (event.timing.kind === "event") lines.push(`Time: ${event.timing.eventTime.label}`);
  if (event.timing.kind === "ceremony") lines.push(`Ceremony time: ${event.timing.ceremonyTime.label}`);
  const assembly = event.timing.kind === "event" ? undefined : event.timing.assembly;
  if (assembly) {
    const point = wedding.assemblyPoints[assembly.pointId];
    lines.push(`Assembly time: ${assembly.time.label}`, `Assembly point: ${point.label}`, point.address);
  }
  lines.push(`Venue: ${event.venue.name}`, event.venue.address);
  return lines;
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

const escapeIcs = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
const icsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

export function calendarText(events: readonly WeddingEvent[], now = new Date()): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pavgun and Ashmeet//Wedding Invitation//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
  for (const event of events) {
    const time = event.timing.kind === "event" ? event.timing.eventTime : event.timing.kind === "ceremony" ? event.timing.ceremonyTime : event.timing.assembly.time;
    lines.push("BEGIN:VEVENT", `UID:${event.id}-2026@pavgun-ashmeet.wedding`, `DTSTAMP:${icsDate(now)}`,
      `DTSTART:${icsDate(istToUtc(event.date, time.value))}`,
      `SUMMARY:${escapeIcs(`${event.subtitle}${event.calendarStart === "assembly" ? " - Assembly" : ""} | ${couple}`)}`,
      `LOCATION:${escapeIcs(event.calendarStart === "assembly" && event.timing.kind === "assembly" ? wedding.assemblyPoints[event.timing.assembly.pointId].address : event.venue.address)}`,
      `DESCRIPTION:${escapeIcs(["All times are India Standard Time (IST).", ...eventLines(event)].join("\n"))}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  // Fold at UTF-8 byte boundaries, preserving Gurmukhi and punctuation if content changes.
  const encoder = new TextEncoder();
  return lines.map(line => {
    let out = "", bytes = 0;
    for (const character of line) {
      const size = encoder.encode(character).length;
      if (bytes + size > 75) { out += "\r\n "; bytes = 1; }
      out += character; bytes += size;
    }
    return out;
  }).join("\r\n") + "\r\n";
}

export function downloadCalendar(events: readonly WeddingEvent[] = wedding.events) {
  save(new Blob([calendarText(events)], { type: "text/calendar;charset=utf-8" }), events.length === 1 ? `${events[0].id}.ics` : "pavgun-ashmeet-all-celebrations.ics");
}

/** A fresh, text-based PDF itinerary generated from the same facts as the invitation. */
export function downloadItinerary() {
  const plain = (s: string) => s.replace(/•/g, " - ").replace(/[–—]/g, "-").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, "");
  const escaped = (s: string) => plain(s).replace(/[\\()]/g, "\\$&");
  const wrap = (line: string, size: number) => {
    const words = plain(line).split(/\s+/), lines: string[] = [];
    let current = "";
    for (const word of words) {
      if ((current + " " + word).length > size && current) { lines.push(current); current = word; }
      else current += (current ? " " : "") + word;
    }
    if (current) lines.push(current);
    return lines;
  };
  const objects: string[] = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>"];
  const pages: number[] = [];
  for (let pageIndex = 0; pageIndex < 2; pageIndex++) {
    let stream = "0.34 0.15 0.2 rg\n";
    const text = (s: string, x: number, y: number, size: number, font = "F1") => { stream += `BT /${font} ${size} Tf ${x} ${y} Td (${escaped(s)}) Tj ET\n`; };
    text(couple, 48, 788, 25, "F2");
    text("Wedding celebrations | All times IST", 48, 762, 10);
    let y = 715;
    wedding.events.slice(pageIndex * 3, pageIndex * 3 + 3).forEach(event => {
      text(event.title, 48, y, 19, "F2"); y -= 24;
      eventLines(event).slice(1).forEach(line => wrap(line, 88).forEach(part => { text(part, 48, y, 10); y -= 15; }));
      y -= 30;
    });
    text(`${pageIndex + 1} / 2 - With love, the Thapar and Sohal families`, 48, 36, 9);
    const pageId = objects.length + 1;
    const contentId = pageId + 1;
    pages.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
  }
  objects[1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map(p => `${p} 0 R`).join(" ")}] >>`;
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach(offset => { pdf += `${String(offset).padStart(10, "0")} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  save(new Blob([pdf], { type: "application/pdf" }), "pavgun-ashmeet-itinerary.pdf");
}
