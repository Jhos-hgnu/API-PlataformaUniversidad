import { api } from './api';

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: 'admin' | 'docente' | 'estudiante';
  estado: boolean;
  fecha_creacion: string;
}

export interface CreateUsuarioRequest {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol?: 'admin' | 'docente' | 'estudiante';
}

export interface UpdateUsuarioRequest {
  nombre?: string;
  apellido?: string;
  correo?: string;
  password?: string;
  rol?: 'admin' | 'docente' | 'estudiante';
}

export const usuariosService = {
  getAll: () => api.get<Usuario[]>('/users'),

  getById: (id: number) => api.get<Usuario>(`/users/${id}`),

  create: (data: CreateUsuarioRequest) =>
    api.post<Usuario>('/users', data),

  update: (id: number, data: UpdateUsuarioRequest) =>
    api.patch<Usuario>(`/users/${id}`, data),

  remove: (id: number) => api.delete<Usuario>(`/users/${id}`),
};
