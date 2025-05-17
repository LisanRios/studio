
"use client";

import type { Album } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, BookUser, Globe, ShieldCheck, Pencil, Trash2, Eye } from "lucide-react"; // Added Eye icon

interface AlbumCardProps {
  album: Album;
  viewMode: "grid" | "list"; // Added viewMode
  onViewAlbum: (album: Album) => void;
  onEditAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
  isUserAuthenticated: boolean;
}

export function AlbumCard({ album, viewMode, onViewAlbum, onEditAlbum, onDeleteAlbum, isUserAuthenticated }: AlbumCardProps) {
  const cardClasses = viewMode === 'grid' 
    ? "flex flex-col h-full" 
    : "flex flex-col sm:flex-row sm:items-start"; // Adjusted for list view

  const imageContainerClasses = viewMode === 'grid' 
    ? "aspect-[3/4] w-full relative" 
    : "aspect-[3/4] sm:w-1/4 md:w-1/5 lg:w-1/6 relative flex-shrink-0";

  const contentClasses = viewMode === 'grid' 
    ? "p-6 flex-grow" 
    : "p-4 sm:p-6 flex-grow";

  const descriptionLineClamp = viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-none sm:line-clamp-3';


  return (
    <Card className={`${cardClasses} overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg`}>
      <div
        className="cursor-pointer group relative flex-shrink-0"
        onClick={() => onViewAlbum(album)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewAlbum(album); }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${album.title}`}
      >
        <div className={imageContainerClasses}>
          <Image
            src={album.coverImage}
            alt={`Portada de ${album.title}`}
            fill
            style={{ objectFit: 'cover' }}
            className={viewMode === 'grid' ? 'rounded-t-lg' : 'rounded-t-lg sm:rounded-l-lg sm:rounded-t-none'}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            data-ai-hint={album.dataAiHint || "album cover"}
          />
        </div>
      </div>
      
      <div className={`${contentClasses} flex flex-col justify-between`}> {/* Ensured content takes remaining space */}
        <div> {/* Top part of content */}
          <CardTitle className="text-xl lg:text-2xl font-semibold mb-1 text-primary">{album.title}</CardTitle>
          <CardDescription className={`text-muted-foreground mb-3 min-h-[2.5rem] ${descriptionLineClamp}`}>
            {album.description || `Álbum de fútbol coleccionable de ${album.year}.`}
          </CardDescription>
          
          <div className="space-y-1.5 text-sm text-foreground mb-3">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
              <span>Año: {album.year}</span>
            </div>
            <div className="flex items-center">
              <BookUser className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
              <span>Editorial: {album.publisher}</span>
            </div>
            {album.country && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
                <span>País: {album.country}</span>
              </div>
            )}
            {album.type && (
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
                <span>Tipo: {album.type}</span>
              </div>
            )}
          </div>
        </div>

        <CardFooter className="p-0 pt-3 mt-auto bg-transparent flex justify-between items-center"> {/* Footer styles adjusted */}
          <Button variant="outline" size="sm" onClick={() => onViewAlbum(album)} className="flex items-center">
            <Eye className="w-4 h-4 mr-1.5" /> Ver Álbum
          </Button>
          {isUserAuthenticated && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEditAlbum(album)} aria-label={`Editar ${album.title}`}>
                <Pencil className="h-5 w-5 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDeleteAlbum(album.id)} aria-label={`Borrar ${album.title}`}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

    