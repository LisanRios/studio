
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ListUsers, AlertTriangle } from 'lucide-react';
import type { UserCredentials } from '@/types';
import { useForm } from 'react-hook-form';

type AddUserFormData = Required<UserCredentials>;

export default function ManageUsersPage() {
  const { user, addUser, getUsers, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<Pick<UserCredentials, 'username'>[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setUserList(getUsers());
    }
  }, [user, authLoading, router, getUsers]);

  const handleAddUserSubmit = async (data: AddUserFormData) => {
    setIsLoading(true);
    const result = await addUser(data);
    setIsLoading(false);
    if (result.success) {
      toast({
        title: "Usuario Agregado",
        description: result.message,
      });
      setUserList(getUsers()); // Refresh user list
      reset(); // Reset form fields
    } else {
      toast({
        variant: "destructive",
        title: "Error al Agregar Usuario",
        description: result.message,
      });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
          <UserPlus className="mr-3 h-10 w-10" /> Gestionar Usuarios
        </h1>
        <p className="text-lg text-muted-foreground">
          Agrega nuevos usuarios al sistema.
        </p>
      </header>

      <Card className="mb-8 bg-destructive/10 border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" /> Nota Importante sobre Persistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive-foreground/90">
            Los usuarios que agregues aquí se guardarán solo en la memoria de la sesión actual del navegador.
            Si recargas la página o cierras el navegador, los nuevos usuarios se perderán.
            Para hacer los cambios permanentes, necesitarías actualizar manualmente el archivo <code>src/data/users.json</code> en el código fuente del proyecto y reconstruir la aplicación.
            Esta es una limitación del prototipo actual.
          </p>
        </CardContent>
      </Card>


      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <ListUsers className="mr-2 h-6 w-6 text-primary" /> Usuarios Existentes
            </CardTitle>
            <CardDescription>Lista de usuarios actualmente en el sistema (en memoria).</CardDescription>
          </CardHeader>
          <CardContent>
            {userList.length > 0 ? (
              <ul className="space-y-2">
                {userList.map((u, index) => (
                  <li key={index} className="p-3 bg-muted/50 rounded-md text-sm">
                    {u.username}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay usuarios adicionales.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <UserPlus className="mr-2 h-6 w-6 text-primary" /> Agregar Nuevo Usuario
            </CardTitle>
            <CardDescription>Completa el formulario para crear una nueva cuenta de usuario.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(handleAddUserSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  type="text"
                  {...register("username", { required: "El nombre de usuario es obligatorio" })}
                  placeholder="ej. nuevo_usuario"
                />
                {errors.username && <p className="text-sm text-destructive mt-1">{errors.username.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 3, message: "La contraseña debe tener al menos 3 caracteres" } })}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Agregando...' : 'Agregar Usuario'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
