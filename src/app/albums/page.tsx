
"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Album } from "@/types";
import { AlbumCard } from "@/components/albums/album-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BarChart, LayoutGrid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const mockAlbums: Album[] = [
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

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("year-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleFilters, setVisibleFilters] = useState<{ publisher: boolean; type: boolean; country: boolean; }>({ publisher: true, type: true, country: true});
  const [selectedAlbumForView, setSelectedAlbumForView] = useState<Album | null>(null);

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

  const filteredAndSortedAlbums = useMemo(() => {
    let albums = [...mockAlbums];

    if (playerAlbumIdsFilter) {
      albums = albums.filter(album => playerAlbumIdsFilter.includes(album.id));
    }

    albums = albums.filter(album =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.year.toString().includes(searchTerm)
    );

    switch (sortOption) {
      case "year-desc":
        albums.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        albums.sort((a, b) => a.year - b.year);
        break;
      case "title-asc":
        albums.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        albums.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return albums;
  }, [searchTerm, sortOption, playerAlbumIdsFilter]);

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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No se encontraron álbumes con tus criterios de búsqueda.</p>
        </div>
      )}

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
