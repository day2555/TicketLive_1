import { RegisterFormValuesType } from "@/validators/registerSchema";
import { LoginFormValuesType } from "@/validators/loginSchema";

/**
 * 🔧 CONFIGURACIÓN DE LA API
 * 
 * La URL del backend se obtiene de las variables de entorno.
 * Para configurarlo, crea un archivo .env.local en la raíz del proyecto con:
 * NEXT_PUBLIC_API_URL=http://localhost:3001
 * 
 * El prefijo NEXT_PUBLIC_ es necesario para que Next.js exponga
 * la variable al navegador (client-side).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * 📦 TIPOS DE RESPUESTA DEL BACKEND
 * 
 * Estos tipos definen la estructura de las respuestas que esperamos
 * del backend. Ajústalos según tu API real.
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * 🔐 MANEJO DE TOKENS
 * 
 * Funciones para guardar, obtener y eliminar el token de autenticación
 * en localStorage. Esto permite mantener la sesión del usuario.
 */
export const tokenManager = {
  /**
   * Guarda el token en localStorage
   */
  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  /**
   * Obtiene el token de localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  /**
   * Elimina el token de localStorage (logout)
   */
  removeToken: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },
};

/**
 * 📝 FUNCIÓN DE REGISTRO
 * 
 * Envía los datos del usuario al endpoint de registro del backend.
 * 
 * @param userData - Datos del formulario de registro
 * @returns Promesa con la respuesta del servidor
 * @throws Error si el registro falla
 */
export const registerUser = async (
  userData: RegisterFormValuesType
): Promise<AuthResponse> => {
  try {
    // 1️⃣ Hacemos la petición POST al backend
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // 2️⃣ Parseamos la respuesta JSON
    const data = await response.json();

    // 3️⃣ Si la respuesta no es OK (status 200-299), lanzamos un error
    if (!response.ok) {
      // El backend puede enviar un mensaje de error específico
      throw new Error(data?.message || "Error al registrar usuario");
    }

    // 4️⃣ Si el registro fue exitoso, retornamos los datos
    return data;
  } catch (error) {
    // 5️⃣ Manejo de errores de red o del servidor
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
};

/**
 * 🔑 FUNCIÓN DE LOGIN
 * 
 * Envía las credenciales al endpoint de login del backend.
 * Si el login es exitoso, guarda el token en localStorage.
 * 
 * @param userData - Credenciales del usuario (email y password)
 * @returns Promesa con la respuesta del servidor
 * @throws Error si el login falla
 */
export const loginUser = async (
  userData: LoginFormValuesType
): Promise<AuthResponse> => {
  try {
    // 1️⃣ Hacemos la petición POST al backend
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // 2️⃣ Parseamos la respuesta JSON
    const data = await response.json();

    // 3️⃣ Si la respuesta no es OK, lanzamos un error
    if (!response.ok) {
      throw new Error(data?.message || "Error al iniciar sesión");
    }

    // 4️⃣ Si el login fue exitoso y hay un token, lo guardamos
    if (data.token) {
      tokenManager.setToken(data.token);
    }

    // 5️⃣ Retornamos los datos del usuario
    return data;
  } catch (error) {
    // 6️⃣ Manejo de errores
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error de conexión con el servidor");
  }
};


export const fetchUserProfile = async (): Promise<AuthResponse['user']> => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Error al obtener perfil");
    }

    return data; // Asumimos que el backend devuelve el objeto de usuario directamente o dentro de data
  } catch (error) {
    throw error;
  }
};

/**
 * 🚪 FUNCIÓN DE LOGOUT
 * 
 * Cierra la sesión del usuario eliminando el token.
 * Opcionalmente, puedes hacer una petición al backend para invalidar el token.
 */
export const logoutUser = (): void => {
  tokenManager.removeToken();

  // 💡 OPCIONAL: Si tu backend tiene un endpoint de logout
  // const token = tokenManager.getToken();
  // if (token) {
  //   fetch(`${API_URL}/users/logout`, {
  //     method: "POST",
  //     headers: {
  //       "Authorization": `Bearer ${token}`,
  //     },
  //   });
  // }
};

/**
 * 🛡️ FUNCIÓN PARA OBTENER HEADERS CON AUTENTICACIÓN
 * 
 * Utilidad para agregar el token a las peticiones protegidas.
 * Úsala cuando necesites hacer peticiones que requieran autenticación.
 * 
 * @returns Headers con el token de autenticación
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = tokenManager.getToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * 👤 FUNCIÓN PARA VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
 * 
 * Verifica si existe un token en localStorage.
 * 
 * @returns true si hay un token, false si no
 */
export const isAuthenticated = (): boolean => {
  return !!tokenManager.getToken();
};
