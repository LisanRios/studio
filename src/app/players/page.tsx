
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Player, PlayerFormData } from "@/types";
import { PlayerCard } from "@/components/players/player-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, FilterIcon, PlusCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { playerPositions } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

const initialMockPlayers: Player[] = [
  { id: "1", name: "Zinedine Zidane", team: "Real Madrid", position: "Centrocampista", dateOfBirth: "1972-06-23", nationality: "Francés", photoUrl: "https://placehold.co/300x300.png", appearances: 789, goals: 156, dataAiHint: "zidane portrait", albumIds: ["1", "3"] },
  { id: "2", name: "Lionel Messi", team: "Inter Miami", position: "Delantero", dateOfBirth: "1987-06-24", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 853, goals: 704, dataAiHint: "messi playing", albumIds: ["2"] },
  { id: "3", name: "Cristiano Ronaldo", team: "Al Nassr", position: "Delantero", dateOfBirth: "1985-02-05", nationality: "Portugués", photoUrl: "https://placehold.co/300x300.png", appearances: 950, goals: 701, dataAiHint: "ronaldo celebration", albumIds: ["2", "4"] },
  { id: "4", name: "Paolo Maldini", team: "AC Milan", position: "Defensor", dateOfBirth: "1968-06-26", nationality: "Italiano", photoUrl: "https://placehold.co/300x300.png", appearances: 902, goals: 33, dataAiHint: "maldini defending", albumIds: ["5"] },
  { id: "5", name: "Pelé", team: "Santos", position: "Delantero", dateOfBirth: "1940-10-23", nationality: "Brasileño", photoUrl: "https://placehold.co/300x300.png", appearances: 700, goals: 650, dataAiHint: "pele retro" },
  { id: "6", name: "Diego Maradona", team: "Napoli", position: "Centrocampista", dateOfBirth: "1960-10-30", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 588, goals: 312, dataAiHint: "maradona iconic", albumIds: ["1", "5", "6"] },
];

type PlayerFilters = {
  team: string;
  position: string;
  nationality: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>(initialMockPlayers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PlayerFilters>({ team: "all", position: "all", nationality: "all" });
  const [showAddPlayerDialog, setShowAddPlayerDialog] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PlayerFormData>({
    defaultValues: {
      name: "",
      team: "",
      position: "Delantero",
      dateOfBirth: "",
      nationality: "",
      photoUrl: "https://placehold.co/300x300.png",
      appearances: 0,
      goals: 0,
      albumIdsInput: ""
    }
  });

  const uniqueTeams = useMemo(() => Array.from(new Set(players.map(p => p.team))).sort(), [players]);
  const uniquePositions = useMemo(() => Array.from(new Set(players.map(p => p.position))).sort(), [players]);
  const uniqueNationalities = useMemo(() => Array.from(new Set(players.map(p => p.nationality))).sort(), [players]);

  const handleFilterChange = (filterType: keyof PlayerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ team: "all", position: "all", nationality: "all" });
  };

  const handleAddPlayer = (data: PlayerFormData) => {
    const newPlayer: Player = {
      ...data,
      id: Date.now().toString(),
      appearances: Number(data.appearances) || undefined,
      goals: Number(data.goals) || undefined,
      albumIds: data.albumIdsInput ? data.albumIdsInput.split(',').map(id => id.trim()).filter(id => id) : undefined,
      dataAiHint: `${data.name.toLowerCase()} soccer player`,
    };
    setPlayers(prevPlayers => [newPlayer, ...prevPlayers]);
    setShowAddPlayerDialog(false);
    reset();
    toast({
      title: "Jugador Agregado",
      description: `"${data.name}" ha sido agregado a la lista.`,
    });
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const teamMatch = filters.team === "all" || player.team === filters.team;
      const positionMatch = filters.position === "all" || player.position === filters.position;
      const nationalityMatch = filters.nationality === "all" || player.nationality === filters.nationality;
      return nameMatch && teamMatch && positionMatch && nationalityMatch;
    });
  }, [searchTerm, filters, players]);

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

      {user && (
        <Button
          onClick={() => setShowAddPlayerDialog(true)}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg"
          size="lg"
          aria-label="Agregar nuevo jugador"
        >
          <PlusCircle className="h-6 w-6 mr-2" /> Nuevo Jugador
        </Button>
      )}

      <Dialog open={showAddPlayerDialog} onOpenChange={setShowAddPlayerDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Jugador</DialogTitle>
            <DialogDescription>Completa los detalles del nuevo jugador.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddPlayer)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="team">Equipo</Label>
              <Input id="team" {...register("team", { required: "El equipo es obligatorio" })} />
              {errors.team && <p className="text-sm text-destructive mt-1">{errors.team.message}</p>}
            </div>
            <div>
              <Label htmlFor="position">Posición</Label>
               <Controller
                name="position"
                control={control}
                rules={{ required: "La posición es obligatoria" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una posición" />
                    </SelectTrigger>
                    <SelectContent>
                      {playerPositions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.position && <p className="text-sm text-destructive mt-1">{errors.position.message}</p>}
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth", { required: "La fecha de nacimiento es obligatoria" })} />
              {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <Label htmlFor="nationality">Nacionalidad</Label>
              <Input id="nationality" {...register("nationality", { required: "La nacionalidad es obligatoria" })} />
              {errors.nationality && <p className="text-sm text-destructive mt-1">{errors.nationality.message}</p>}
            </div>
            <div>
              <Label htmlFor="photoUrl">URL de Foto</Label>
              <Input id="photoUrl" type="url" {...register("photoUrl", { required: "La URL de la foto es obligatoria" })} />
              {errors.photoUrl && <p className="text-sm text-destructive mt-1">{errors.photoUrl.message}</p>}
            </div>
             <div>
              <Label htmlFor="appearances">Partidos Jugados</Label>
              <Input id="appearances" type="number" {...register("appearances", { valueAsNumber: true, min: { value: 0, message: "Debe ser un número positivo" } })} />
              {errors.appearances && <p className="text-sm text-destructive mt-1">{errors.appearances.message}</p>}
            </div>
             <div>
              <Label htmlFor="goals">Goles</Label>
              <Input id="goals" type="number" {...register("goals", { valueAsNumber: true, min: { value: 0, message: "Debe ser un número positivo" } })} />
              {errors.goals && <p className="text-sm text-destructive mt-1">{errors.goals.message}</p>}
            </div>
            <div>
              <Label htmlFor="albumIdsInput">IDs de Álbumes (separados por coma)</Label>
              <Input id="albumIdsInput" {...register("albumIdsInput")} placeholder="Ej: 1,2,3" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Agregar Jugador</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
