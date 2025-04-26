import { z } from "zod";

// Esquema para el tipo AttendanceFormType con validaciones adicionales
export const AttendanceFormTypeSchema = z
  .object({
    first_check_in_time: z.string().nullable(),
    first_check_out_time: z.string().nullable(),
    second_check_in_time: z.string().nullable(),
    second_check_out_time: z.string().nullable(),
    observation_type: z.string().nullable(),
    observation: z.string().nullable(),
  })
  .refine(
    (data) => {
      let isValid = true;

      // Validación de las fechas con las reglas mencionadas
      if (data.first_check_in_time && data.first_check_out_time) {
        const firstCheckIn = new Date(data.first_check_in_time);
        const firstCheckOut = new Date(data.first_check_out_time);
        if (firstCheckOut < firstCheckIn) {
          isValid = false;
          data.first_check_out_time = null; // Esto limpia el campo para que se capture en los errores
          throw new z.ZodError([
            {
              message:
                "La hora de salida no puede ser menor a la hora de entrada",
              path: ["first_check_out_time"],
              code: z.ZodIssueCode.custom,
            },
          ]);
        }
      }

      if (data.first_check_out_time && data.second_check_in_time) {
        const firstCheckOut = new Date(data.first_check_out_time);
        const secondCheckIn = new Date(data.second_check_in_time);
        if (secondCheckIn < firstCheckOut) {
          isValid = false;
          data.second_check_in_time = null; // Limpiamos el campo para la validación
          throw new z.ZodError([
            {
              message:
                "La hora de entrada no puede ser menor a la hora de salida",
              path: ["second_check_in_time"],
              code: z.ZodIssueCode.custom,
            },
          ]);
        }
      }

      if (data.second_check_in_time && data.second_check_out_time) {
        const secondCheckIn = new Date(data.second_check_in_time);
        const secondCheckOut = new Date(data.second_check_out_time);
        if (secondCheckOut < secondCheckIn) {
          isValid = false;
          data.second_check_out_time = null; // Limpiamos el campo para la validación
          throw new z.ZodError([
            {
              message:
                "La hora de salida no puede ser menor a la hora de entrada",
              path: ["second_check_out_time"],
              code: z.ZodIssueCode.custom,
            },
          ]);
        }
      }

      return isValid; // Si todas las validaciones pasaron, retorna true
    },
    {
      message: "Las fechas no son válidas", // Mensaje por defecto
    }
  );

export type AttendanceFormType = z.infer<typeof AttendanceFormTypeSchema>;
