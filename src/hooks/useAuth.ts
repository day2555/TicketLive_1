"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  profile_photo?: string;
  dni?: string;
  birthday?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    
    // Escuchar cambios en localStorage (cuando se loguea desde otra pestaña o componente)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado para actualización inmediata
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const checkAuth = () => {
    try {
      const userData = localStorage.getItem('ticketlive_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ticketlive_user');
    localStorage.removeItem('ticketlive_redirect');
    setUser(null);
    router.push('/login');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('ticketlive_user', JSON.stringify(newUser));
      // Disparar evento para notificar a otros componentes
      window.dispatchEvent(new Event('authChange'));
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    updateUser,
    checkAuth,
  };
};