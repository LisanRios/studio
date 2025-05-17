
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Album, AlbumFormData } from "@/types";
import { AlbumCard } from "@/components/albums/album-card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutGrid, List, PlusCircle, Pencil, Trash2, UserX, Filter, XIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { validAlbumTypes, NONE_ALBUM_TYPE_FORM_SENTINEL } from "@/types";
import { initialMockAlbums } from "@/data/mock-albums"; 

type SortOption = "year-desc" | "year-asc" | "title-asc" | "title-desc";
type ViewMode = "grid" | "list";

const ALL_FILTER_VALUE = "all";

export default function AlbumsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [albumsData, setAlbumsData] = useState<Album[]>(initialMockAlbums);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("year-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const [filterPublisher, setFilterPublisher] = useState<string>(ALL_FILTER_VALUE);
  const [filterType, setFilterType] = useState<string>(ALL_FILTER_VALUE);
  const [filterCountry, setFilterCountry] = useState<string>(ALL_FILTER_VALUE);

  const [selectedAlbumForView, setSelectedAlbumForView] = useState<Album | null>(null);
  const [showAddEditAlbumDialog, setShowAddEditAlbumDialog] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDeleteId, setAlbumToDeleteId] = useState<string | null>(null);

  const playerAlbumIdsFilter = searchParams.get('playerAlbumIds');
  const playerNameFilter = searchParams.get('playerName');

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<AlbumFormData>({
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      publisher: "",
      coverImage: "https://placehold.co/300x450.png",
      description: "",
      country: "",
      type: NONE_ALBUM_TYPE_FORM_SENTINEL,
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
      reset({ 
        title: "", year: new Date().getFullYear(), publisher: "",
        coverImage: "https://placehold.co/300x450.png", description: "",
        country: "", type: NONE_ALBUM_TYPE_FORM_SENTINEL, driveLink: ""
      });
    }
  }, [editingAlbum, reset]);

  const uniquePublishers = useMemo(() => {
    const publishers = albumsData.map(album => album.publisher).filter(p => !!p);
    return Array.from(new Set(publishers)).sort();
  }, [albumsData]);

  const uniqueTypes = useMemo(() => {
    const types = albumsData
      .map(album => album.type)
      .filter(Boolean) as Exclude<Album['type'], undefined>[];
    return Array.from(new Set(types)).sort();
  }, [albumsData]);
  
  const uniqueCountries = useMemo(() => {
    const countries = albumsData
      .map(album => album.country)
      .filter(Boolean) as string[];
    return Array.from(new Set(countries)).sort();
  }, [albumsData]);


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
    setAlbumsData(prevAlbums => prevAlbums.filter(album => album.id !== albumToDeleteId));
    toast({
      title: "Álbum Eliminado",
      description: "El álbum ha sido eliminado de la colección.",
    });
    setAlbumToDeleteId(null);
  };

  const handleFormSubmit = (data: AlbumFormData) => {
    const typeValue = data.type === NONE_ALBUM_TYPE_FORM_SENTINEL ? undefined : data.type as Album['type'];
    
    if (editingAlbum) {
      const updatedAlbum: Album = {
        ...editingAlbum,
        ...data,
        year: Number(data.year),
        type: typeValue,
        dataAiHint: `${data.title.toLowerCase()} album`,
      };
      setAlbumsData(prevAlbums => prevAlbums.map(a => a.id === editingAlbum.id ? updatedAlbum : a));
      toast({
        title: "Álbum Actualizado",
        description: `"${data.title}" ha sido actualizado.`,
      });
    } else { 
      const newAlbum: Album = {
        id: Date.now().toString(),
        title: data.title,
        year: Number(data.year),
        publisher: data.publisher,
        coverImage: data.coverImage,
        description: data.description,
        country: data.country,
        type: typeValue,
        driveLink: data.driveLink,
        dataAiHint: `${data.title.toLowerCase()} album`,
      };
      setAlbumsData(prevAlbums => [newAlbum, ...prevAlbums]);
      toast({
        title: "Álbum Agregado",
        description: `"${data.title}" ha sido agregado a la colección.`,
      });
    }
    setShowAddEditAlbumDialog(false);
    setEditingAlbum(null);
  };

  const clearPlayerFilter = () => {
    router.push('/albums');
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSortOption("year-desc");
    setFilterPublisher(ALL_FILTER_VALUE);
    setFilterType(ALL_FILTER_VALUE);
    setFilterCountry(ALL_FILTER_VALUE);
    if (playerAlbumIdsFilter) clearPlayerFilter();
  };

  const activeFilterCount = [
    searchTerm,
    filterPublisher !== ALL_FILTER_VALUE,
    filterType !== ALL_FILTER_VALUE,
    filterCountry !== ALL_FILTER_VALUE,
    playerAlbumIdsFilter,
  ].filter(Boolean).length;


  const filteredAndSortedAlbums = useMemo(() => {
    let filtered = [...albumsData];

    if (playerAlbumIdsFilter) {
      const albumIdsToShow = playerAlbumIdsFilter.split(',');
      filtered = filtered.filter(album => albumIdsToShow.includes(album.id));
    }

    if (filterPublisher !== ALL_FILTER_VALUE) {
      filtered = filtered.filter(album => album.publisher === filterPublisher);
    }
    if (filterType !== ALL_FILTER_VALUE) {
      filtered = filtered.filter(album => album.type === filterType);
    }
    if (filterCountry !== ALL_FILTER_VALUE) {
      filtered = filtered.filter(album => album.country === filterCountry);
    }

    filtered = filtered.filter(album =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.year.toString().includes(searchTerm)
    );

    switch (sortOption) {
      case "year-desc": filtered.sort((a, b) => b.year - a.year); break;
      case "year-asc": filtered.sort((a, b) => a.year - b.year); break;
      case "title-asc": filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "title-desc": filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
    }
    return filtered;
  }, [searchTerm, sortOption, albumsData, playerAlbumIdsFilter, filterPublisher, filterType, filterCountry]);


  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Álbumes de Fútbol</h1>
        <p className="text-lg text-muted-foreground">Explora y descubre álbumes históricos de cromos de fútbol.</p>
      </header>

      {playerNameFilter && (
        <div className="mb-6 p-4 bg-accent/20 rounded-lg shadow-md flex justify-between items-center">
          <p className="text-accent-foreground">
            Mostrando álbumes de <strong className="font-semibold">{playerNameFilter}</strong>.
          </p>
          <Button variant="ghost" onClick={clearPlayerFilter} className="text-accent-foreground hover:bg-accent/30">
            <UserX className="mr-2 h-4 w-4" /> Limpiar Filtro de Jugador
          </Button>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row flex-wrap gap-4 items-center">
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filtros
              {activeFilterCount > 0 && !playerAlbumIdsFilter && <span className="ml-2 bg-primary text-primary-foreground h-5 w-5 text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-3 space-y-3">
            <DropdownMenuLabel>Filtrar Álbumes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div>
              <Label htmlFor="filter-publisher" className="text-sm font-medium">Editorial</Label>
              <Select value={filterPublisher} onValueChange={setFilterPublisher}>
                <SelectTrigger id="filter-publisher" className="mt-1">
                  <SelectValue placeholder="Seleccionar Editorial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER_VALUE}>Todas las Editoriales</SelectItem>
                  {uniquePublishers.map(pub => (
                    <SelectItem key={pub} value={pub}>{pub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-type" className="text-sm font-medium">Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="filter-type" className="mt-1">
                  <SelectValue placeholder="Seleccionar Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER_VALUE}>Todos los Tipos</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-country" className="text-sm font-medium">País</Label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger id="filter-country" className="mt-1">
                  <SelectValue placeholder="Seleccionar País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_FILTER_VALUE}>Todos los Países</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('grid')} aria-label="Vista de cuadrícula">
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('list')} aria-label="Vista de lista">
                <List className="h-5 w-5" />
            </Button>
        </div>
        
        {activeFilterCount > 0 && !playerAlbumIdsFilter && (
          <Button variant="ghost" onClick={clearAllFilters} className="text-sm">
            <XIcon className="mr-2 h-4 w-4" /> Limpiar Todos los Filtros
          </Button>
        )}
      </div>

      {filteredAndSortedAlbums.length > 0 ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredAndSortedAlbums.map(album => (
            <AlbumCard 
              key={album.id} 
              album={{
                ...album, 
                description: viewMode === 'list' || !album.description ? album.description : album.description.substring(0,100) + '...'
              }}
              viewMode={viewMode}
              onViewAlbum={handleViewAlbum}
              onEditAlbum={openEditAlbumDialog}
              onDeleteAlbum={handleDeleteAlbumRequest}
              isUserAuthenticated={!!user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No se encontraron álbumes con tus criterios.</p>
          {activeFilterCount > 0 && <p className="text-sm text-muted-foreground mt-2">Intenta ajustar o limpiar los filtros.</p>}
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
          if (!isOpen) { setEditingAlbum(null); reset(); }
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
                  <Select onValueChange={field.onChange} value={field.value || NONE_ALBUM_TYPE_FORM_SENTINEL}>
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

