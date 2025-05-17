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

export interface Player {
  id: string;
  name: string;
  team: string; // Current or most notable team
  position: PlayerPosition;
  dateOfBirth: string; // ISO string format: "YYYY-MM-DD"
  nationality: string;
  photoUrl: string;
  appearances?: number;
  goals?: number;
  albumIds?: string[]; // IDs of albums the player appears in
  dataAiHint?: string;
  title?: string; 
}
