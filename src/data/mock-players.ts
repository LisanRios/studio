
import type { Player } from "@/types";

export const initialMockPlayers: Player[] = [
  { 
    id: "1", name: "Zinedine Zidane", currentTeam: "Real Madrid", position: "Centrocampista", dateOfBirth: "1972-06-23", nationality: "Francés", photoUrl: "https://placehold.co/300x300.png", appearances: 789, goals: 156, dataAiHint: "zidane portrait", albumIds: ["1", "3"],
    teamsHistory: [{ teamName: "Juventus", yearsPlayed: "1996-2001" }, { teamName: "Real Madrid", yearsPlayed: "2001-2006" }],
    height: 185, weight: 80, rating: 96,
    skills: { pace: 80, shooting: 85, passing: 92, dribbling: 91, defending: 70, physicality: 78 },
    totalSkills: 496 
  },
  { 
    id: "2", name: "Lionel Messi", currentTeam: "Inter Miami", position: "Delantero", dateOfBirth: "1987-06-24", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 853, goals: 704, dataAiHint: "messi playing", albumIds: ["2"],
    teamsHistory: [{ teamName: "FC Barcelona", yearsPlayed: "2004-2021" }, { teamName: "Paris Saint-Germain", yearsPlayed: "2021-2023" }, { teamName: "Inter Miami", yearsPlayed: "2023-Present" }],
    height: 170, weight: 72, rating: 98,
    skills: { pace: 91, shooting: 95, passing: 93, dribbling: 97, defending: 40, physicality: 68 },
    totalSkills: 484 
  },
  {
    id: "GK1", name: "Gianluigi Buffon", currentTeam: "Parma", position: "Portero", dateOfBirth: "1978-01-28", nationality: "Italiano", photoUrl: "https://placehold.co/300x300.png", dataAiHint: "buffon goalkeeper", albumIds: ["5"],
    teamsHistory: [{teamName: "Parma", yearsPlayed: "1995-2001"}, {teamName: "Juventus", yearsPlayed: "2001-2018"}, {teamName: "PSG", yearsPlayed: "2018-2019"}, {teamName: "Juventus", yearsPlayed: "2019-2021"}, {teamName: "Parma", yearsPlayed: "2021-2023"}],
    height: 192, weight: 92, rating: 95,
    skills: { diving: 94, handling: 90, kicking: 75, reflexes: 96, speed_gk: 55, positioning_gk: 93 },
    totalSkills: 503 
  },
];
