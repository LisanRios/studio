
import type { Team } from "@/types";

export const initialMockTeams: Team[] = [
  {
    id: "t1",
    name: "Real Madrid C.F.",
    country: "España",
    foundationYear: 1902,
    stadiumName: "Santiago Bernabéu",
    stadiumCapacity: 81044,
    logoUrl: "https://placehold.co/300x300.png",
    titles: ["35 La Liga", "14 UEFA Champions League", "20 Copa del Rey"],
    albumIds: ["1", "2"], // Example: Appears in World Cup 98 album (via players) and a CL album
    dataAiHint: "real madrid logo",
  },
  {
    id: "t2",
    name: "FC Barcelona",
    country: "España",
    foundationYear: 1899,
    stadiumName: "Camp Nou",
    stadiumCapacity: 99354,
    logoUrl: "https://placehold.co/300x300.png",
    titles: ["27 La Liga", "5 UEFA Champions League", "31 Copa del Rey"],
    albumIds: ["2"], // Example: Appears in a CL album
    dataAiHint: "barcelona logo",
  },
  {
    id: "t3",
    name: "Manchester United F.C.",
    country: "Inglaterra",
    foundationYear: 1878,
    stadiumName: "Old Trafford",
    stadiumCapacity: 74310,
    logoUrl: "https://placehold.co/300x300.png",
    titles: ["20 Premier League", "3 UEFA Champions League", "12 FA Cup"],
    albumIds: ["4"], // Example: Appears in a Premier League album
    dataAiHint: "manchester united logo",
  },
  {
    id: "t4",
    name: "Juventus F.C.",
    country: "Italia",
    foundationYear: 1897,
    stadiumName: "Allianz Stadium",
    stadiumCapacity: 41507,
    logoUrl: "https://placehold.co/300x300.png",
    titles: ["36 Serie A", "2 UEFA Champions League", "14 Coppa Italia"],
    albumIds: ["1", "5"], // Example: Appears in World Cup (via players) and Serie A album
    dataAiHint: "juventus logo",
  },
];
