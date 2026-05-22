import { useState, type FC, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import type { User, Theme } from './authTypes';

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("theme-view") as Theme) || "claro";
  });

  const [user, setUser] = useState<User | null>(() => {
    const currentToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (!currentToken || !savedUser) {
      return null;
    }
    
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const setTheme = (nuevoTema: Theme) => {
    setThemeState(nuevoTema);
    localStorage.setItem("theme-view", nuevoTema);
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
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
