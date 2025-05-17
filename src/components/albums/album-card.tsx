
"use client";

import type { Album } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, BookUser, Globe, ShieldCheck, Pencil, Trash2 } from "lucide-react";

interface AlbumCardProps {
  album: Album;
  onViewAlbum: (album: Album) => void;
  onEditAlbum: (album: Album) => void;
  onDeleteAlbum: (albumId: string) => void;
  isUserAuthenticated: boolean;
}

export function AlbumCard({ album, onViewAlbum, onEditAlbum, onDeleteAlbum, isUserAuthenticated }: AlbumCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <div
        className="cursor-pointer group relative"
        onClick={() => onViewAlbum(album)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewAlbum(album); }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${album.title}`}
      >
        <CardHeader className="p-0 relative">
          <div className="aspect-[3/4] w-full relative">
            <Image
              src={album.coverImage}
              alt={`Portada de ${album.title}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              data-ai-hint={album.dataAiHint || "album cover"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-2xl font-semibold mb-2 text-primary">{album.title}</CardTitle>
          <CardDescription className="text-muted-foreground mb-4 min-h-[40px] line-clamp-2">
            {album.description || `Álbum de fútbol coleccionable de ${album.year}.`}
          </CardDescription>
          
          <div className="space-y-2 text-sm text-foreground">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-accent" />
              <span>Año: {album.year}</span>
            </div>
            <div className="flex items-center">
              <BookUser className="w-4 h-4 mr-2 text-accent" />
              <span>Editorial: {album.publisher}</span>
            </div>
            {album.country && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-accent" />
                <span>País: {album.country}</span>
              </div>
            )}
            {album.type && (
              <div className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-accent" />
                <span>Tipo: {album.type}</span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 bg-secondary/50 rounded-b-lg flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => onViewAlbum(album)}>Ver Álbum</Button>
        {isUserAuthenticated && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEditAlbum(album)} aria-label={`Editar ${album.title}`}>
              <Pencil className="h-5 w-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteAlbum(album.id)} aria-label={`Borrar ${album.title}`}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
