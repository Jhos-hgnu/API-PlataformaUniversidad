import { api } from './api';
import type { Curso } from './cursos.service';

export interface Carrera {
  id_carrera: number;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  Cursos?: Curso[];
}

export interface CreateCarreraRequest {
  nombre: string;
  descripcion?: string;
}

export interface UpdateCarreraRequest {
  nombre?: string;
  descripcion?: string;
  estado?: boolean;
}

export const carrerasService = {
  getAll: () => api.get<Carrera[]>('/carreras'),

  getById: (id: number) => api.get<Carrera>(`/carreras/${id}`),

  create: (data: CreateCarreraRequest) =>
    api.post<Carrera>('/carreras', data),

  update: (id: number, data: UpdateCarreraRequest) =>
    api.patch<Carrera>(`/carreras/${id}`, data),

  remove: (id: number) => api.delete<Carrera>(`/carreras/${id}`),
};
