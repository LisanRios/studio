
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Team, TeamFormData, Album } from "@/types";
import { TeamCard } from "@/components/teams/team-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XIcon, FilterIcon, PlusCircle, Pencil, Trash2, Shield, Globe, CalendarDays, Users, Landmark, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
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
import { initialMockTeams } from "@/data/mock-teams";
import { initialMockAlbums } from "@/data/mock-albums";
import { parseTitlesInput, formatTitlesForInput } from "@/types";

type TeamFilters = {
  country: string;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialMockTeams);
  const [allAlbums] = useState<Album[]>(initialMockAlbums);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<TeamFilters>({ country: "all" });
  
  const [showAddEditTeamDialog, setShowAddEditTeamDialog] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamToDeleteId, setTeamToDeleteId] = useState<string | null>(null);
  const [selectedTeamForView, setSelectedTeamForView] = useState<Team | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TeamFormData>({
    defaultValues: {
      name: "",
      country: "",
      foundationYear: new Date().getFullYear() - 100, // Default to 100 years ago
      stadiumName: "",
      stadiumCapacity: undefined,
      logoUrl: "https://placehold.co/300x300.png",
      titlesInput: "",
      albumIds: [],
    }
  });

  useEffect(() => {
    if (editingTeam) {
      const formData: TeamFormData = {
        name: editingTeam.name,
        country: editingTeam.country,
        foundationYear: editingTeam.foundationYear,
        stadiumName: editingTeam.stadiumName,
        stadiumCapacity: editingTeam.stadiumCapacity,
        logoUrl: editingTeam.logoUrl,
        titlesInput: formatTitlesForInput(editingTeam.titles),
        albumIds: editingTeam.albumIds || [],
      };
      reset(formData);
    } else {
      reset({
        name: "", country: "", foundationYear: new Date().getFullYear() - 100, stadiumName: "",
        stadiumCapacity: undefined, logoUrl: "https://placehold.co/300x300.png",
        titlesInput: "", albumIds: [],
      });
    }
  }, [editingTeam, reset]);

  const uniqueCountries = useMemo(() => Array.from(new Set(teams.map(t => t.country))).sort(), [teams]);

  const handleFilterChange = (filterType: keyof TeamFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({ country: "all" });
  };

  const openAddTeamDialog = () => {
    setEditingTeam(null);
    setShowAddEditTeamDialog(true);
  };

  const openEditTeamDialog = (team: Team) => {
    setEditingTeam(team);
    setShowAddEditTeamDialog(true);
  };
  
  const openTeamDetailDialog = (team: Team) => {
    setSelectedTeamForView(team);
  };

  const handleViewTeamAlbums = (team: Team) => {
    if (team.albumIds && team.albumIds.length > 0) {
      const params = new URLSearchParams();
      params.set('teamAlbumIds', team.albumIds.join(',')); // Using a different param name to avoid conflict with player filter
      params.set('teamName', team.name);
      router.push(`/albums?${params.toString()}`);
    } else {
      toast({
        variant: "default",
        title: "Sin Álbumes Asociados",
        description: `${team.name} no tiene álbumes asociados en este momento.`,
      });
    }
  };

  const handleDeleteTeamRequest = (teamId: string) => {
    setTeamToDeleteId(teamId);
  };

  const confirmDeleteTeam = () => {
    if (!teamToDeleteId) return;
    setTeams(prevTeams => prevTeams.filter(team => team.id !== teamToDeleteId));
    toast({
      title: "Equipo Eliminado",
      description: "El equipo ha sido eliminado de la lista.",
    });
    setTeamToDeleteId(null);
  };

  const handleFormSubmit = (data: TeamFormData) => {
    const teamToSave: Omit<Team, 'id'> = {
      name: data.name,
      country: data.country,
      foundationYear: Number(data.foundationYear),
      stadiumName: data.stadiumName,
      stadiumCapacity: data.stadiumCapacity ? Number(data.stadiumCapacity) : undefined,
      logoUrl: data.logoUrl,
      titles: parseTitlesInput(data.titlesInput),
      albumIds: data.albumIds || [],
      dataAiHint: `${data.name.toLowerCase()} team logo`,
    };

    if (editingTeam) {
      const updatedTeam: Team = {
        ...editingTeam,
        ...teamToSave,
        id: editingTeam.id, 
      };
      setTeams(prevTeams => prevTeams.map(t => t.id === editingTeam.id ? updatedTeam : t));
      toast({
        title: "Equipo Actualizado",
        description: `"${data.name}" ha sido actualizado.`,
      });
    } else {
      const newTeam: Team = {
        ...teamToSave,
        id: Date.now().toString(),
      };
      setTeams(prevTeams => [newTeam, ...prevTeams]);
      toast({
        title: "Equipo Agregado",
        description: `"${data.name}" ha sido agregado a la lista.`,
      });
    }
    setShowAddEditTeamDialog(false);
    setEditingTeam(null);
  };

  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      const nameMatch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
      const countryMatch = filters.country === "all" || team.country === filters.country;
      return nameMatch && countryMatch;
    });
  }, [searchTerm, filters, teams]);

  const activeFilterCount = (filters.country !== "all" ? 1 : 0) + (searchTerm ? 1 : 0);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Equipos de Fútbol</h1>
        <p className="text-lg text-muted-foreground">Explora clubes de fútbol históricos y actuales.</p>
      </header>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <Input
            type="search"
            placeholder="Buscar por nombre de equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:col-span-2"
          />
          <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
            <SelectTrigger><SelectValue placeholder="Filtrar por País" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Países</SelectItem>
              {uniqueCountries.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeFilterCount > 0 && (
            <Button onClick={clearFilters} variant="ghost" className="text-sm md:col-start-3">
              <XIcon className="w-4 h-4 mr-1" /> Limpiar Filtros ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeams.map(team => (
            <TeamCard 
              key={team.id} 
              team={team} 
              onViewTeamDetails={openTeamDetailDialog}
              onViewTeamAlbums={handleViewTeamAlbums}
              onEditTeam={openEditTeamDialog}
              onDeleteTeam={handleDeleteTeamRequest}
              isUserAuthenticated={!!user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FilterIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No se encontraron equipos con tus criterios.</p>
          <p className="text-sm text-muted-foreground">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
      )}

      {user && (
        <Button
          onClick={openAddTeamDialog}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg"
          size="lg"
          aria-label="Agregar nuevo equipo"
        >
          <PlusCircle className="h-6 w-6 mr-2" /> Nuevo Equipo
        </Button>
      )}

      {/* Add/Edit Team Dialog */}
      <Dialog open={showAddEditTeamDialog} onOpenChange={(isOpen) => {
          if (!isOpen) { setEditingTeam(null); reset(); }
          setShowAddEditTeamDialog(isOpen);
        }}>
        <DialogContent className="sm:max-w-lg"> 
          <DialogHeader>
            <DialogTitle>{editingTeam ? "Editar Equipo" : "Agregar Nuevo Equipo"}</DialogTitle>
            <DialogDescription>
              {editingTeam ? "Modifica los detalles del equipo." : "Completa los detalles del nuevo equipo."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="name">Nombre del Equipo</Label>
              <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input id="country" {...register("country", { required: "El país es obligatorio" })} />
              {errors.country && <p className="text-sm text-destructive mt-1">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="foundationYear">Año de Fundación</Label>
              <Input id="foundationYear" type="number" {...register("foundationYear", { required: "El año es obligatorio", valueAsNumber: true, min: 1800, max: new Date().getFullYear() })} />
              {errors.foundationYear && <p className="text-sm text-destructive mt-1">{errors.foundationYear.message}</p>}
            </div>
            <div>
              <Label htmlFor="stadiumName">Nombre del Estadio</Label>
              <Input id="stadiumName" {...register("stadiumName", { required: "El nombre del estadio es obligatorio" })} />
              {errors.stadiumName && <p className="text-sm text-destructive mt-1">{errors.stadiumName.message}</p>}
            </div>
            <div>
              <Label htmlFor="stadiumCapacity">Capacidad del Estadio</Label>
              <Input id="stadiumCapacity" type="number" {...register("stadiumCapacity", { valueAsNumber: true, min: 0 })} />
              {errors.stadiumCapacity && <p className="text-sm text-destructive mt-1">{errors.stadiumCapacity.message}</p>}
            </div>
            <div>
              <Label htmlFor="logoUrl">URL del Logo</Label>
              <Input id="logoUrl" type="url" {...register("logoUrl", { required: "La URL del logo es obligatoria" })} />
              {errors.logoUrl && <p className="text-sm text-destructive mt-1">{errors.logoUrl.message}</p>}
            </div>
            <div>
              <Label htmlFor="titlesInput">Títulos (separados por coma)</Label>
              <Textarea id="titlesInput" {...register("titlesInput")} placeholder="Ej: La Liga 2022-23, Copa del Rey 2021"/>
            </div>
            <div>
              <Label>Álbumes Asociados</Label>
              <Controller
                name="albumIds"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <ScrollArea className="h-32 w-full rounded-md border p-2 mt-1">
                    {allAlbums.map((album) => (
                      <div key={album.id} className="flex items-center space-x-2 mb-1">
                        <Checkbox
                          id={`album-team-select-${album.id}`}
                          checked={field.value?.includes(album.id)}
                          onCheckedChange={(checked) => {
                            const currentAlbumIds = field.value || [];
                            if (checked) {
                              field.onChange([...currentAlbumIds, album.id]);
                            } else {
                              field.onChange(currentAlbumIds.filter((id) => id !== album.id));
                            }
                          }}
                        />
                        <Label htmlFor={`album-team-select-${album.id}`} className="font-normal text-sm">
                          {album.title} ({album.year})
                        </Label>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="submit">{editingTeam ? "Guardar Cambios" : "Agregar Equipo"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <AlertDialog open={!!teamToDeleteId} onOpenChange={(isOpen) => { if(!isOpen) setTeamToDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer. Esto eliminará permanentemente al equipo.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTeamToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTeam}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Team Detail Dialog */}
      <Dialog open={!!selectedTeamForView} onOpenChange={(isOpen) => { if (!isOpen) setSelectedTeamForView(null); }}>
        <DialogContent className="sm:max-w-lg">
            {selectedTeamForView && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Image src={selectedTeamForView.logoUrl} alt={`Logo de ${selectedTeamForView.name}`} width={60} height={60} className="rounded-md bg-muted p-1" data-ai-hint={selectedTeamForView.dataAiHint || "team logo"}/>
                    <div>
                      <DialogTitle className="text-2xl">{selectedTeamForView.name}</DialogTitle>
                      <DialogDescription>{selectedTeamForView.country}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="py-4 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-accent flex-shrink-0" /> <strong className="font-semibold mr-1">Fundación:</strong> {selectedTeamForView.foundationYear}</div>
                        <div className="flex items-center"><Globe className="w-4 h-4 mr-2 text-accent flex-shrink-0" /> <strong className="font-semibold mr-1">País:</strong> {selectedTeamForView.country}</div>
                        <div className="flex items-center col-span-2"><Landmark className="w-4 h-4 mr-2 text-accent flex-shrink-0" /> <strong className="font-semibold mr-1">Estadio:</strong> {selectedTeamForView.stadiumName}</div>
                        {selectedTeamForView.stadiumCapacity !== undefined && (
                          <div className="flex items-center col-span-2"><Users className="w-4 h-4 mr-2 text-accent flex-shrink-0" /> <strong className="font-semibold mr-1">Capacidad:</strong> {selectedTeamForView.stadiumCapacity.toLocaleString()} espectadores</div>
                        )}
                    </div>
                    
                    {selectedTeamForView.titles && selectedTeamForView.titles.length > 0 && (
                        <div>
                            <Separator className="my-3"/>
                            <h4 className="font-semibold mb-1 text-primary flex items-center"><Trophy className="w-4 h-4 mr-2"/>Palmarés Destacado:</h4>
                            <ScrollArea className="h-28 border rounded-md p-2">
                              <ul className="list-disc list-inside pl-1 space-y-1 text-sm">
                                  {selectedTeamForView.titles.map((title, index) => (
                                      <li key={index}>{title}</li>
                                  ))}
                              </ul>
                            </ScrollArea>
                        </div>
                    )}

                    {selectedTeamForView.albumIds && selectedTeamForView.albumIds.length > 0 && (
                       <div>
                          <Separator className="my-3"/>
                           <h4 className="font-semibold mb-1 text-primary flex items-center"><BookOpen className="w-4 h-4 mr-2"/>Presente en Álbumes:</h4>
                           <p className="text-sm text-muted-foreground">Este equipo o sus jugadores aparecen en {selectedTeamForView.albumIds.length} álbum(es) de la colección.</p>
                       </div>
                    )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleViewTeamAlbums(selectedTeamForView)} disabled={!selectedTeamForView.albumIds || selectedTeamForView.albumIds.length === 0}>
                      Ver Álbumes
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="default">Cerrar</Button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

    