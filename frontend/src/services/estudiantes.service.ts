import { api } from './api';
import type { Carrera } from './carreras.service';
import type { Usuario } from './usuarios.service';

export interface Estudiante {
  id_estudiante: number;
  id_usuario: number;
  carnet: string;
  id_carrera: number;
  estado: boolean;
  Usuarios?: Pick<Usuario, 'nombre' | 'apellido' | 'correo'>;
  Carreras?: Carrera;
}

export interface CreateEstudianteRequest {
  id_usuario: number;
  carnet: string;
  id_carrera: number;
}

export interface UpdateEstudianteRequest {
  id_usuario?: number;
  carnet?: string;
  id_carrera?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const estudiantesService = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<PaginatedResponse<Estudiante>>('/estudiantes', { params }),

  getById: (id: number) => api.get<Estudiante>(`/estudiantes/${id}`),

  getMe: () => api.get<Estudiante>('/estudiantes/me'),

  getByCarrera: (idCarrera: number) =>
    api.get<Estudiante[]>(`/estudiantes/carrera/${idCarrera}`),

  create: (data: CreateEstudianteRequest) =>
    api.post<Estudiante>('/estudiantes', data),

  update: (id: number, data: UpdateEstudianteRequest) =>
    api.patch<Estudiante>(`/estudiantes/${id}`, data),

  remove: (id: number) => api.delete<Estudiante>(`/estudiantes/${id}`),

  restore: (id: number) => api.patch<Estudiante>(`/estudiantes/${id}/restore`),
};
