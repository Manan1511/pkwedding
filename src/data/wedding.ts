export type EventId =
  | "engagement"
  | "sagan"
  | "jaggo"
  | "haldi-mehendi"
  | "anand-karaj"
  | "wedding-celebration";

export type AssemblyPointId = "dhillon-plaza" | "tulip-inn";

export type SceneThemeId =
  | "emerald-champagne"
  | "ivory-maroon"
  | "indigo-fuchsia"
  | "turmeric-green"
  | "ivory-blue"
  | "ruby-blush";

export interface Venue {
  name: string;
  address: string;
}

export interface ClockTime {
  value: string;
  label: string;
}

export interface AssemblyPoint {
  id: AssemblyPointId;
  label: string;
  address: string;
}

export interface AssemblyDetails {
  time: ClockTime;
  pointId: AssemblyPointId;
}

interface EventContent {
  id: EventId;
  title: string;
  subtitle: string;
  date: string;
  venue: Venue;
  invitationLine: string;
  invitationByline?: string;
  sceneTheme: SceneThemeId;
}

export type WeddingEvent = EventContent &
  (
    | {
        timing: { kind: "event"; eventTime: ClockTime };
        calendarStart: "event";
      }
    | {
        timing: {
          kind: "ceremony";
          ceremonyTime: ClockTime;
          assembly?: AssemblyDetails;
        };
        calendarStart: "ceremony";
      }
    | {
        timing: { kind: "assembly"; assembly: AssemblyDetails };
        calendarStart: "assembly";
      }
  );

export interface FamilyProfile {
  name: string;
  father: string;
  mother: string;
  dadaJi: string;
  dadi: string;
}

export interface CoordinatorContact {
  name: string;
  phone: string;
}

export interface WeddingContent {
  events: readonly WeddingEvent[];
  assemblyPoints: Readonly<Record<AssemblyPointId, AssemblyPoint>>;
  families: {
    bride: FamilyProfile;
    groom: FamilyProfile;
  };
  invitationCopy: {
    blessing: string;
    punjabiBlessing: readonly string[];
    introduction: string;
    closing: string;
  };
  countdownTarget: {
    date: string;
    time: ClockTime;
    timeZone: "Asia/Kolkata";
  };
  coordinators: {
    brideSide: CoordinatorContact | null;
    groomSide: CoordinatorContact | null;
  };
}

export const wedding: WeddingContent = {
  events: [
    {
      id: "engagement",
      title: "Lights, Glitz & Glam",
      subtitle: "Engagement",
      date: "2026-11-28",
      venue: {
        name: "The Imperium Beyond Luxury",
        address:
          "The Imperium Beyond Luxury, A-14, Mahatma Gandhi Rd, Block A, Wazirpur Industrial Area, Ashok Vihar, Delhi, 110052",
      },
      invitationLine: "An evening of love, laughter & celebration",
      sceneTheme: "emerald-champagne",
      timing: {
        kind: "event",
        eventTime: { value: "19:00", label: "7 pm onwards" },
      },
      calendarStart: "event",
    },
    {
      id: "sagan",
      title: "Sagan Ceremony",
      subtitle: "Sagan",
      date: "2026-12-04",
      venue: {
        name: "House no. 3200, GMADA Aerocity",
        address:
          "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      },
      invitationLine: "Auspicious Beginnings & Shagna Di Shuruaat",
      sceneTheme: "ivory-maroon",
      timing: {
        kind: "assembly",
        assembly: {
          time: { value: "11:00", label: "11 am" },
          pointId: "dhillon-plaza",
        },
      },
      calendarStart: "assembly",
    },
    {
      id: "jaggo",
      title: "Dhol Vajda • Dil Nachda • Jashan Sajda",
      subtitle: "Jaggo Ceremony",
      date: "2026-12-04",
      venue: {
        name: "House no. 3200, GMADA Aerocity",
        address:
          "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      },
      invitationLine: "Nachdi Raat, Khushiyan De Naal!",
      sceneTheme: "indigo-fuchsia",
      timing: {
        kind: "assembly",
        assembly: {
          time: { value: "19:30", label: "7:30 pm" },
          pointId: "tulip-inn",
        },
      },
      calendarStart: "assembly",
    },
    {
      id: "haldi-mehendi",
      title: "Mehfil-e-Mela",
      subtitle: "Haldi & Mehendi",
      date: "2026-12-05",
      venue: {
        name: "House no. 3200, GMADA Aerocity",
        address:
          "House no. 3200, D Block, Gmada Aerocity, Sahibzada Ajit Singh Nagar, Mohali, Punjab 140306",
      },
      invitationLine: "Meri bua ke mehndi mein zaroor aana",
      invitationByline: "From Meher Kaur Thapar",
      sceneTheme: "turmeric-green",
      timing: {
        kind: "assembly",
        assembly: {
          time: { value: "11:00", label: "11:00 am" },
          pointId: "tulip-inn",
        },
      },
      calendarStart: "assembly",
    },
    {
      id: "anand-karaj",
      title: "Anand Karaj",
      subtitle: "The Sacred Ceremony",
      date: "2026-12-06",
      venue: {
        name: "Guru Kirpa Dashmesh Darbar",
        address:
          "Guru Kirpa Dashmesh Darbar, Rampur Kalan, Zirakpur Rajpura Road, Behind Pappi Dhaba Mohali, 140601",
      },
      invitationLine: "Two souls united in the presence of Waheguru Ji",
      sceneTheme: "ivory-blue",
      timing: {
        kind: "ceremony",
        ceremonyTime: { value: "10:00", label: "10:00 am" },
        assembly: {
          time: { value: "09:00", label: "9:00 am" },
          pointId: "tulip-inn",
        },
      },
      calendarStart: "ceremony",
    },
    {
      id: "wedding-celebration",
      title: "Shagna Da Rang",
      subtitle: "Wedding Celebration",
      date: "2026-12-06",
      venue: {
        name: "Crystal Resorts",
        address:
          "Crystal Resorts, Rampur Kalan, Patiala Road, Zirakpur, Punjab 140601",
      },
      invitationLine: "Ajj Nachna, Gaunna Te Khushiyan Manana!",
      sceneTheme: "ruby-blush",
      timing: {
        kind: "event",
        eventTime: { value: "10:00", label: "10:00 am onwards" },
      },
      calendarStart: "event",
    },
  ],
  assemblyPoints: {
    "dhillon-plaza": {
      id: "dhillon-plaza",
      label: "Dhillon Plaza",
      address: "Dhillon Plaza, Zirakpur, Punjab 140603",
    },
    "tulip-inn": {
      id: "tulip-inn",
      label: "Lobby Of Tulip Inn",
      address:
        "Tulip Inn Zirakpur, Chandigarh–Ambala Road, near Indian Oil Petrol Pump",
    },
  },
  families: {
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
  },
  invitationCopy: {
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
  },
  countdownTarget: {
    date: "2026-12-06",
    time: { value: "10:00", label: "10:00 am" },
    timeZone: "Asia/Kolkata",
  },
  coordinators: { brideSide: null, groomSide: null },
};
