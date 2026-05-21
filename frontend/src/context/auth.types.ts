export type Role = 'ADMIN' | 'DOCENTE' | 'ESTUDIANTE';
export type Theme = 'claro' | 'oscuro' | 'coquette'; 

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: Role;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}
