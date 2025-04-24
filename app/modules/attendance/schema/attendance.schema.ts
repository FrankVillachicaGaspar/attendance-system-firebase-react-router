import { z } from "zod";

// Esquema para el tipo AttendanceFormType
export const AttendanceFormTypeSchema = z.object({
  first_check_in_time: z.string().nullable(), // first_check_in_time puede ser un string o null
  first_check_out_time: z.string().nullable(), // first_check_out_time puede ser un string o null
  second_check_in_time: z.string().nullable(), // second_check_in_time puede ser un string o null
  second_check_out_time: z.string().nullable(), // second_check_out_time puede ser un string o null
  observation_type: z.string().nullable(), // observation_type será un uid (string) o null
  observation: z.string().nullable(), // observation puede ser un string o null
});

export type AttendanceFormType = z.infer<typeof AttendanceFormTypeSchema>; // Esto infiere el tipo de TypeScript basado en el esquema Zod
