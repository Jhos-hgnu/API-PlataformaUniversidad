import { api } from './api';

export interface Periodo {
  id_periodo: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: boolean;
}

export interface CreatePeriodoRequest {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface UpdatePeriodoRequest {
  nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export const periodosService = {
  getAll: () => api.get<Periodo[]>('/periodos'),

  getById: (id: number) => api.get<Periodo>(`/periodos/${id}`),

  create: (data: CreatePeriodoRequest) =>
    api.post<Periodo>('/periodos', data),

  update: (id: number, data: UpdatePeriodoRequest) =>
    api.patch<Periodo>(`/periodos/${id}`, data),

  remove: (id: number) => api.delete<Periodo>(`/periodos/${id}`),

  restore: (id: number) => api.patch<Periodo>(`/periodos/${id}/restore`),
};
