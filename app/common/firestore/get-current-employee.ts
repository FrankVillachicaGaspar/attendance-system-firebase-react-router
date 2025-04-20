import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import { adminFirestoreDb } from "@/lib/firebase.server";
import type { DocumentReference } from "firebase-admin/firestore";

/**
 * Función que devuelve el empleado que coincide con el parámetro userUid
 * @param userUid El UID del usuario que se quiere obtener el empleado
 * @returns Un objeto de tipo FirebaseEmployee que contiene la información del empleado
 */
export async function getCurrentEmployee(
  userUid: string
): Promise<FirebaseEmployee> {
  const empolyeeRef = adminFirestoreDb.doc(`employee/${userUid}`);

  const employeeSnap = await empolyeeRef.get();

  if (!employeeSnap.exists)
    throw new Error("No se encontraron los datos del usuario");

  const data = employeeSnap.data();

  const departmentRef = data!.department as DocumentReference;
  const roleRef = data!.role as DocumentReference;

  const [departmentSnap, roleSnap] = await Promise.all([
    departmentRef.get(),
    roleRef.get(),
  ]);

  if (!departmentSnap.exists) {
    throw new Error("No encontró el departamento en el documento de empleados");
  }
  if (!roleSnap.exists) {
    throw new Error("No encontró el rol en el documento de empleados");
  }

  const departmentData = departmentSnap.data()!;
  const roleData = roleSnap.data()!;
  const employeeData = data;

  return {
    uid: employeeSnap.id,
    ...employeeData,
    department: { ...departmentData, uid: departmentSnap.id },
    role: { ...roleData, uid: roleSnap.id },
  } as FirebaseEmployee;
}
