import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service';
import { supabase } from '../config/supabase';

interface User {
  id: string | number;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', supabaseUser.id)
          .single();

        const role = profile?.role || supabaseUser.user_metadata.role || (supabaseUser.email === 'mauro.digitalbox@gmail.com' ? 'admin' : 'user');
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          role: role as 'user' | 'admin'
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial check for existing session (very fast)
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const role = session.user.email === 'mauro.digitalbox@gmail.com' ? 'admin' : (session.user.user_metadata.role || 'user');
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: role as 'user' | 'admin'
        });
      }
      setLoading(false);
    };
    initSession();

    // 2. Listen for auth changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const role = session.user.email === 'mauro.digitalbox@gmail.com' ? 'admin' : (session.user.user_metadata.role || 'user');
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: role as 'user' | 'admin'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
