"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usersData from '@/data/users.json'; // Importamos directamente el JSON

interface User {
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Para manejar el estado inicial desde localStorage
  const router = useRouter();

  useEffect(() => {
    // Intentar cargar el usuario desde localStorage al iniciar
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al leer de localStorage:", error);
      // Asegurarse de que localStorage esté limpio si hay un error de parsing
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    const foundUser = usersData.find(
      (u) => u.username === usernameInput && u.password === passwordInput
    );

    if (foundUser) {
      const userData = { username: foundUser.username };
      setUser(userData);
      try {
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Error al escribir en localStorage:", error);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error("Error al limpiar localStorage:", error);
    }
    router.push('/login'); // Redirigir a login al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
