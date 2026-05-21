import { useState, type FC, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import type { User, Theme } from './authTypes';


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme-view') as Theme) || 'claro';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) return JSON.parse(savedUser);
    
    return {
      id: 1,
      nombre: 'Administrador General',
      correo: 'admin@miumg.edu.gt',
      rol: 'ADMIN'
    };
  });

  const setTheme = (nuevoTema: Theme) => {
    setThemeState(nuevoTema);
    localStorage.setItem('theme-view', nuevoTema);
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || user?.rol === 'ADMIN',
        theme,
        setTheme,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};