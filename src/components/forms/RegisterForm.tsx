"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import Swal from "sweetalert2";

import {
  RegisterFormValuesType,
  registerInitialValues,
  registerValidationSchema,
} from "@/validators/registerSchema";

import { registerUser } from "@/services/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const formik = useFormik<RegisterFormValuesType>({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await registerUser(values);
        console.log("Register success:", response);

        Swal.fire({
          title: "Registro exitoso",
          icon: "success",
          draggable: true,
        });

        resetForm();
        router.push("/login");
      } catch (error: unknown) {
        let errorMessage = "Unsuccessful register";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage || "Unsuccessful register",
        });
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-2xl rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 shadow-2xl shadow-black/40 ring-1 ring-white/10 p-10 md:p-12 flex flex-col gap-8 mb-9"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* EMAIL */}
        <div className="form-div">
          <label className="form-label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="form-error">{formik.errors.email}</p>
          )}
        </div>

        {/* CONTRASEÑA */}
        <div className="form-div">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
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

        {/* CONFIRMAR CONTRASEÑA */}
        <div className="form-div">
          <label htmlFor="confirmPassword">Confirmación de contraseña</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu contraseña"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="form-error">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {/* NOMBRE */}
        <div className="form-div">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu nombre"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="form-error">{formik.errors.name}</p>
          )}
        </div>

        {/* DIRECCION */}
        <div className="form-div">
          <label htmlFor="address">Dirección</label>
          <input
            id="address"
            name="address"
            type="text"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu dirección"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="form-error">{formik.errors.address}</p>
          )}
        </div>

        {/* TELEFONO */}
        <div className="form-div">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-input"
            placeholder="Inserta tu teléfono"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="form-error">{formik.errors.phone}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="form-button"
      >
        {formik.isSubmitting ? "Creando tu cuenta..." : "Crea tu cuenta"}
      </button>
    </form>
  );
}
