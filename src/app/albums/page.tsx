
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Album, AlbumFormData } from "@/types";
import { AlbumCard } from "@/components/albums/album-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, LayoutGrid, List, X, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validAlbumTypes, NONE_ALBUM_TYPE_FORM_SENTINEL } from "@/types";

const initialMockAlbums: Album[] = [
  { id: "1", title: "Copa Mundial 1998 Francia", year: 1998, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "Álbum oficial de cromos de la Copa Mundial de la FIFA 1998 celebrada en Francia.", country: "Francia", type: "Selección Nacional", dataAiHint: "soccer album", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_1/preview" },
  { id: "2", title: "Champions League 2004-2005", year: 2004, publisher: "Topps", coverImage: "https://placehold.co/300x450.png", description: "Revive la magia de la temporada 04/05 de la Champions League.", type: "Club", dataAiHint: "soccer stickers", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_2/preview" },
  { id: "3", title: "Euro 2000 Bélgica/Países Bajos", year: 2000, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "El álbum oficial del torneo UEFA Euro 2000.", country: "Bélgica", type: "Selección Nacional", dataAiHint: "football cards", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_3/preview" },
  { id: "4", title: "Premier League 2007", year: 2007, publisher: "Merlin", coverImage: "https://placehold.co/300x450.png", description: "Cromos de la temporada 2006-2007 de la Premier League inglesa.", country: "Inglaterra", type: "Liga", dataAiHint: "soccer memorabilia", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_4/preview" },
  { id: "5", title: "Serie A 1995-1996", year: 1995, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "Calciatori Panini, el icónico álbum de la liga italiana.", country: "Italia", type: "Liga", dataAiHint: "football album", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_5/preview" },
  { id: "6", title: "Copa América 2001", year: 2001, publisher: "Navarrete", coverImage: "https://placehold.co/300x450.png", description: "Álbum de cromos de la Copa América 2001.", type: "Selección Nacional", dataAiHint: "soccer collection", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_6/preview" },
];

type SortOption = "year-desc" | "year-asc" | "title-asc" | "title-desc";
type ViewMode = "grid" | "list";

export default function AlbumsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [albums, setAlbums] = useState<Album[]>(initialMockAlbums);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("year-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleFilters, setVisibleFilters] = useState<{ publisher: boolean; type: boolean; country: boolean; }>({ publisher: true, type: true, country: true});
  const [selectedAlbumForView, setSelectedAlbumForView] = useState<Album | null>(null);
  
  const [showAddEditAlbumDialog, setShowAddEditAlbumDialog] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDeleteId, setAlbumToDeleteId] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AlbumFormData>({
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      publisher: "",
      coverImage: "https://placehold.co/300x450.png",
      description: "",
      country: "",
      type: undefined,
      driveLink: ""
    }
  });

  useEffect(() => {
    if (editingAlbum) {
      reset({
        ...editingAlbum,
        type: editingAlbum.type || NONE_ALBUM_TYPE_FORM_SENTINEL,
      });
    } else {
      reset({ // Default values for adding new album
        title: "",
        year: new Date().getFullYear(),
        publisher: "",
        coverImage: "https://placehold.co/300x450.png",
        description: "",
        country: "",
        type: NONE_ALBUM_TYPE_FORM_SENTINEL,
        driveLink: ""
      });
    }
  }, [editingAlbum, reset]);


  const playerAlbumIdsFilter = useMemo(() => {
    const idsParam = searchParams.get("playerAlbumIds");
    return idsParam ? idsParam.split(',') : null;
  }, [searchParams]);

  const playerNameFilter = useMemo(() => {
    const nameParam = searchParams.get("playerName");
    return nameParam ? decodeURIComponent(nameParam) : null;
  }, [searchParams]);

  const handleViewAlbum = (album: Album) => {
    setSelectedAlbumForView(album);
  };
  
  const openAddAlbumDialog = () => {
    setEditingAlbum(null);
    setShowAddEditAlbumDialog(true);
  };

  const openEditAlbumDialog = (album: Album) => {
    setEditingAlbum(album);
    setShowAddEditAlbumDialog(true);
  };

  const handleDeleteAlbumRequest = (albumId: string) => {
    setAlbumToDeleteId(albumId);
  };

  const confirmDeleteAlbum = () => {
    if (!albumToDeleteId) return;
    setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumToDeleteId));
    toast({
      title: "Álbum Eliminado",
      description: "El álbum ha sido eliminado de la colección.",
    });
    setAlbumToDeleteId(null);
  };

  const handleFormSubmit = (data: AlbumFormData) => {
    if (editingAlbum) { // Editing existing album
      const updatedAlbum: Album = {
        ...editingAlbum,
        ...data,
        year: Number(data.year),
        type: data.type === NONE_ALBUM_TYPE_FORM_SENTINEL ? undefined : data.type as Album['type'],
        dataAiHint: `${data.title.toLowerCase()} album`,
      };
      setAlbums(prevAlbums => prevAlbums.map(a => a.id === editingAlbum.id ? updatedAlbum : a));
      toast({
        title: "Álbum Actualizado",
        description: `"${data.title}" ha sido actualizado.`,
      });
    } else { // Adding new album
      const newAlbum: Album = {
        id: Date.now().toString(),
        title: data.title,
        year: Number(data.year),
        publisher: data.publisher,
        coverImage: data.coverImage,
        description: data.description,
        country: data.country,
        type: data.type === NONE_ALBUM_TYPE_FORM_SENTINEL ? undefined : data.type as Album['type'],
        driveLink: data.driveLink,
        dataAiHint: `${data.title.toLowerCase()} album`,
      };
      setAlbums(prevAlbums => [newAlbum, ...prevAlbums]);
      toast({
        title: "Álbum Agregado",
        description: `"${data.title}" ha sido agregado a la colección.`,
      });
    }
    setShowAddEditAlbumDialog(false);
    setEditingAlbum(null);
    // Reset is handled by useEffect watching editingAlbum
  };

  const filteredAndSortedAlbums = useMemo(() => {
    let filtered = [...albums];

    if (playerAlbumIdsFilter) {
      filtered = filtered.filter(album => playerAlbumIdsFilter.includes(album.id));
    }

    filtered = filtered.filter(album =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.year.toString().includes(searchTerm)
    );

    switch (sortOption) {
      case "year-desc":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return filtered;
  }, [searchTerm, sortOption, playerAlbumIdsFilter, albums]);

  const clearPlayerFilter = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("playerAlbumIds");
    newParams.delete("playerName");
    router.push(`/albums?${newParams.toString()}`);
  };

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Álbumes de Fútbol</h1>
        <p className="text-lg text-muted-foreground">Explora y descubre álbumes históricos de cromos de fútbol.</p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          placeholder="Buscar por título, editorial, año..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year-desc">Año (Más Recientes)</SelectItem>
            <SelectItem value="year-asc">Año (Más Antiguos)</SelectItem>
            <SelectItem value="title-asc">Título (A-Z)</SelectItem>
            <SelectItem value="title-desc">Título (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Vista de cuadrícula">
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="Vista de lista">
                <List className="h-5 w-5" />
            </Button>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" /> Filtros
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Alternar Columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleFilters.publisher}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, publisher: Boolean(checked)}))}
              >
                Editorial
              </DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem
                checked={visibleFilters.type}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, type: Boolean(checked)}))}
              >
                Tipo
              </DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem
                checked={visibleFilters.country}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, country: Boolean(checked)}))}
              >
                País
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {playerAlbumIdsFilter && (
        <div className="mb-4 p-3 bg-accent/20 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-accent-foreground text-center sm:text-left">
            {playerNameFilter ? `Mostrando álbumes donde aparece ${playerNameFilter}.` : "Mostrando álbumes filtrados por jugador."}
          </p>
          <Button variant="ghost" size="sm" onClick={clearPlayerFilter} className="w-full sm:w-auto">
            <X className="mr-1 h-4 w-4" /> Limpiar Filtro de Jugador
          </Button>
        </div>
      )}

      {filteredAndSortedAlbums.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredAndSortedAlbums.map(album => (
            <AlbumCard 
              key={album.id} 
              album={{
                ...album, 
                description: viewMode === 'list' ? album.description : (album.description ? album.description.substring(0,100) + '...' : undefined)
              }}
              onViewAlbum={handleViewAlbum}
              onEditAlbum={openEditAlbumDialog}
              onDeleteAlbum={handleDeleteAlbumRequest}
              isUserAuthenticated={!!user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No se encontraron álbumes con tus criterios de búsqueda.</p>
        </div>
      )}

      {user && (
        <Button
          onClick={openAddAlbumDialog}
          className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg"
          size="lg"
          aria-label="Agregar nuevo álbum"
        >
          <PlusCircle className="h-6 w-6 mr-2" /> Nuevo Álbum
        </Button>
      )}

      <Dialog open={showAddEditAlbumDialog} onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingAlbum(null); // Ensure editingAlbum is reset when dialog closes
            reset(); // Explicitly reset form
          }
          setShowAddEditAlbumDialog(isOpen);
        }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAlbum ? "Editar Álbum" : "Agregar Nuevo Álbum"}</DialogTitle>
            <DialogDescription>
              {editingAlbum ? "Modifica los detalles del álbum." : "Completa los detalles del nuevo álbum."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title", { required: "El título es obligatorio" })} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="year">Año</Label>
              <Input id="year" type="number" {...register("year", { required: "El año es obligatorio", valueAsNumber: true })} />
              {errors.year && <p className="text-sm text-destructive mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <Label htmlFor="publisher">Editorial</Label>
              <Input id="publisher" {...register("publisher", { required: "La editorial es obligatoria" })} />
              {errors.publisher && <p className="text-sm text-destructive mt-1">{errors.publisher.message}</p>}
            </div>
            <div>
              <Label htmlFor="coverImage">URL de Portada</Label>
              <Input id="coverImage" type="url" {...register("coverImage", { required: "La URL de portada es obligatoria" })} />
              {errors.coverImage && <p className="text-sm text-destructive mt-1">{errors.coverImage.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div>
              <Label htmlFor="country">País</Label>
              <Input id="country" {...register("country")} />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_ALBUM_TYPE_FORM_SENTINEL}>Ninguno</SelectItem>
                      {validAlbumTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="driveLink">Enlace de Drive (Preview)</Label>
              <Input id="driveLink" type="url" {...register("driveLink")} placeholder="https://drive.google.com/file/d/.../preview"/>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">{editingAlbum ? "Guardar Cambios" : "Agregar Álbum"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!albumToDeleteId} onOpenChange={(isOpen) => { if (!isOpen) setAlbumToDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el álbum de la colección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlbumToDeleteId(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAlbum}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!selectedAlbumForView} onOpenChange={(isOpen) => { if (!isOpen) setSelectedAlbumForView(null); }}>
        <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col p-0">
          {selectedAlbumForView && (
            <>
              <DialogHeader className="p-4 border-b">
                <DialogTitle>{selectedAlbumForView.title}</DialogTitle>
                {selectedAlbumForView.description && (
                  <DialogDescription>{selectedAlbumForView.description}</DialogDescription>
                )}
              </DialogHeader>
              {selectedAlbumForView.driveLink ? (
                <div className="flex-grow p-1 bg-muted/20">
                  <iframe
                    src={selectedAlbumForView.driveLink}
                    title={`Ver Álbum: ${selectedAlbumForView.title}`}
                    className="w-full h-full rounded-md border"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                  />
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center p-4">
                  <p className="text-muted-foreground">No hay enlace de previsualización disponible para este álbum.</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
