
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Player, PlayerFormData, TeamHistoryEntry, FieldPlayerSkills, GoalkeeperSkills } from "@/types";
import { PlayerCard } from "@/components/players/player-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, FilterIcon, PlusCircle, Pencil, Trash2, BarChartHorizontalBig, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { playerPositions, isGoalkeeper, calculateTotalSkills, parseTeamsHistoryInput, formatTeamsHistoryForInput } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const initialMockPlayers: Player[] = [
  { 
    id: "1", name: "Zinedine Zidane", currentTeam: "Real Madrid", position: "Centrocampista", dateOfBirth: "1972-06-23", nationality: "Francés", photoUrl: "https://placehold.co/300x300.png", appearances: 789, goals: 156, dataAiHint: "zidane portrait", albumIds: ["1", "3"],
    teamsHistory: [{ teamName: "Juventus", yearsPlayed: "1996-2001" }, { teamName: "Real Madrid", yearsPlayed: "2001-2006" }],
    height: 185, weight: 80, rating: 96,
    skills: { pace: 80, shooting: 85, passing: 92, dribbling: 91, defending: 70, physicality: 78 },
    totalSkills: 496 // Calculated: 80+85+92+91+70+78
  },
  { 
    id: "2", name: "Lionel Messi", currentTeam: "Inter Miami", position: "Delantero", dateOfBirth: "1987-06-24", nationality: "Argentino", photoUrl: "https://placehold.co/300x300.png", appearances: 853, goals: 704, dataAiHint: "messi playing", albumIds: ["2"],
    teamsHistory: [{ teamName: "FC Barcelona", yearsPlayed: "2004-2021" }, { teamName: "Paris Saint-Germain", yearsPlayed: "2021-2023" }, { teamName: "Inter Miami", yearsPlayed: "2023-Present" }],
    height: 170, weight: 72, rating: 98,
    skills: { pace: 91, shooting: 95, passing: 93, dribbling: 97, defending: 40, physicality: 68 },
    totalSkills: 484 // Calculated
  },
  {
    id: "GK1", name: "Gianluigi Buffon", currentTeam: "Parma", position: "Portero", dateOfBirth: "1978-01-28", nationality: "Italiano", photoUrl: "https://placehold.co/300x300.png", dataAiHint: "buffon goalkeeper",
    teamsHistory: [{teamName: "Parma", yearsPlayed: "1995-2001"}, {teamName: "Juventus", yearsPlayed: "2001-2018"}, {teamName: "PSG", yearsPlayed: "2018-2019"}, {teamName: "Juventus", yearsPlayed: "2019-2021"}, {teamName: "Parma", yearsPlayed: "2021-2023"}],
    height: 192, weight: 92, rating: 95,
    skills: { diving: 94, handling: 90, kicking: 75, reflexes: 96, speed_gk: 55, positioning_gk: 93 },
    totalSkills: 503 // Calculated
  },
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
  
  const [showAddEditPlayerDialog, setShowAddEditPlayerDialog] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);
  const [selectedPlayerForView, setSelectedPlayerForView] = useState<Player | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<PlayerFormData>({
    defaultValues: {
      name: "",
      currentTeam: "",
      position: "Delantero",
      dateOfBirth: "",
      nationality: "",
      photoUrl: "https://placehold.co/300x300.png",
      appearances: 0,
      goals: 0,
      albumIdsInput: "",
      teamsHistoryInput: "",
      height: undefined,
      weight: undefined,
      rating: 75,
      pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physicality: 70,
      diving: 70, handling: 70, kicking: 70, reflexes: 70, speed_gk: 70, positioning_gk: 70,
    }
  });

  const watchedPosition = watch("position");

  useEffect(() => {
    if (editingPlayer) {
      const formData: PlayerFormData = {
        name: editingPlayer.name,
        currentTeam: editingPlayer.currentTeam || "",
        position: editingPlayer.position,
        dateOfBirth: editingPlayer.dateOfBirth,
        nationality: editingPlayer.nationality,
        photoUrl: editingPlayer.photoUrl,
        appearances: editingPlayer.appearances || 0,
        goals: editingPlayer.goals || 0,
        albumIdsInput: editingPlayer.albumIds?.join(',') || '',
        teamsHistoryInput: formatTeamsHistoryForInput(editingPlayer.teamsHistory),
        height: editingPlayer.height || undefined,
        weight: editingPlayer.weight || undefined,
        rating: editingPlayer.rating || 75,
        pace: editingPlayer.skills.pace || 70,
        shooting: editingPlayer.skills.shooting || 70,
        passing: editingPlayer.skills.passing || 70,
        dribbling: editingPlayer.skills.dribbling || 70,
        defending: editingPlayer.skills.defending || 70,
        physicality: editingPlayer.skills.physicality || 70,
        diving: editingPlayer.skills.diving || 70,
        handling: editingPlayer.skills.handling || 70,
        kicking: editingPlayer.skills.kicking || 70,
        reflexes: editingPlayer.skills.reflexes || 70,
        speed_gk: editingPlayer.skills.speed_gk || 70,
        positioning_gk: editingPlayer.skills.positioning_gk || 70,
      };
      reset(formData);
    } else {
      reset({
        name: "", currentTeam: "", position: "Delantero", dateOfBirth: "", nationality: "",
        photoUrl: "https://placehold.co/300x300.png", appearances: 0, goals: 0, albumIdsInput: "",
        teamsHistoryInput: "", height: undefined, weight: undefined, rating: 75,
        pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physicality: 70,
        diving: 70, handling: 70, kicking: 70, reflexes: 70, speed_gk: 70, positioning_gk: 70,
      });
    }
  }, [editingPlayer, reset]);

  const uniqueTeams = useMemo(() => Array.from(new Set(players.map(p => p.currentTeam).filter(Boolean) as string[])).sort(), [players]);
  const uniqueNationalities = useMemo(() => Array.from(new Set(players.map(p => p.nationality))).sort(), [players]);

  const handleFilterChange = (filterType: keyof PlayerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ team: "all", position: "all", nationality: "all" });
  };

  const openAddPlayerDialog = () => {
    setEditingPlayer(null);
    setShowAddEditPlayerDialog(true);
  };

  const openEditPlayerDialog = (player: Player) => {
    setEditingPlayer(player);
    setShowAddEditPlayerDialog(true);
  };
  
  const openPlayerDetailDialog = (player: Player) => {
    setSelectedPlayerForView(player);
  };

  const handleDeletePlayerRequest = (playerId: string) => {
    setPlayerToDeleteId(playerId);
  };

  const confirmDeletePlayer = () => {
    if (!playerToDeleteId) return;
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerToDeleteId));
    toast({
      title: "Jugador Eliminado",
      description: "El jugador ha sido eliminado de la lista.",
    });
    setPlayerToDeleteId(null);
  };

  const handleFormSubmit = (data: PlayerFormData) => {
    const skillsData: Partial<FieldPlayerSkills & GoalkeeperSkills> = {};
    if (isGoalkeeper(data.position)) {
      skillsData.diving = Number(data.diving) || 0;
      skillsData.handling = Number(data.handling) || 0;
      skillsData.kicking = Number(data.kicking) || 0;
      skillsData.reflexes = Number(data.reflexes) || 0;
      skillsData.speed_gk = Number(data.speed_gk) || 0;
      skillsData.positioning_gk = Number(data.positioning_gk) || 0;
    } else {
      skillsData.pace = Number(data.pace) || 0;
      skillsData.shooting = Number(data.shooting) || 0;
      skillsData.passing = Number(data.passing) || 0;
      skillsData.dribbling = Number(data.dribbling) || 0;
      skillsData.defending = Number(data.defending) || 0;
      skillsData.physicality = Number(data.physicality) || 0;
    }

    const playerToSave: Omit<Player, 'id' | 'totalSkills'> & { totalSkills?: number } = {
      name: data.name,
      currentTeam: data.currentTeam || undefined,
      position: data.position,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      photoUrl: data.photoUrl,
      appearances: Number(data.appearances) || undefined,
      goals: Number(data.goals) || undefined,
      albumIds: data.albumIdsInput ? data.albumIdsInput.split(',').map(id => id.trim()).filter(id => id) : undefined,
      dataAiHint: `${data.name.toLowerCase()} soccer player`,
      teamsHistory: parseTeamsHistoryInput(data.teamsHistoryInput),
      height: Number(data.height) || undefined,
      weight: Number(data.weight) || undefined,
      rating: Number(data.rating) || 0,
      skills: skillsData,
    };
    playerToSave.totalSkills = calculateTotalSkills(playerToSave as Player);


    if (editingPlayer) {
      const updatedPlayer: Player = {
        ...editingPlayer,
        ...playerToSave,
        id: editingPlayer.id, // ensure id is preserved
      };
      setPlayers(prevPlayers => prevPlayers.map(p => p.id === editingPlayer.id ? updatedPlayer : p));
      toast({
        title: "Jugador Actualizado",
        description: `"${data.name}" ha sido actualizado.`,
      });
    } else {
      const newPlayer: Player = {
        ...playerToSave,
        id: Date.now().toString(),
      };
      setPlayers(prevPlayers => [newPlayer, ...prevPlayers]);
      toast({
        title: "Jugador Agregado",
        description: `"${data.name}" ha sido agregado a la lista.`,
      });
    }
    setShowAddEditPlayerDialog(false);
    setEditingPlayer(null);
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
      const teamMatch = filters.team === "all" || player.currentTeam === filters.team;
      const positionMatch = filters.position === "all" || player.position === filters.position;
      const nationalityMatch = filters.nationality === "all" || player.nationality === filters.nationality;
      return nameMatch && teamMatch && positionMatch && nationalityMatch;
    });
  }, [searchTerm, filters, players]);

  const activeFilterCount = Object.values(filters).filter(val => val !== "all").length + (searchTerm ? 1 : 0);

  const SkillInputGroup: React.FC<{ skills: {label: string, field: keyof PlayerFormData}[], control: any, errors: any, register: any }> = ({ skills, control, errors, register }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 p-3 border rounded-md">
      {skills.map(skill => (
        <div key={skill.field}>
          <Label htmlFor={skill.field} className="text-sm">{skill.label}</Label>
          <Controller
            name={skill.field as any}
            control={control}
            defaultValue={70}
            rules={{ min: { value: 1, message: "Min 1" }, max: { value: 99, message: "Max 99" } }}
            render={({ field }) => (
              <Input
                id={skill.field}
                type="number"
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                className="mt-1"
              />
            )}
          />
          {errors[skill.field] && <p className="text-sm text-destructive mt-1">{errors[skill.field].message}</p>}
        </div>
      ))}
    </div>
  );

  const fieldPlayerSkillFields = [
    { label: "Ritmo", field: "pace" as keyof PlayerFormData }, { label: "Tiro", field: "shooting" as keyof PlayerFormData },
    { label: "Pase", field: "passing" as keyof PlayerFormData }, { label: "Regate", field: "dribbling" as keyof PlayerFormData },
    { label: "Defensa", field: "defending" as keyof PlayerFormData }, { label: "Físico", field: "physicality" as keyof PlayerFormData },
  ];
  const goalkeeperSkillFields = [
    { label: "Salto", field: "diving" as keyof PlayerFormData }, { label: "Manos", field: "handling" as keyof PlayerFormData },
    { label: "Pies", field: "kicking" as keyof PlayerFormData }, { label: "Reflejos", field: "reflexes" as keyof PlayerFormData },
    { label: "Velocidad (POR)", field: "speed_gk" as keyof PlayerFormData }, { label: "Posición (POR)", field: "positioning_gk" as keyof PlayerFormData },
  ];


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
              {playerPositions.map(pos => <SelectItem key={pos} value={pos}>{pos}</SelectItem>)}
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
            <PlayerCard 
              key={player.id} 
              player={player} 
              onViewPlayerDetails={openPlayerDetailDialog}
              onEditPlayer={openEditPlayerDialog}
              onDeletePlayer={handleDeletePlayerRequest}
              isUserAuthenticated={!!user}
            />
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
          onClick={openAddPlayerDialog}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg"
          size="lg"
          aria-label="Agregar nuevo jugador"
        >
          <PlusCircle className="h-6 w-6 mr-2" /> Nuevo Jugador
        </Button>
      )}

      {/* Add/Edit Player Dialog */}
      <Dialog open={showAddEditPlayerDialog} onOpenChange={(isOpen) => {
          if (!isOpen) { setEditingPlayer(null); reset(); }
          setShowAddEditPlayerDialog(isOpen);
        }}>
        <DialogContent className="sm:max-w-2xl"> {/* Increased width for more fields */}
          <DialogHeader>
            <DialogTitle>{editingPlayer ? "Editar Jugador" : "Agregar Nuevo Jugador"}</DialogTitle>
            <DialogDescription>
              {editingPlayer ? "Modifica los detalles del jugador." : "Completa los detalles del nuevo jugador."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4 max-h-[75vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="currentTeam">Equipo Actual/Principal</Label>
                <Input id="currentTeam" {...register("currentTeam")} />
              </div>
              <div>
                <Label htmlFor="position">Posición</Label>
                 <Controller
                  name="position"
                  control={control}
                  rules={{ required: "La posición es obligatoria" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Selecciona una posición" /></SelectTrigger>
                      <SelectContent>
                        {playerPositions.map(pos => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}
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
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" type="number" {...register("height", { valueAsNumber: true, min: {value:0, message:"Valor positivo"} })} />
                {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
              </div>
              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" {...register("weight", { valueAsNumber: true, min: {value:0, message:"Valor positivo"} })} />
                {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>}
              </div>
              <div>
                <Label htmlFor="rating">Media (1-99)</Label>
                <Input id="rating" type="number" {...register("rating", { valueAsNumber: true, min: 1, max: 99 })} />
                {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
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
            </div>

            <div>
              <Label htmlFor="teamsHistoryInput">Historial de Equipos (Formato: Equipo1 (Años1), Equipo2 (Años2))</Label>
              <Textarea id="teamsHistoryInput" {...register("teamsHistoryInput")} placeholder="Ej: Real Madrid (2009-2018), Juventus (2018-2021)" />
            </div>
            
            <Separator className="my-6"/>
            <h4 className="text-md font-semibold mb-2">Habilidades (1-99)</h4>
            {isGoalkeeper(watchedPosition) ? (
              <SkillInputGroup skills={goalkeeperSkillFields} control={control} errors={errors} register={register}/>
            ) : (
              <SkillInputGroup skills={fieldPlayerSkillFields} control={control} errors={errors} register={register}/>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">{editingPlayer ? "Guardar Cambios" : "Agregar Jugador"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Player Confirmation Dialog */}
      <AlertDialog open={!!playerToDeleteId} onOpenChange={(isOpen) => { if(!isOpen) setPlayerToDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente al jugador.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlayerToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePlayer}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Player Detail Dialog */}
      <Dialog open={!!selectedPlayerForView} onOpenChange={(isOpen) => { if (!isOpen) setSelectedPlayerForView(null); }}>
        <DialogContent className="sm:max-w-2xl">
            {selectedPlayerForView && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedPlayerForView.name}</DialogTitle>
                  <DialogDescription>{selectedPlayerForView.position} • {selectedPlayerForView.nationality}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong className="font-semibold">Equipo Principal:</strong> {selectedPlayerForView.currentTeam || 'N/A'}</p>
                        <p><strong className="font-semibold">Nacimiento:</strong> {new Date(selectedPlayerForView.dateOfBirth).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong className="font-semibold">Altura:</strong> {selectedPlayerForView.height ? `${selectedPlayerForView.height} cm` : 'N/A'}</p>
                        <p><strong className="font-semibold">Peso:</strong> {selectedPlayerForView.weight ? `${selectedPlayerForView.weight} kg` : 'N/A'}</p>
                        <p><strong className="font-semibold">Partidos:</strong> {selectedPlayerForView.appearances ?? 'N/A'}</p>
                        <p><strong className="font-semibold">Goles:</strong> {selectedPlayerForView.goals ?? 'N/A'}</p>
                    </div>

                    {selectedPlayerForView.teamsHistory && selectedPlayerForView.teamsHistory.length > 0 && (
                        <div>
                            <h4 className="font-semibold mt-3 mb-1 text-primary">Historial de Equipos:</h4>
                            <ul className="list-disc list-inside pl-1 space-y-1 text-sm">
                                {selectedPlayerForView.teamsHistory.map((th, index) => (
                                    <li key={index}>{th.teamName} ({th.yearsPlayed})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <Separator className="my-3"/>

                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-primary">Habilidades:</h4>
                        <Badge variant="secondary" className="text-lg">Media: {selectedPlayerForView.rating ?? 'N/A'}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                        {isGoalkeeper(selectedPlayerForView.position) ? (
                            <>
                                {(Object.keys(selectedPlayerForView.skills) as Array<keyof GoalkeeperSkills>)
                                .filter(key => goalkeeperSkillFields.some(f => f.field === key))
                                .map(key => (
                                    <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>{goalkeeperSkillFields.find(f=>f.field === key)?.label || key.replace('_gk',' (POR)').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span className="font-bold">{selectedPlayerForView.skills[key]}</span>
                                    </div>
                                ))}
                            </>
                        ) : (
                             <>
                                {(Object.keys(selectedPlayerForView.skills) as Array<keyof FieldPlayerSkills>)
                                .filter(key => fieldPlayerSkillFields.some(f => f.field === key))
                                .map(key => (
                                    <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                                        <span>{fieldPlayerSkillFields.find(f=>f.field === key)?.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span className="font-bold">{selectedPlayerForView.skills[key]}</span>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                     <p className="text-right font-bold text-lg mt-3">Total Habilidades: {selectedPlayerForView.totalSkills ?? 'N/A'}</p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cerrar</Button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
