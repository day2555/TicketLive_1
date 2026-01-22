"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { User, AuthResponse } from "@/interfaces/user.interface";
import { LoginFormValuesType } from "@/validators/loginSchema";
import { RegisterFormValuesType } from "@/validators/registerSchema";

import {
  loginUser,
  registerUser,
  fetchUserProfile,
  logoutUser,
} from "@/services/auth.service";

import {
  saveUserToLocalStorage,
  loadUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "@/utils/localStorage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginFormValuesType) => Promise<void>;
  register: (userData: RegisterFormValuesType) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * 🔄 Carga sesión (Google auth / reload)
   */
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);

      const savedUser = loadUserFromLocalStorage();
      const userData = await fetchUserProfile();

      if (userData) {
        const fullUser: User = {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          googleId: userData.googleId,
          isAdmin: userData.isAdmin || false,
          phone: userData.phone,
          address: userData.address,
          profile_photo:
            userData.profile_photo ||
            savedUser?.profile_photo ||
            null,
          profile_photo_id:
            userData.profile_photo_id ||
            savedUser?.profile_photo_id,
          birthday: userData.birthday
            ? new Date(userData.birthday)
            : null,
        };

        setUser(fullUser);
        saveUserToLocalStorage(fullUser);
      } else {
        setUser(savedUser ?? null);
      }
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      setUser(loadUserFromLocalStorage() ?? null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 🚀 Carga inicial desde localStorage
   */
  useEffect(() => {
    const savedUser = loadUserFromLocalStorage();
    if (savedUser) {
      setUser(savedUser);
    }
    // TEMPORALMENTE COMENTADO: El backend no guarda los cambios correctamente
    // Descomentar cuando el backend esté arreglado
    // refreshUser();
    setIsLoading(false);
  }, []);

  /**
   * 🔐 LOGIN
   */
  const login = async (credentials: LoginFormValuesType) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await loginUser(credentials);

      if (!response.user) return;

      const fullUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        googleId: response.user.googleId,
        isAdmin: response.user.isAdmin || false,
        phone: response.user.phone,
        address: response.user.address,
        profile_photo: response.user.profile_photo,
        profile_photo_id: response.user.profile_photo_id,
        birthday: response.user.birthday
          ? new Date(response.user.birthday)
          : null,
      };

      setUser(fullUser);
      saveUserToLocalStorage(fullUser);

      if (response.token) {
        localStorage.setItem("token", response.token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📝 REGISTER (solo crea usuario)
   */
  const register = async (userData: RegisterFormValuesType) => {
    try {
      setIsLoading(true);
      await registerUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🚪 LOGOUT
   */
  const logout = async () => {
    await logoutUser();
    setUser(null);
    removeUserFromLocalStorage();
    localStorage.removeItem("token");
    router.push("/login");
  };

  /**
   * ✏️ Update local user
   */
  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    saveUserToLocalStorage(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    loading: isLoading,
    isLoggedIn: !!user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 🪝 Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
