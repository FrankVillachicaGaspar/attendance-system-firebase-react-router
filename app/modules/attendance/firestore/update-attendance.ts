import { adminFirestoreDb } from "@/lib/firebase.server";
import type { AttendanceFormType } from "../schema/attendance.schema";
import { differenceInHours, parseISO } from "date-fns";

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

    console.log(horasTrabajadas, horasExtras);

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
  // Asegurarse de que las horas de entrada y salida sean válidas y convertirlas a fecha UTC
  const firstCheckInDate = firstCheckIn ? parseISO(firstCheckIn) : null;
  const firstCheckOutDate = firstCheckOut ? parseISO(firstCheckOut) : null;
  const secondCheckInDate = secondCheckIn ? parseISO(secondCheckIn) : null;
  const secondCheckOutDate = secondCheckOut ? parseISO(secondCheckOut) : null;

  console.log(
    firstCheckInDate,
    firstCheckOutDate,
    secondCheckInDate,
    secondCheckOutDate
  );

  // Verificar si las fechas son válidas
  if (
    firstCheckInDate &&
    firstCheckOutDate &&
    !isNaN(firstCheckInDate.getTime()) &&
    !isNaN(firstCheckOutDate.getTime())
  ) {
    // Calcular la duración de la primera jornada
    const primeraJornada = differenceInHours(
      firstCheckOutDate,
      firstCheckInDate
    );

    let segundaJornada = 0;

    // Si existen las segundas horas de entrada y salida
    if (
      secondCheckInDate &&
      secondCheckOutDate &&
      !isNaN(secondCheckInDate.getTime()) &&
      !isNaN(secondCheckOutDate.getTime())
    ) {
      // Calcular la duración de la segunda jornada
      segundaJornada = differenceInHours(secondCheckOutDate, secondCheckInDate);
    }

    const tiempoEstandar = 8;

    // Calcular las horas trabajadas totales
    const horasTrabajadasTotales = primeraJornada + segundaJornada;

    // Definir el tiempo estándar de trabajo (por ejemplo, 8 horas)

    // Calcular las horas extras
    const horasExtras =
      horasTrabajadasTotales > tiempoEstandar
        ? horasTrabajadasTotales - tiempoEstandar
        : 0;

    return {
      horasTrabajadas:
        horasTrabajadasTotales > tiempoEstandar
          ? tiempoEstandar
          : horasTrabajadasTotales,
      horasExtras,
    };
  } else {
    // Si no se han proporcionado las primeras horas de entrada o salida válidas, devolver 0
    return { horasTrabajadas: 0, horasExtras: 0 };
  }
}
