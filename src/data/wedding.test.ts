import { describe, expect, it } from "vitest";
import { formatWeddingDate, istToUtc } from "../lib/dates";
import { wedding } from "./wedding";

describe("shared wedding data", () => {
  it("keeps all six events in the confirmed chronological order", () => {
    expect(wedding.events.map(({ id, date }) => [id, date])).toEqual([
      ["engagement", "2026-11-28"],
      ["sagan", "2026-12-04"],
      ["jaggo", "2026-12-04"],
      ["haldi-mehendi", "2026-12-05"],
      ["anand-karaj", "2026-12-06"],
      ["wedding-celebration", "2026-12-06"],
    ]);
  });

  it("formats the confirmed weekday corrections for every date", () => {
    expect(
      ["2026-11-28", "2026-12-04", "2026-12-05", "2026-12-06"].map(
        formatWeddingDate,
      ),
    ).toEqual([
      "Saturday, November 28, 2026",
      "Friday, December 4, 2026",
      "Saturday, December 5, 2026",
      "Sunday, December 6, 2026",
    ]);
  });

  it("distinguishes event, ceremony, and assembly times and their calendar starts", () => {
    expect(
      wedding.events.map((event) => {
        switch (event.timing.kind) {
          case "event":
            return [
              event.id,
              event.timing.kind,
              event.timing.eventTime.value,
              event.timing.eventTime.label,
              event.calendarStart,
            ];
          case "ceremony":
            return [
              event.id,
              event.timing.kind,
              event.timing.ceremonyTime.value,
              event.timing.ceremonyTime.label,
              event.timing.assembly?.time.value,
              event.timing.assembly?.pointId,
              event.calendarStart,
            ];
          case "assembly":
            return [
              event.id,
              event.timing.kind,
              event.timing.assembly.time.value,
              event.timing.assembly.time.label,
              event.timing.assembly.pointId,
              event.calendarStart,
            ];
        }
      }),
    ).toEqual([
      ["engagement", "event", "19:00", "7 pm onwards", "event"],
      ["sagan", "assembly", "11:00", "11 am", "dhillon-plaza", "assembly"],
      ["jaggo", "assembly", "19:30", "7:30 pm", "tulip-inn", "assembly"],
      [
        "haldi-mehendi",
        "assembly",
        "11:00",
        "11:00 am",
        "tulip-inn",
        "assembly",
      ],
      [
        "anand-karaj",
        "ceremony",
        "10:00",
        "10:00 am",
        "09:00",
        "tulip-inn",
        "ceremony",
      ],
      ["wedding-celebration", "event", "10:00", "10:00 am onwards", "event"],
    ]);
  });

  it("preserves the supplied venue addresses and reuses assembly locations", () => {
    expect(wedding.events.map(({ id, venue }) => [id, venue.address])).toEqual([
      [
        "engagement",
        "The Imperium Beyond Luxury, A-14, Mahatma Gandhi Rd, Block A, Wazirpur Industrial Area, Ashok Vihar, Delhi, 110052",
      ],
      [
        "sagan",
        "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      ],
      [
        "jaggo",
        "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      ],
      [
        "haldi-mehendi",
        "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      ],
      [
        "anand-karaj",
        "Guru Kirpa Dashmesh Darbar, Rampur Kalan, Zirakpur Rajpura Road, Behind Pappi Dhaba Mohali, 140601",
      ],
      [
        "wedding-celebration",
        "Crystal Resorts, Rampur Kalan, Patiala Road, Zirakpur, Punjab 140601",
      ],
    ]);
    expect(wedding.assemblyPoints["dhillon-plaza"]).toEqual({
      id: "dhillon-plaza",
      label: "Dhillon Plaza",
      address: "Dhillon Plaza, Zirakpur, Punjab 140603",
    });
    expect(wedding.assemblyPoints["tulip-inn"]).toEqual({
      id: "tulip-inn",
      label: "Lobby Of Tulip Inn",
      address:
        "Tulip Inn Zirakpur, Chandigarh–Ambala Road, near Indian Oil Petrol Pump",
    });
  });

  it("preserves each supplied family name and the invitation blessing", () => {
    expect(wedding.families).toEqual({
      bride: {
        name: "Pavgun Kaur",
        father: "S. Sarabdeep Singh Thapar",
        mother: "Sdn. Rajwinder Kaur",
        dadaJi: "Late. S. Harjeet Singh Thapar",
        dadi: "Late. Sdn. Kulwinder Kaur",
      },
      groom: {
        name: "Ashmeet Singh Sohal",
        father: "S. Harminder Singh Sohal",
        mother: "Sdn. Sukhjeet Kaur",
        dadaJi: "Late. S. Nirmal Singh Sohal",
        dadi: "Sdn. Baljit Kaur Sohal",
      },
    });
    expect(wedding.invitationCopy).toEqual({
      blessing: "With the blessings of Waheguru Ji and our beloved elders",
      punjabiBlessing: [
        "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
        "ਕੀਤਾ ਲੋੜੀਐ ਕੰਮ, ਸੋ ਹਰਿ ਪਹਿ ਆਖੀਐ।",
        "ਕਾਰਜੁ ਦੇਇ ਸਵਾਰਿ, ਸਤਿਗੁਰ ਸਚੁ ਸਾਖੀਐ ॥",
      ],
      introduction:
        "We invite you to join us in celebrating the beautiful union of our families as our beloved children begin their journey together",
      closing:
        "Your presence and blessings will make our celebrations truly special",
    });
  });

  it("keeps both Sunday celebrations on the same confirmed date", () => {
    expect(
      wedding.events
        .filter(({ id }) => id === "anand-karaj" || id === "wedding-celebration")
        .map(({ date }) => date),
    ).toEqual(["2026-12-06", "2026-12-06"]);
  });

  it("converts the 10 am IST countdown target to the correct UTC instant", () => {
    expect(wedding.countdownTarget).toEqual({
      date: "2026-12-06",
      time: { value: "10:00", label: "10:00 am" },
      timeZone: "Asia/Kolkata",
    });
    expect(istToUtc("2026-12-06", "10:00").toISOString()).toBe(
      "2026-12-06T04:30:00.000Z",
    );
  });

  it("rejects impossible IST dates and clock times", () => {
    expect(() => istToUtc("2026-02-30", "10:00")).toThrow(RangeError);
    expect(() => istToUtc("2026-12-06", "24:00")).toThrow(RangeError);
  });
});
