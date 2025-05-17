
"use client";

import type { Player } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShieldAlert, MapPin, Shirt, Trophy, BookOpenCheck } from "lucide-react"; 
import { useState, useEffect } from "react";

interface PlayerCardProps {
  player: Player;
}

// calculateAge remains largely the same, but will be called client-side
function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const router = useRouter();
  const [displayInfo, setDisplayInfo] = useState<{ age: number; formattedBirthDate: string } | null>(null);

  useEffect(() => {
    // Calculate age and format date on the client side
    const age = calculateAge(player.dateOfBirth);
    const formattedBirthDate = new Date(player.dateOfBirth).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setDisplayInfo({ age, formattedBirthDate });
  }, [player.dateOfBirth]);

  const handlePlayerCardClick = () => {
    if (player.albumIds && player.albumIds.length > 0) {
      const albumIdsQuery = player.albumIds.join(',');
      const playerNameQuery = encodeURIComponent(player.name);
      router.push(`/albums?playerAlbumIds=${albumIdsQuery}&playerName=${playerNameQuery}`);
    }
    // Opcional: mostrar toast si no hay albumIds. Por ahora no se hace nada.
  };

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg cursor-pointer group"
      onClick={handlePlayerCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayerCardClick(); }}
      role="button"
      tabIndex={0}
      aria-label={`Ver álbumes de ${player.name}`}
    >
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full relative">
          <Image
            src={player.photoUrl}
            alt={`Foto de ${player.name}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            data-ai-hint={player.dataAiHint || "jugador futbol"}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold mb-1 text-primary">{player.name}</CardTitle>
        <CardDescription className="text-accent font-medium mb-3">{player.position}</CardDescription>
        
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-accent" />
            <span>Equipo: {player.team}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-accent" />
            <span>Nacionalidad: {player.nationality}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-accent" />
            {displayInfo ? (
              <span>Edad: {displayInfo.age} (Nac.: {displayInfo.formattedBirthDate})</span>
            ) : (
              <span>Cargando fecha...</span> 
            )}
          </div>
          {player.appearances !== undefined && (
            <div className="flex items-center">
              <Shirt className="w-4 h-4 mr-2 text-accent" />
              <span>Partidos: {player.appearances}</span>
            </div>
          )}
          {player.goals !== undefined && (
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-accent" />
              <span>Goles: {player.goals}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/50 rounded-b-lg flex justify-between items-center">
        <Badge variant={player.position === "Delantero" ? "default" : "secondary"}>
          {player.position}
        </Badge>
        {player.albumIds && player.albumIds.length > 0 && (
          <Badge variant="outline" className="flex items-center">
            <BookOpenCheck className="w-3 h-3 mr-1.5" />
            Ver en Álbumes
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
