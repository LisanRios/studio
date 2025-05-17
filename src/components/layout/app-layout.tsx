
"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, LayoutDashboard, Menu, Vault, LogIn, LogOut, Shield, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean; 
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/albums', label: 'Álbumes', icon: BookOpen },
  { href: '/players', label: 'Jugadores', icon: Users },
  { href: '/teams', label: 'Equipos', icon: Shield },
];

const Logo = () => (
  <Vault className="w-8 h-8 text-primary" aria-label="Logo de FutBunker - Caja Fuerte" />
);

function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const renderNavItems = (isMobile = false) => {
    return navItems.map((item) => {
      if (item.requiresAuth && !user) {
        return null; 
      }
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-3 py-2 rounded-md font-medium transition-colors",
            isMobile ? "text-base" : "text-sm",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <item.icon className={cn("h-5 w-5", isMobile ? "mr-3 h-6 w-6" : "mr-2")} />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/90 backdrop-blur-sm px-4 sm:px-6 md:px-8">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="text-xl font-semibold text-primary hidden sm:inline-block">FutBunker</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {renderNavItems()}
      </div>

      {/* Auth buttons and User Avatar */}
      <div className="flex items-center gap-3">
        {!loading && (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Hola, {user.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/manage-users">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Gestionar Usuarios
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" passHref>
              <Button variant="ghost" className="hidden md:flex">
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar Sesión
              </Button>
            </Link>
          )
        )}

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 bg-background p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Logo />
                <span className="text-xl font-semibold text-primary">FutBunker</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col space-y-2">
                {renderNavItems(true)}
                 {!loading && user && (
                  <>
                    <DropdownMenuSeparator />
                     <Link href="/manage-users" passHref>
                        <Button variant="outline" className="w-full justify-start px-3 py-2 mt-2" onClick={() => setMobileMenuOpen(false)}>
                           <UserPlus className="mr-3 h-6 w-6" /> Gestionar Usuarios
                        </Button>
                     </Link>
                  </>
                )}
                {!user && !loading && (
                   <Link href="/login" passHref>
                      <Button variant="outline" className="w-full justify-start px-3 py-2 mt-4" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="mr-3 h-6 w-6" />
                        Iniciar Sesión
                      </Button>
                  </Link>
                )}
              </nav>
            </div>
             {user && !loading && (
                <div className="p-4 border-t mt-auto">
                    <Button variant="outline" className="w-full justify-start px-3 py-2" onClick={() => { logout(); setMobileMenuOpen(false);}}>
                        <LogOut className="mr-3 h-6 w-6" /> Cerrar Sesión
                    </Button>
                </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
