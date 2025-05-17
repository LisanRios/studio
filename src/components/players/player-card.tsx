"use client";

import type { Player } from "@/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShieldAlert, MapPin, Shirt, Trophy } from "lucide-react"; // Added Shirt for appearances, Trophy for goals

interface PlayerCardProps {
  player: Player;
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

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <div className="aspect-square w-full relative">
          <Image
            src={player.photoUrl}
            alt={`Photo of ${player.name}`}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="soccer player"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-2xl font-semibold mb-1 text-primary">{player.name}</CardTitle>
        <CardDescription className="text-accent font-medium mb-3">{player.position}</CardDescription>
        
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-accent" />
            <span>Team: {player.team}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-accent" />
            <span>Nationality: {player.nationality}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-accent" />
            <span>Age: {calculateAge(player.dateOfBirth)} (Born: {new Date(player.dateOfBirth).toLocaleDateString()})</span>
          </div>
          {player.appearances !== undefined && (
            <div className="flex items-center">
              <Shirt className="w-4 h-4 mr-2 text-accent" />
              <span>Appearances: {player.appearances}</span>
            </div>
          )}
          {player.goals !== undefined && (
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-accent" />
              <span>Goals: {player.goals}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/50 rounded-b-lg">
        <Badge variant={player.position === "Forward" ? "default" : "secondary"}>
          {player.position}
        </Badge>
      </CardFooter>
    </Card>
  );
}
