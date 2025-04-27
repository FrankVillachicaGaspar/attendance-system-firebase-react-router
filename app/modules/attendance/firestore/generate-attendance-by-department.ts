import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { adminFirestoreDb } from "@/lib/firebase.server";
import verifyTodayAttendanceByEmployee from "./verify-today-attendance-by-employee";
import { Timestamp } from "firebase-admin/firestore";
import { format } from "date-fns";

/**
 * Genera asistencias para los empleados de un departamento especifico
 * @param {string} departmentUid - uid del departamento
 * @returns {Promise<number>} - Cantidad de asistencias generadas
 */
export default async function generateAttendanceByDepartment(
  departmentUid: string,
  date: string
): Promise<number> {
  let generateAttendanceCount = 0;
  const departmentRef = adminFirestoreDb
    .collection("department")
    .doc(departmentUid);
  const departmentSnap = await departmentRef.get();

  if (departmentSnap.exists) {
    const departmentData = departmentSnap.data() as FirebaseDepartment;
    console.log(`Departamento: ${departmentData.name}`);
    if (departmentData.deleted_at !== null) {
      throw new Error("El departamento fue eliminado");
    }
  } else {
    throw new Error("Error al obtener el departamento");
  }

  const employeesRef = adminFirestoreDb
    .collection("employee")
    .where("is_active", "==", true)
    .where("department", "==", departmentRef)
    .where("deleted_at", "==", null);

  const employeesSnap = await employeesRef.get();

  if (!employeesSnap.empty) {
    // Usamos for...of para esperar a que las promesas se resuelvan
    for (const doc of employeesSnap.docs) {
      const employeeRef = doc.ref;
      const verify = await verifyTodayAttendanceByEmployee(employeeRef, date);

      if (verify) {
        generateAttendanceCount++;
        await adminFirestoreDb.collection("attendance").add({
          employee: employeeRef,
          department: departmentRef,
          first_check_in_time: null,
          first_check_out_time: null,
          second_check_in_time: null,
          second_check_out_time: null,
          observation_type: null,
          work_hours: 0,
          overtime: 0,
          observation: null,
          created_at: Timestamp.now(),
          created_at_date: date,
          deleted_at: null,
        });
      }
    }
  }

  return generateAttendanceCount;
}
