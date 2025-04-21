import type { DocumentReference } from "firebase-admin/firestore";
import type { FirebaseEmployee } from "../types/firebase/FirebaseEmployee.type";
import { adminFirestoreDb } from "@/lib/firebase.server";

export async function getCurrentEmployee(
  userUid: string
): Promise<FirebaseEmployee> {
  try {
    const employeeRef = adminFirestoreDb.doc(`employee/${userUid}`);
    const employeeSnap = await employeeRef.get();

    if (!employeeSnap.exists) {
      throw new Error("No se encontraron los datos del usuario");
    }

    const data = employeeSnap.data();
    if (!data) throw new Error("Documento del empleado está vacío");

    const departmentRef = data.department as DocumentReference | undefined;
    const roleRef = data.role as DocumentReference | undefined;
    const jobPositionRef = data.job_position as DocumentReference | undefined;

    if (!departmentRef || !roleRef || !jobPositionRef) {
      throw new Error(
        "Faltan referencias de departamento, rol o puesto de trabajo en el documento del empleado"
      );
    }

    const [departmentSnap, roleSnap, jobPositionSnap] = await Promise.all([
      departmentRef.get(),
      roleRef.get(),
      jobPositionRef.get(),
    ]);

    if (!departmentSnap.exists) {
      throw new Error("No se encontró el documento del departamento");
    }

    if (!roleSnap.exists) {
      throw new Error("No se encontró el documento del rol");
    }

    if (!jobPositionSnap.exists) {
      throw new Error("No se encontró el documento del puesto de trabajo");
    }

    const departmentData = departmentSnap.data();
    const roleData = roleSnap.data();
    const jobPositionData = jobPositionSnap.data();

    if (!departmentData || !roleData || !jobPositionData) {
      throw new Error("Los datos del departamento, del rol o del puesto de trabajo están vacíos");
    }

    return {
      uid: employeeSnap.id,
      ...data,
      department: { ...departmentData, uid: departmentSnap.id },
      role: { ...roleData, uid: roleSnap.id },
      job_position: { ...jobPositionData, uid: jobPositionSnap.id },
    } as FirebaseEmployee;
  } catch (error) {
    console.error("[getCurrentEmployee] Error al obtener empleado:", error);
    throw error;
  }
}
