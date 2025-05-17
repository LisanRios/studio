
"use client";

import { useState, useMemo } from "react";
import type { Album } from "@/types";
import { AlbumCard } from "@/components/albums/album-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BarChart, LayoutGrid, List } from "lucide-react";
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
  { id: "1", title: "World Cup 1998 France", year: 1998, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "Official sticker album for the 1998 FIFA World Cup held in France.", country: "France", type: "National Team", dataAiHint: "soccer album", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_1/preview" },
  { id: "2", title: "Champions League 2004-2005", year: 2004, publisher: "Topps", coverImage: "https://placehold.co/300x450.png", description: "Relive the magic of the 04/05 Champions League season.", type: "Club", dataAiHint: "soccer stickers", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_2/preview" },
  { id: "3", title: "Euro 2000 Belgium/Netherlands", year: 2000, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "The official album for the UEFA Euro 2000 tournament.", country: "Belgium", type: "National Team", dataAiHint: "football cards", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_3/preview" },
  { id: "4", title: "Premier League 2007", year: 2007, publisher: "Merlin", coverImage: "https://placehold.co/300x450.png", description: "Stickers from the English Premier League 2006-2007 season.", country: "England", type: "League", dataAiHint: "soccer memorabilia", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_4/preview" },
  { id: "5", title: "Serie A 1995-1996", year: 1995, publisher: "Panini", coverImage: "https://placehold.co/300x450.png", description: "Calciatori Panini, the iconic Italian league album.", country: "Italy", type: "League", dataAiHint: "football album", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_5/preview" },
  { id: "6", title: "Copa America 2001", year: 2001, publisher: "Navarrete", coverImage: "https://placehold.co/300x450.png", description: "Sticker album for the 2001 Copa América.", type: "National Team", dataAiHint: "soccer collection", driveLink: "https://drive.google.com/file/d/PLACEHOLDER_DRIVE_ID_6/preview" },
];

type SortOption = "year-desc" | "year-asc" | "title-asc" | "title-desc";
type ViewMode = "grid" | "list";

export default function AlbumsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("year-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleFilters, setVisibleFilters] = useState<{ publisher: boolean; type: boolean; country: boolean; }>({ publisher: true, type: true, country: true});
  const [selectedAlbumForView, setSelectedAlbumForView] = useState<Album | null>(null);

  const handleViewAlbum = (album: Album) => {
    setSelectedAlbumForView(album);
  };

  const filteredAndSortedAlbums = useMemo(() => {
    let albums = mockAlbums.filter(album =>
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
  }, [searchTerm, sortOption]);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Soccer Albums</h1>
        <p className="text-lg text-muted-foreground">Browse and discover historic soccer sticker albums.</p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="search"
          placeholder="Search albums by title, publisher, year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm flex-grow"
        />
        <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year-desc">Year (Newest First)</SelectItem>
            <SelectItem value="year-asc">Year (Oldest First)</SelectItem>
            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
            <Button variant={viewMode === 'grid' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary': 'outline'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-5 w-5" />
            </Button>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={visibleFilters.publisher}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, publisher: Boolean(checked)}))}
              >
                Publisher
              </DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem
                checked={visibleFilters.type}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, type: Boolean(checked)}))}
              >
                Type
              </DropdownMenuCheckboxItem>
               <DropdownMenuCheckboxItem
                checked={visibleFilters.country}
                onCheckedChange={(checked) => setVisibleFilters(prev => ({...prev, country: Boolean(checked)}))}
              >
                Country
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

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
          <p className="text-xl text-muted-foreground">No albums found matching your criteria.</p>
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
                    title={`View Album: ${selectedAlbumForView.title}`}
                    className="w-full h-full rounded-md border"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                  />
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center p-4">
                  <p className="text-muted-foreground">No preview link available for this album.</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
