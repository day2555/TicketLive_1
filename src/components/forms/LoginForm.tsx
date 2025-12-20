"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import {
  LoginFormValuesType,
  loginInitialValues,
  loginValidationSchema,
} from "@/validators/loginSchema";

import { loginUser } from "@/services/auth.service";

export default function LoginForm() {
  const router = useRouter();

  const formik = useFormik<LoginFormValuesType>({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await loginUser(values);
        console.log("Login success:", response);

        Swal.fire({
          title: "Inicio de sesión exitoso",
          icon: "success",
          draggable: true,
        });

        resetForm();
        router.push("/");
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unsuccessful login";

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });
      }
    },
  });

  return (
    <form
      className="w-full max-w-lg rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 shadow-2xl shadow-black/40 ring-1 ring-white/10 p-10 md:p-12 flex flex-col gap-8 mb-9"
      onSubmit={formik.handleSubmit}
    >
      <div className="form-div">
        <label className="form-label" htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-input"
          placeholder="Inserta tu correo electrónico"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="form-error">{formik.errors.email}</p>
        )}
      </div>

      <div className="form-div">
        <label className="form-label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-input"
          placeholder="Inserta tu contraseña"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="form-error">{formik.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="form-button"
      >
        {formik.isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
      </button>
    </form>
  );
}
