
"use client";

import type { Player } from "@/types";
import Image from "next/image";
// import { useRouter } from "next/navigation"; // No longer needed for direct navigation
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShieldAlert, MapPin, Shirt, Trophy, Info, Pencil, Trash2 } from "lucide-react"; 
import { useState, useEffect } from "react";

interface PlayerCardProps {
  player: Player;
  onViewPlayerDetails: (player: Player) => void; // Changed from routing to opening details
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  isUserAuthenticated: boolean;
}

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

export function PlayerCard({ player, onViewPlayerDetails, onEditPlayer, onDeletePlayer, isUserAuthenticated }: PlayerCardProps) {
  const [displayInfo, setDisplayInfo] = useState<{ age: number; formattedBirthDate: string } | null>(null);

  useEffect(() => {
    // This effect runs only on the client after hydration
    const age = calculateAge(player.dateOfBirth);
    const formattedBirthDate = new Date(player.dateOfBirth).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setDisplayInfo({ age, formattedBirthDate });
  }, [player.dateOfBirth]);

  const handleCardClick = () => {
    onViewPlayerDetails(player);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <div 
        className="group relative cursor-pointer"
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${player.name}`}
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
              <span>Equipo: {player.currentTeam || player.teamsHistory?.[0]?.teamName || 'N/A'}</span>
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
      </div>
      <CardFooter className="p-4 bg-secondary/50 rounded-b-lg flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handleCardClick} className="flex items-center">
            <Info className="w-4 h-4 mr-1.5" />
            Ver Detalles
        </Button>
        {isUserAuthenticated && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEditPlayer(player)} aria-label={`Editar ${player.name}`}>
              <Pencil className="h-5 w-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeletePlayer(player.id)} aria-label={`Borrar ${player.name}`}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
