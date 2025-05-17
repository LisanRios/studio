
export interface Album {
  id: string;
  title: string;
  year: number;
  publisher: string;
  coverImage: string;
  description?: string;
  country?: string; // e.g. "Italia", "Inglaterra"
  type?: "Selección Nacional" | "Club" | "Liga"; // e.g. Copa Mundial, Serie A
  driveLink?: string; // Link to Google Drive embeddable content
  dataAiHint?: string; // Hint for AI image generation/search
}

export type PlayerPosition = "Portero" | "Defensor" | "Centrocampista" | "Delantero";
export const playerPositions: PlayerPosition[] = ["Portero", "Defensor", "Centrocampista", "Delantero"];

export const validAlbumTypes: Exclude<Album["type"], undefined>[] = ["Selección Nacional", "Club", "Liga"];

export interface TeamHistoryEntry {
  teamName: string;
  yearsPlayed: string; // e.g., "2002-2005" or "2002 - Present"
}

// Skills for field players
export interface FieldPlayerSkills {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
}

// Skills for goalkeepers
export interface GoalkeeperSkills {
  diving: number;
  handling: number;
  kicking: number;
  reflexes: number;
  speed_gk: number; // Specific to GKs to avoid name clashes if a general speed attribute existed
  positioning_gk: number; // Specific to GKs
}

export interface Player {
  id: string;
  name: string;
  currentTeam?: string; // Current or most notable team for display
  position: PlayerPosition;
  dateOfBirth: string; // ISO string format: "YYYY-MM-DD"
  nationality: string;
  photoUrl: string;
  appearances?: number; // General career appearances
  goals?: number; // General career goals
  albumIds?: string[]; // IDs of albums the player appears in
  dataAiHint?: string;

  // Detailed player information
  teamsHistory?: TeamHistoryEntry[]; // History of teams
  height?: number; // in cm
  weight?: number; // in kg
  rating?: number; // Overall media/rating (1-99)
  
  skills: Partial<FieldPlayerSkills & GoalkeeperSkills>; // Contains all possible skills, but only relevant ones will be populated/used
  totalSkills?: number; // Sum of relevant skills
}


export const NONE_ALBUM_TYPE_FORM_SENTINEL = "__NONE_ALBUM_TYPE_FORM_SENTINEL__";

export type AlbumFormData = {
  title: string;
  year: number;
  publisher: string;
  coverImage: string;
  description?: string;
  country?: string;
  type?: Album["type"] | typeof NONE_ALBUM_TYPE_FORM_SENTINEL;
  driveLink?: string;
};

export type PlayerFormData = {
  name: string;
  currentTeam?: string;
  position: PlayerPosition;
  dateOfBirth: string;
  nationality: string;
  photoUrl: string;
  appearances?: number;
  goals?: number;
  albumIds?: string[]; 

  teamsHistoryInput?: string; // e.g., "Real Madrid (2009-2018), Juventus (2018-2021)"
  height?: number;
  weight?: number;
  rating?: number;

  // Field Player Skills (all optional in form, populated based on position)
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physicality?: number;

  // Goalkeeper Skills (all optional in form)
  diving?: number;
  handling?: number;
  kicking?: number;
  reflexes?: number;
  speed_gk?: number;
  positioning_gk?: number;
};

export interface Team {
  id: string;
  name: string;
  country: string;
  foundationYear: number;
  stadiumName: string;
  stadiumCapacity?: number;
  logoUrl: string;
  titles?: string[]; // Array of titles, e.g., ["La Liga 2022-23", "Copa del Rey 2021"]
  albumIds?: string[]; // IDs of albums the team appears in
  dataAiHint?: string; // For AI image generation/search for logo
}

export type TeamFormData = {
  name: string;
  country: string;
  foundationYear: number;
  stadiumName: string;
  stadiumCapacity?: number;
  logoUrl: string;
  titlesInput?: string; // Comma-separated string for titles
  albumIds?: string[];
};

export interface UserCredentials {
  username: string;
  password?: string; // Password is required for creation and is present in users.json
}

export interface LoggedInUser { // Represents the currently authenticated user session
  username: string;
}


// Helper function to check if a player is a goalkeeper
export function isGoalkeeper(position: PlayerPosition): boolean {
  return position === "Portero";
}

// Helper function to calculate total skills based on position
export function calculateTotalSkills(player: Pick<Player, 'position' | 'skills'>): number {
  let total = 0;
  if (isGoalkeeper(player.position)) {
    total = (player.skills.diving || 0) +
            (player.skills.handling || 0) +
            (player.skills.kicking || 0) +
            (player.skills.reflexes || 0) +
            (player.skills.speed_gk || 0) +
            (player.skills.positioning_gk || 0);
  } else {
    total = (player.skills.pace || 0) +
            (player.skills.shooting || 0) +
            (player.skills.passing || 0) +
            (player.skills.dribbling || 0) +
            (player.skills.defending || 0) +
            (player.skills.physicality || 0);
  }
  return total;
}

// Helper to parse teamsHistoryInput string for Players
export function parseTeamsHistoryInput(input?: string): TeamHistoryEntry[] | undefined {
  if (!input || input.trim() === "") return undefined;
  return input.split(',').map(entryStr => {
    const match = entryStr.trim().match(/(.+)\s\((.+)\)/);
    if (match && match.length === 3) {
      return { teamName: match[1].trim(), yearsPlayed: match[2].trim() };
    }
    return { teamName: entryStr.trim(), yearsPlayed: "N/A" };
  }).filter(entry => entry.teamName); 
}

// Helper to format teamsHistory for Player form input
export function formatTeamsHistoryForInput(teams?: TeamHistoryEntry[]): string {
  if (!teams || teams.length === 0) return "";
  return teams.map(entry => `${entry.teamName} (${entry.yearsPlayed})`).join(', ');
}

// Helper to parse titlesInput string for Teams
export function parseTitlesInput(input?: string): string[] | undefined {
  if (!input || input.trim() === "") return undefined;
  return input.split(',').map(title => title.trim()).filter(title => title);
}

// Helper to format titles for Team form input
export function formatTitlesForInput(titles?: string[]): string {
  if (!titles || titles.length === 0) return "";
  return titles.join(', ');
}
