
"use client";

import type { Album } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, BookUser, Globe, ShieldCheck } from "lucide-react";

interface AlbumCardProps {
  album: Album;
  onViewAlbum: (album: Album) => void;
}

export function AlbumCard({ album, onViewAlbum }: AlbumCardProps) {
  return (
    <div
      className="cursor-pointer h-full group"
      onClick={() => onViewAlbum(album)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewAlbum(album); }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${album.title}`}
    >
      <Card className="flex flex-col h-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 rounded-lg">
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
        <CardFooter className="p-6 bg-secondary/50 rounded-b-lg">
          <Badge variant="outline">Ver Álbum</Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
