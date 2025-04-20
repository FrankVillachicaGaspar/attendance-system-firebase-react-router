import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Porfavor ingrese un correo válido.",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener mas de 8 caracteres",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
