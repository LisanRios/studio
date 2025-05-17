
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import initialUsersData from '@/data/users.json'; // Importamos directamente el JSON
import type { LoggedInUser, UserCredentials } from '@/types';

interface AuthContextType {
  user: LoggedInUser | null;
  login: (usernameInput: string, passwordInput: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  addUser: (newUser: UserCredentials) => Promise<{ success: boolean; message: string }>;
  getUsers: () => Pick<UserCredentials, 'username'>[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [appUsers, setAppUsers] = useState<UserCredentials[]>(initialUsersData);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al leer de localStorage:", error);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    const foundUser = appUsers.find(
      (u) => u.username === usernameInput && u.password === passwordInput
    );

    if (foundUser) {
      const userData: LoggedInUser = { username: foundUser.username };
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
    router.push('/login');
  };

  const addUser = async (newUser: UserCredentials): Promise<{ success: boolean; message: string }> => {
    if (!user) { // Only logged-in users can add new users
      return { success: false, message: "Debes estar logueado para agregar usuarios." };
    }
    if (!newUser.username || !newUser.password) {
      return { success: false, message: "Nombre de usuario y contraseña son obligatorios." };
    }
    if (appUsers.find(u => u.username === newUser.username)) {
      return { success: false, message: `El usuario "${newUser.username}" ya existe.` };
    }
    setAppUsers(prevUsers => [...prevUsers, newUser]);
    // IMPORTANT: In a real application, this new user should be persisted to a database.
    // Here, it's only added to the in-memory state and will be lost on page refresh
    // unless users.json is manually updated.
    return { success: true, message: `Usuario "${newUser.username}" agregado exitosamente (en memoria).` };
  };

  const getUsers = (): Pick<UserCredentials, 'username'>[] => {
    return appUsers.map(u => ({ username: u.username }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, addUser, getUsers }}>
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
