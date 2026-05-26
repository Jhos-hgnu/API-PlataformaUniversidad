import { api } from './api';
import type { Carrera } from './carreras.service';

export interface Curso {
  id_curso: number;
  codigo: string;
  nombre: string;
  creditos: number;
  cupo_maximo: number;
  id_carrera: number;
  estado: boolean;
  Carreras?: Carrera;
}

export interface CreateCursoRequest {
  codigo: string;
  nombre: string;
  creditos: number;
  cupo_maximo: number;
  id_carrera: number;
}

export interface UpdateCursoRequest {
  codigo?: string;
  nombre?: string;
  creditos?: number;
  cupo_maximo?: number;
  id_carrera?: number;
}

export const cursosService = {
  getAll: () => api.get<Curso[]>('/cursos'),

  getById: (id: number) => api.get<Curso>(`/cursos/${id}`),

  getByCarrera: (idCarrera: number) =>
    api.get<Curso[]>(`/cursos/carrera/${idCarrera}`),

  create: (data: CreateCursoRequest) =>
    api.post<Curso>('/cursos', data),

  update: (id: number, data: UpdateCursoRequest) =>
    api.patch<Curso>(`/cursos/${id}`, data),

  remove: (id: number) => api.delete<Curso>(`/cursos/${id}`),
};
