import { describe, expect, it } from "vitest";
import { wedding } from "../data/wedding";
import { calendarText } from "./invitationDownloads";

const unfolded = (value: string) => value.replace(/\r\n /g, "");

describe("guest calendar exports", () => {
  it("uses the Anand Karaj ceremony start in IST and preserves the earlier assembly", () => {
    const event = wedding.events.find(event => event.id === "anand-karaj")!;
    const calendar = unfolded(calendarText([event]));
    expect(calendar).toContain("DTSTART:20261206T043000Z");
    expect(calendar).toContain("Assembly time: 9:00 am");
    expect(calendar).toContain("Ceremony time: 10:00 am");
    expect(calendar).not.toContain("DTEND");
  });
  it("clearly labels assembly-only events and starts them at the assembly point", () => {
    const event = wedding.events.find(event => event.id === "jaggo")!;
    const calendar = unfolded(calendarText([event]));
    expect(calendar).toContain("SUMMARY:Jaggo Ceremony - Assembly");
    expect(calendar).toContain("DTSTART:20261204T140000Z");
    expect(calendar).toContain("LOCATION:Tulip Inn Zirakpur");
    expect(calendar).toContain("House no. 3200");
  });
  it("keeps all six events, overlapping Sunday starts, and valid byte folding", () => {
    const calendar = calendarText(wedding.events);
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(6);
    expect(calendar.match(/DTSTART:20261206T043000Z/g)).toHaveLength(2);
    expect(unfolded(calendar)).toContain("Punjab 140601");
    for (const line of calendar.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
});
