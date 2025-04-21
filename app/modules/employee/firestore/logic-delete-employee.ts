import { Timestamp } from "firebase-admin/firestore";
import { adminFirestoreDb } from "@/lib/firebase.server";

export async function logicDeleteEmployee(uid: string) {
  try {
    // Paso 2: Actualizar solo el campo `is_deleted` con la fecha actual
    const employeeRef = adminFirestoreDb.collection("employee").doc(uid);

    await employeeRef.update({
      deleted_at: Timestamp.fromMillis(Date.now()), // Marcar como eliminado con la fecha actual
    });
  } catch (error) {
    console.error(
      "Error al actualizar el campo is_deleted del empleado:",
      error
    );
  }
}
