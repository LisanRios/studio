import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary mb-4">Welcome to Album Archive</h1>
        <p className="text-xl text-muted-foreground">
          Your digital repository for classic soccer albums and player history.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center text-primary mb-2">
              <BookOpen className="w-8 h-8 mr-3" />
              <CardTitle className="text-3xl">Browse Albums</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Explore a collection of historic soccer albums. Relive the moments and discover forgotten treasures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/albums" passHref>
              <Button size="lg" className="w-full">
                View Albums <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center text-primary mb-2">
              <Users className="w-8 h-8 mr-3" />
              <CardTitle className="text-3xl">Discover Players</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Search and filter through a database of legendary soccer players. Find stats, history, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/players" passHref>
              <Button size="lg" className="w-full">
                Find Players <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-16 text-center p-8 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-3">About Album Archive</h2>
        <p className="text-muted-foreground">
          Album Archive is dedicated to preserving the rich history of soccer through its iconic albums and player careers. 
          Our digital platform allows enthusiasts and researchers alike to easily access and explore this fascinating world.
        </p>
      </section>
    </div>
  );
}
