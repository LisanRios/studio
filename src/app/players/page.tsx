"use client";

import { useState, useMemo } from "react";
import type { Player } from "@/types";
import { PlayerCard } from "@/components/players/player-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, FilterIcon } from "lucide-react";

const mockPlayers: Player[] = [
  { id: "1", name: "Zinedine Zidane", team: "Real Madrid", position: "Midfielder", dateOfBirth: "1972-06-23", nationality: "French", photoUrl: "https://placehold.co/300x300.png", appearances: 789, goals: 156, dataAiHint: "zidane portrait" },
  { id: "2", title: "Lionel Messi", name: "Lionel Messi", team: "Inter Miami", position: "Forward", dateOfBirth: "1987-06-24", nationality: "Argentine", photoUrl: "https://placehold.co/300x300.png", appearances: 853, goals: 704, dataAiHint: "messi playing" },
  { id: "3", title: "Cristiano Ronaldo", name: "Cristiano Ronaldo", team: "Al Nassr", position: "Forward", dateOfBirth: "1985-02-05", nationality: "Portuguese", photoUrl: "https://placehold.co/300x300.png", appearances: 950, goals: 701, dataAiHint: "ronaldo celebration" },
  { id: "4", title: "Paolo Maldini", name: "Paolo Maldini", team: "AC Milan", position: "Defender", dateOfBirth: "1968-06-26", nationality: "Italian", photoUrl: "https://placehold.co/300x300.png", appearances: 902, goals: 33, dataAiHint: "maldini defending" },
  { id: "5", title: "Pelé", name: "Pelé", team: "Santos", position: "Forward", dateOfBirth: "1940-10-23", nationality: "Brazilian", photoUrl: "https://placehold.co/300x300.png", appearances: 700, goals: 650, dataAiHint: "pele retro" },
  { id: "6", title: "Diego Maradona", name: "Diego Maradona", team: "Napoli", position: "Midfielder", dateOfBirth: "1960-10-30", nationality: "Argentine", photoUrl: "https://placehold.co/300x300.png", appearances: 588, goals: 312, dataAiHint: "maradona iconic" },
];

const uniqueTeams = Array.from(new Set(mockPlayers.map(p => p.team))).sort();
const uniquePositions = Array.from(new Set(mockPlayers.map(p => p.position))).sort();
const uniqueNationalities = Array.from(new Set(mockPlayers.map(p => p.nationality))).sort();

type PlayerFilters = {
  team: string;
  position: string;
  nationality: string;
};

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PlayerFilters>({ team: "all", position: "all", nationality: "all" });

  const handleFilterChange = (filterType: keyof PlayerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ team: "all", position: "all", nationality: "all" });
  };

  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const teamMatch = filters.team === "all" || player.team === filters.team;
      const positionMatch = filters.position === "all" || player.position === filters.position;
      const nationalityMatch = filters.nationality === "all" || player.nationality === filters.nationality;
      return nameMatch && teamMatch && positionMatch && nationalityMatch;
    });
  }, [searchTerm, filters]);

  const activeFilterCount = Object.values(filters).filter(val => val !== "all").length + (searchTerm ? 1 : 0);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Soccer Players</h1>
        <p className="text-lg text-muted-foreground">Discover and learn about legendary soccer players.</p>
      </header>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input
            type="search"
            placeholder="Search by player name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:col-span-2"
          />
          <Select value={filters.position} onValueChange={(value) => handleFilterChange("position", value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Position" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={filters.nationality} onValueChange={(value) => handleFilterChange("nationality", value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Nationality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nationalities</SelectItem>
              {uniqueNationalities.map(nat => <SelectItem key={nat} value={nat}>{nat}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.team} onValueChange={(value) => handleFilterChange("team", value)}>
            <SelectTrigger><SelectValue placeholder="Filter by Team" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {uniqueTeams.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeFilterCount > 0 && (
            <Button onClick={clearFilters} variant="ghost" className="text-sm md:col-start-4">
              <XIcon className="w-4 h-4 mr-1" /> Clear Filters ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FilterIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No players found matching your criteria.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}

// Augment Player interface in PlayerCard props to include dataAiHint & title (if needed for search)
declare module "@/types" {
  interface Player {
    dataAiHint?: string;
    title?: string; // If title is used for players
  }
}
