"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFormValuesType } from "@/validators/loginSchema";
import { RegisterFormValuesType } from "@/validators/registerSchema";
import { AuthResponse, isAuthenticated, loginUser, logoutUser, registerUser, tokenManager, fetchUserProfile } from "@/services/auth.service";


interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {

  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;


  login: (credentials: LoginFormValuesType) => Promise<void>;
  register: (userData: RegisterFormValuesType) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 🎁 PROVIDER DEL CONTEXTO
 * 
 * Este componente envuelve la aplicación y provee el estado
 * de autenticación a todos los componentes hijs.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 🔄 EFECTO INICIAL
   * 
   * Al cargar la aplicación, verifica si hay un token guardado.
   * Si existe, podríamos hacer una petición al backend para
   * obtener los datos del usuario.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verificamos si hay un token
        if (isAuthenticated()) {
          try {
            const userData = await fetchUserProfile();
            if (userData) {
              setUser({
                ...userData,
                role: userData.role || 'user'
              });
            } else {
              // Si no recibimos datos pero teníamos token, algo anda mal
              tokenManager.removeToken();
            }
          } catch (error) {
             // Si el token es inválido o expiró, la API fallará
             console.error("Token inválido o expirado:", error);
             tokenManager.removeToken();
          }
        }
      } catch (error) {
        console.error("Error al inicializar auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 🔑 FUNCIÓN DE LOGIN
   * 
   * Llama al servicio de login y actualiza el estado del usuario.
   */
  const login = async (credentials: LoginFormValuesType) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await loginUser(credentials);

      // Si el login fue exitoso, guardamos los datos del usuario
      if (response.user) {
        setUser({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role || 'user',
        });
      }

      // El token ya fue guardado por loginUser()
    } catch (error) {
      // Propagamos el error para que el formulario lo maneje
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 📝 FUNCIÓN DE REGISTRO
   * 
   * Llama al servicio de registro.
   */
  const register = async (userData: RegisterFormValuesType) => {
    try {
      setIsLoading(true);
      await registerUser(userData);
      // Después del registro exitoso, el usuario debe hacer login
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🚪 FUNCIÓN DE LOGOUT
   * 
   * Cierra la sesión del usuario y limpia el estado.
   */
  const logout = () => {
    logoutUser(); // Elimina el token
    setUser(null); // Limpia el estado del usuario
    router.push("/login"); // Redirige al login
  };

  /**
   * 📊 VALOR DEL CONTEXTO
   * 
   * Este objeto es lo que estará disponible para todos los componentes
   * que usen el hook useAuth.
   */
  const value: AuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 🪝 HOOK PERSONALIZADO
 * 
 * Este hook facilita el uso del contexto y agrega validación.
 * 
 * Uso en componentes:
 * const { user, login, logout, isLoggedIn } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  // Si el contexto es undefined, significa que el componente
  // está siendo usado fuera del AuthProvider
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  return context;
}
