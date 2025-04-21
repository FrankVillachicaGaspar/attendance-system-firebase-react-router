import type { Attendance } from "../types/attendance";

export const mockAttendance: Attendance[] = [
  {
    id: "ATT001",
    names: "Juan Carlos",
    lastname: "Pérez García",
    dni: "12345678",
    first_check_in_time: "2024-03-20T08:00:00",
    first_check_out_time: "2024-03-20T13:00:00",
    second_check_in_time: "2024-03-20T14:00:00",
    second_check_out_time: "2024-03-20T18:00:00",
    observation_type: "justificada",
    observation: "Llegó 5 minutos tarde por tráfico pesado"
  },
  {
    id: "ATT002",
    names: "María Elena",
    lastname: "Rodríguez López",
    dni: "87654321",
    first_check_in_time: "2024-03-20T07:55:00",
    first_check_out_time: "2024-03-20T13:00:00",
    second_check_in_time: "2024-03-20T14:00:00",
    second_check_out_time: "2024-03-20T17:30:00",
    observation_type: "injustificada",
    observation: "Salió temprano con permiso de supervisor"
  },
  {
    id: "ATT003",
    names: "Roberto José",
    lastname: "Martínez Silva",
    dni: "45678912",
    first_check_in_time: "2024-03-20T08:00:00",
    first_check_out_time: "2024-03-20T13:00:00",
    second_check_in_time: "2024-03-20T14:00:00",
    second_check_out_time: "2024-03-20T18:00:00",
    observation_type: "feriado",
    observation: "Día festivo"
  }
];