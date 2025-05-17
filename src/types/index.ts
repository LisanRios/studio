
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

// Valid album types for the Album interface
export const validAlbumTypes: Exclude<Album["type"], undefined>[] = ["Selección Nacional", "Club", "Liga"];

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
}

// Sentinel value for forms when "Ninguno" (None) is selected for album type
export const NONE_ALBUM_TYPE_FORM_SENTINEL = "__NONE_ALBUM_TYPE_FORM_SENTINEL__";

// Tipos para los formularios
export type AlbumFormData = {
  title: string;
  year: number;
  publisher: string;
  coverImage: string;
  description?: string;
  country?: string;
  type?: Album["type"] | typeof NONE_ALBUM_TYPE_FORM_SENTINEL; // Allows undefined, valid types, or the sentinel
  driveLink?: string;
};

export type PlayerFormData = Omit<Player, "id" | "dataAiHint" | "albumIds"> & {
  albumIdsInput?: string; // Para el input de texto de albumIds
};
