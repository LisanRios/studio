import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { UserPlus, List, AlertTriangle, Edit, Trash2, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserCredentials } from '@/types';

type User = {
  _id: string;
  email: string;
  username?: string;
  status: 'pending' | 'active' | 'disabled';
  role: 'user' | 'admin';
  createdAt: string;
};

type AddUserFormData = Required<UserCredentials>;

export default function ManageUsersPage() {
  const { user, addUser, getUsers, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUserFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Obtener lista de usuarios desde la API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setUserList(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUsers();
    }
  }, [user, authLoading, router]);

  const handleStatusChange = async (userId: string, newStatus: 'pending' | 'active' | 'disabled') => {
    try {
      const response = await fetch(`/api/auth/users/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: "Estado actualizado", description: `Usuario ${newStatus}` });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: "Usuario eliminado", description: "Usuario eliminado correctamente" });
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUserSubmit = async (data: AddUserFormData) => {
    setIsLoading(true);
    const result = await addUser(data);
    setIsLoading(false);
    
    if (result.success) {
      toast({
        title: "Usuario Agregado",
        description: result.message,
      });
      fetchUsers();
      reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error al Agregar Usuario",
        description: result.message,
      });
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios del sistema</CardDescription>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select 
                      value={user.status} 
                      onValueChange={(value: 'pending' | 'active' | 'disabled') => handleStatusChange(user._id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="disabled">Deshabilitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <List className="mr-2 h-6 w-6 text-primary" /> Usuarios Existentes
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
