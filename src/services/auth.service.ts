import { RegisterFormValuesType } from "@/validators/registerSchema";
import { LoginFormValuesType } from "@/validators/loginSchema";

const API_URL = "http://localhost:3000";

// ========================================
// REGISTER USER
// ========================================
export const registerUser = async (userData: RegisterFormValuesType) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error en el registro");
    }

    return await response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Error en el registro");
  }
};

// ========================================
// LOGIN USER
// ========================================
export const loginUser = async (userData: LoginFormValuesType) => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Credenciales incorrectas");
    }

    const data = await response.json();
    
    // Extraer usuario de la respuesta
    const user = data.user || data;
    
    // Guardar en localStorage
    if (user && user.email) {
      localStorage.setItem('ticketlive_user', JSON.stringify(user));
      window.dispatchEvent(new Event('authChange'));
    }

    return data;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "Error al iniciar sesión");
  }
};