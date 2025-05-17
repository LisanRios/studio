
"use client";

import type { Team } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Shield, Landmark, Users, Trophy, Info, Pencil, Trash2, BookOpen } from "lucide-react";

interface TeamCardProps {
  team: Team;
  onViewTeamDetails: (team: Team) => void;
  onViewTeamAlbums: (team: Team) => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  isUserAuthenticated: boolean;
}

export function TeamCard({ team, onViewTeamDetails, onViewTeamAlbums, onEditTeam, onDeleteTeam, isUserAuthenticated }: TeamCardProps) {
  
  const handleViewDetailsClick = () => {
    onViewTeamDetails(team);
  };

  const handleViewAlbumsClick = () => {
    if (team.albumIds && team.albumIds.length > 0) {
      onViewTeamAlbums(team);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <div 
        className="group relative cursor-pointer"
        onClick={handleViewDetailsClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleViewDetailsClick(); }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalles de ${team.name}`}
      >
        <CardHeader className="p-0 relative">
          <div className="aspect-video w-full relative bg-muted/30 flex items-center justify-center">
            <Image
              src={team.logoUrl}
              alt={`Logo de ${team.name}`}
              width={150}
              height={150}
              style={{ objectFit: 'contain' }}
              className="p-4"
              data-ai-hint={team.dataAiHint || "team logo"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <CardTitle className="text-2xl font-semibold mb-1 text-primary">{team.name}</CardTitle>
          <CardDescription className="text-accent font-medium mb-3">{team.country}</CardDescription>
          
          <div className="space-y-2 text-sm text-foreground">
            <div className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-accent" />
              <span>Fundación: {team.foundationYear}</span>
            </div>
            <div className="flex items-center">
              <Landmark className="w-4 h-4 mr-2 text-accent" />
              <span>Estadio: {team.stadiumName}</span>
            </div>
            {team.stadiumCapacity !== undefined && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-accent" />
                <span>Capacidad: {team.stadiumCapacity.toLocaleString()}</span>
              </div>
            )}
             {team.titles && team.titles.length > 0 && (
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-accent flex-shrink-0" />
                <span className="truncate" title={team.titles.join(', ')}>
                  Títulos Dest.: {team.titles[0]} {team.titles.length > 1 ? `(+${team.titles.length-1})`: ''}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 bg-secondary/50 rounded-b-lg flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleViewDetailsClick} className="flex items-center">
                <Info className="w-4 h-4 mr-1.5" />
                Detalles
            </Button>
            {team.albumIds && team.albumIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleViewAlbumsClick} className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  Álbumes ({team.albumIds.length})
              </Button>
            )}
        </div>
        {isUserAuthenticated && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEditTeam(team)} aria-label={`Editar ${team.name}`}>
              <Pencil className="h-5 w-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteTeam(team.id)} aria-label={`Borrar ${team.name}`}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
