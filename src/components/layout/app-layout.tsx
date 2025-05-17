"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, LayoutDashboard, Menu } from 'lucide-react'; // Removed Upload icon
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/albums', label: 'Albums', icon: BookOpen },
  { href: '/players', label: 'Players', icon: Users },
  // { href: '/upload', label: 'Upload PDF', icon: Upload }, // Removed Upload PDF link
];

function MobileSidebar() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar">
        <div className="flex flex-col h-full">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2.13c1.7.8 3 2.53 3 4.67h-2c0-1.66-1.34-3-3-3s-3 1.34-3 3H7c0-2.14 1.3-3.87 3-4.67V7zm-1.5 6.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.42-.17-.8-.44-1.06-.27-.27-.64-.44-1.06-.44s-.79.17-1.06.44c-.27.26-.44.64-.44 1.06z"/>
              </svg>
              <span className="text-xl font-semibold text-sidebar-foreground">Album Archive</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 overflow-y-auto p-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      className="w-full justify-start"
                      isActive={pathname === item.href}
                      variant="default"
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </div>
      </SheetContent>
    </Sheet>
  );
}


function DesktopSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "border-r border-sidebar-border transition-all duration-300 ease-in-out",
        state === 'collapsed' ? "w-[56px]" : "w-72" 
      )}
    >
      <SidebarHeader className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <Link href="/" className={cn("flex items-center gap-2", state === 'collapsed' ? "hidden" : "flex")}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2.13c1.7.8 3 2.53 3 4.67h-2c0-1.66-1.34-3-3-3s-3 1.34-3 3H7c0-2.14 1.3-3.87 3-4.67V7zm-1.5 6.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.42-.17-.8-.44-1.06-.27-.27-.64-.44-1.06-.44s-.79.17-1.06.44c-.27.26-.44.64-.44 1.06z"/>
            </svg>
           <span className="text-xl font-semibold text-sidebar-foreground">Album Archive</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  className="w-full justify-start"
                  isActive={pathname === item.href}
                  tooltip={state === 'collapsed' ? item.label : undefined}
                  variant="default"
                >
                  <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                  <span className={cn(state === 'collapsed' ? "hidden" : "block")}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}


export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <DesktopSidebar />
        </div>
        <SidebarInset className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 md:px-8">
            <div className="md:hidden">
              <MobileSidebar />
            </div>
            <div className="flex-1">
              {/* Optional: Add breadcrumbs or page title here */}
            </div>
            {/* Optional: Add User Profile / Settings Dropdown */}
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
