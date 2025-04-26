import { adminFirestoreDb } from "@/lib/firebase.server";
import type { AttendanceFormType } from "../schema/attendance.schema";

export default async function updateAttendance(
  attendanceUid: string,
  attendanceForm: AttendanceFormType
) {
  try {
    console.log(attendanceForm);
    let observationTypeRef: FirebaseFirestore.DocumentReference | null = null;

    const { horasTrabajadas, horasExtras } = calcularHorasTrabajadasYExtras(
      attendanceForm.first_check_in_time,
      attendanceForm.first_check_out_time,
      attendanceForm.second_check_in_time,
      attendanceForm.second_check_out_time
    );

    if (attendanceForm.observation_type) {
      observationTypeRef = adminFirestoreDb
        .collection("observation-type")
        .doc(attendanceForm.observation_type ?? "");
    }

    const attendanceRef = adminFirestoreDb
      .collection("attendance")
      .doc(attendanceUid);

    await attendanceRef.update({
      ...attendanceForm,
      observation_type: attendanceForm.observation_type
        ? observationTypeRef
        : null,
      observation: attendanceForm.observation_type
        ? attendanceForm.observation
        : null,
      work_hours: horasTrabajadas,
      overtime: horasExtras,
    });
    return true;
  } catch (error) {
    console.error("Error al actualizar el registro de asistencia:", error);
    return false;
  }
}

function calcularHorasTrabajadasYExtras(
  firstCheckIn: string | null,
  firstCheckOut: string | null,
  secondCheckIn: string | null,
  secondCheckOut: string | null
) {
  // Asegurarse de que las horas de entrada y salida sean válidas
  const firstCheckInDate = firstCheckIn ? new Date(firstCheckIn) : null;
  const firstCheckOutDate = firstCheckOut ? new Date(firstCheckOut) : null;
  const secondCheckInDate = secondCheckIn ? new Date(secondCheckIn) : null;
  const secondCheckOutDate = secondCheckOut ? new Date(secondCheckOut) : null;

  // Verificar si las fechas son válidas
  if (
    firstCheckInDate instanceof Date &&
    !isNaN(firstCheckInDate.getTime()) &&
    firstCheckOutDate instanceof Date &&
    !isNaN(firstCheckOutDate.getTime())
  ) {
    // Calcular la duración de la primera jornada
    const primeraJornada =
      (firstCheckOutDate.getTime() - firstCheckInDate.getTime()) /
      (1000 * 60 * 60); // Convertir de milisegundos a horas

    let segundaJornada = 0;

    // Si existen las segundas horas de entrada y salida
    if (
      secondCheckInDate instanceof Date &&
      !isNaN(secondCheckInDate.getTime()) &&
      secondCheckOutDate instanceof Date &&
      !isNaN(secondCheckOutDate.getTime())
    ) {
      // Calcular la duración de la segunda jornada
      segundaJornada =
        (secondCheckOutDate.getTime() - secondCheckInDate.getTime()) /
        (1000 * 60 * 60); // Convertir de milisegundos a horas
    }

    // Calcular las horas trabajadas totales
    const horasTrabajadas = primeraJornada + segundaJornada;

    // Definir el tiempo estándar de trabajo (por ejemplo, 8 horas)
    const tiempoEstandar = 8;

    // Calcular las horas extras
    const horasExtras =
      horasTrabajadas > tiempoEstandar ? horasTrabajadas - tiempoEstandar : 0;

    return { horasTrabajadas, horasExtras };
  } else {
    // Si no se han proporcionado las primeras horas de entrada o salida válidas, devolver 0
    return { horasTrabajadas: 0, horasExtras: 0 };
  }
}
