import { adminFirestoreDb } from "@/lib/firebase.server";
import type { AttendanceFormType } from "../schema/attendance.schema";

export default async function updateAttendance(
  attendanceUid: string,
  attendanceForm: AttendanceFormType
) {
  try {
    const observationTypeRef = adminFirestoreDb
      .collection("observation-type")
      .doc(attendanceForm.observation_type ?? "");

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
    });
    return true;
  } catch (error) {
    console.error("Error al actualizar el registro de asistencia:", error);
    return false;
  }
}
