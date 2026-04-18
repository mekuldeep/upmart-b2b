import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi, AuthUser } from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; phone?: string; company?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('upmart_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('upmart_token');
    const storedUser = localStorage.getItem('upmart_user');
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('upmart_token');
        localStorage.removeItem('upmart_user');
      }
    }
    setIsLoading(false);
  }, []);

  const saveSession = (token: string, userData: AuthUser) => {
    localStorage.setItem('upmart_token', token);
    localStorage.setItem('upmart_user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    saveSession(res.access_token, res.user);
  };

  const signup = async (data: { name: string; email: string; password: string; phone?: string; company?: string }) => {
    const res = await authApi.register(data);
    saveSession(res.access_token, res.user);
  };

  const logout = () => {
    localStorage.removeItem('upmart_token');
    localStorage.removeItem('upmart_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    const res = await authApi.updateProfile(data);
    const updatedUser = { ...user, ...res.user } as AuthUser;
    setUser(updatedUser);
    localStorage.setItem('upmart_user', JSON.stringify(updatedUser));
  };

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authApi.getMe();
      setUser(res.user);
      localStorage.setItem('upmart_user', JSON.stringify(res.user));
    } catch {
      // Token invalid - logout
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
