import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary mb-4">Bienvenido al Archivo de Álbumes</h1>
        <p className="text-xl text-muted-foreground">
          Tu repositorio digital para álbumes clásicos de fútbol e historia de jugadores.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center text-primary mb-2">
              <BookOpen className="w-8 h-8 mr-3" />
              <CardTitle className="text-3xl">Explorar Álbumes</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Explora una colección de álbumes históricos de fútbol. Revive los momentos y descubre tesoros olvidados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/albums" passHref>
              <Button size="lg" className="w-full">
                Ver Álbumes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center text-primary mb-2">
              <Users className="w-8 h-8 mr-3" />
              <CardTitle className="text-3xl">Descubrir Jugadores</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Busca y filtra a través de una base de datos de legendarios jugadores de fútbol. Encuentra estadísticas, historia y más.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/players" passHref>
              <Button size="lg" className="w-full">
                Buscar Jugadores <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <section className="mt-16 text-center p-8 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-primary mb-3">Sobre el Archivo de Álbumes</h2>
        <p className="text-muted-foreground">
          El Archivo de Álbumes está dedicado a preservar la rica historia del fútbol a través de sus álbumes icónicos y carreras de jugadores.
          Nuestra plataforma digital permite a entusiastas e investigadores por igual acceder y explorar fácilmente este fascinante mundo.
        </p>
      </section>
    </div>
  );
}
