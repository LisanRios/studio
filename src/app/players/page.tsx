"use client";

import { useState, useMemo } from "react";
import type { Player } from "@/types";
import { PlayerCard } from "@/components/players/player-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, FilterIcon } from "lucide-react";

const mockPlayers: Player[] = [
  { id: "1", name: "Zinedine Zidane", team: "Real Madrid", position: "Centrocampista", dateOfBirth: "1972-06-23", nationality: "Francés", photoUrl: "https://placehold.co/300x300.png", appearances: 789, goals: 156, dataAiHint: "zidane portrait" },
  { id: "2", title: "Lionel Messi", name: "Lionel Messi", team: "Inter Miami", position: "Delantero", dateOfBirth: "1987-06-24", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 853, goals: 704, dataAiHint: "messi playing" },
  { id: "3", title: "Cristiano Ronaldo", name: "Cristiano Ronaldo", team: "Al Nassr", position: "Delantero", dateOfBirth: "1985-02-05", nationality: "Portugués", photoUrl: "https://placehold.co/300x300.png", appearances: 950, goals: 701, dataAiHint: "ronaldo celebration" },
  { id: "4", title: "Paolo Maldini", name: "Paolo Maldini", team: "AC Milan", position: "Defensor", dateOfBirth: "1968-06-26", nationality: "Italiano", photoUrl: "https://placehold.co/300x300.png", appearances: 902, goals: 33, dataAiHint: "maldini defending" },
  { id: "5", title: "Pelé", name: "Pelé", team: "Santos", position: "Delantero", dateOfBirth: "1940-10-23", nationality: "Brasileño", photoUrl: "https://placehold.co/300x300.png", appearances: 700, goals: 650, dataAiHint: "pele retro" },
  { id: "6", title: "Diego Maradona", name: "Diego Maradona", team: "Napoli", position: "Centrocampista", dateOfBirth: "1960-10-30", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 588, goals: 312, dataAiHint: "maradona iconic" },
];

// Actualizar tipos de Player para español si es necesario en el futuro.
// Por ahora, los datos `position` ya están en español en `mockPlayers`.

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
        <h1 className="text-4xl font-bold text-primary mb-2">Jugadores de Fútbol</h1>
        <p className="text-lg text-muted-foreground">Descubre y aprende sobre legendarios jugadores de fútbol.</p>
      </header>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <Input
            type="search"
            placeholder="Buscar por nombre de jugador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:col-span-2"
          />
          <Select value={filters.position} onValueChange={(value) => handleFilterChange("position", value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por Posición" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Posiciones</SelectItem>
              {uniquePositions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
            </SelectContent>
          </Select>
           <Select value={filters.nationality} onValueChange={(value) => handleFilterChange("nationality", value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por Nacionalidad" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Nacionalidades</SelectItem>
              {uniqueNationalities.map(nat => <SelectItem key={nat} value={nat}>{nat}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.team} onValueChange={(value) => handleFilterChange("team", value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por Equipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Equipos</SelectItem>
              {uniqueTeams.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeFilterCount > 0 && (
            <Button onClick={clearFilters} variant="ghost" className="text-sm md:col-start-4">
              <XIcon className="w-4 h-4 mr-1" /> Limpiar Filtros ({activeFilterCount})
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
          <p className="text-xl text-muted-foreground">No se encontraron jugadores con tus criterios.</p>
          <p className="text-sm text-muted-foreground">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
}

// Augment Player interface in PlayerCard props to include dataAiHint & title (if needed for search)
// No es necesario modificar esto ya que `Player` en `types/index.ts` ya incluye estos campos.
// Si se necesitaran traducciones para los valores de 'position', se haría en `types/index.ts`
// o se manejaría la lógica de traducción en el componente.
// Por ahora, los valores de 'position' en `mockPlayers` ya están en español.
declare module "@/types" {
  interface Player {
    dataAiHint?: string;
    title?: string; // If title is used for players
  }
}
