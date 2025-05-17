
"use client";

import type { ReactNode } from 'react';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, LayoutDashboard, Menu, Vault } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/albums', label: 'Álbumes', icon: BookOpen },
  { href: '/players', label: 'Jugadores', icon: Users },
];

const Logo = () => (
  <Vault className="w-8 h-8 text-primary" aria-label="Logo de FutBunker - Caja Fuerte" />
);

function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/90 backdrop-blur-sm px-4 sm:px-6 md:px-8">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <Logo />
        <span className="text-xl font-semibold text-primary hidden sm:inline-block">FutBunker</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Trigger */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
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
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
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
