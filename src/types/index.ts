export interface Album {
  id: string;
  title: string;
  year: number;
  publisher: string;
  coverImage: string;
  description?: string;
  country?: string; // e.g. "Italy", "England"
  type?: "National Team" | "Club" | "League"; // e.g. World Cup, Serie A
  driveLink?: string; // Link to Google Drive embeddable content
  dataAiHint?: string; // Hint for AI image generation/search
}

export interface Player {
  id: string;
  name: string;
  team: string; // Current or most notable team
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  dateOfBirth: string; // ISO string format: "YYYY-MM-DD"
  nationality: string;
  photoUrl: string;
  appearances?: number;
  goals?: number;
  dataAiHint?: string;
  title?: string; 
}
