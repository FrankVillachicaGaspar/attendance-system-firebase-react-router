import { z } from "zod";

import { parseISO, isValid } from "date-fns"; // Importamos parseISO y isValid de date-fns

// Función para calcular la edad
const calculateAge = (birthDate: string): number => {
  // Asegurarse de que birthDate esté en un formato ISO válido
  const parsedDate = parseISO(birthDate);
  if (!isValid(parsedDate)) {
    throw new Error("Fecha de nacimiento inválida.");
  }

  const today = new Date();
  let age = today.getFullYear() - parsedDate.getFullYear();
  const month = today.getMonth();
  if (
    month < parsedDate.getMonth() ||
    (month === parsedDate.getMonth() && today.getDate() < parsedDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const employeeFormSchema = z.object({
  department: z.string().min(1, {
    message: "Debe seleccionar un departamento",
  }),
  role: z.string().min(1, {
    message: "Debe seleccionar un rol",
  }),
  job_position: z.string().min(1, {
    message: "Debe seleccionar un puesto de trabajo",
  }),
  names: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  lastname: z.string().min(5, {
    message: "El apellido debe tener al menos 5 caracteres.",
  }),
  dni: z
    .string()
    .min(8, {
      message: "El DNI debe tener al menos 8 caracteres",
    })
    .max(8, {
      message: "El DNI no debe tener mas de 8 caracteres",
    }),
  salary: z.number().min(1, {
    message: "El salario debe ser mayor a 0",
  }),
  phone_code: z.string().min(1, {
    message: "Debe ingresar el código de país",
  }),
  phone_number: z
    .string()
    .min(7, {
      message: "El número de teléfono debe tener al menos 7 caracteres",
    })
    .max(12, {
      message: "El número de teléfono no debe tener mas de 12 caracteres",
    }),
  birth_date: z
    .string()
    .min(1, {
      message: "Debe ingresar la fecha de nacimiento",
    })
    .refine((birthDate) => calculateAge(birthDate) >= 18, {
      message: "La persona debe ser mayor de 18 años",
    }),
  hiring_date: z.string().min(1, {
    message: "Debe ingresar la fecha de contratación",
  }),
  is_active: z.boolean(),
  email: z.string().email({
    message: "Debe ingresar un correo electrónico válido",
  }),
});

export type EmployeeFormType = z.infer<typeof employeeFormSchema>;
