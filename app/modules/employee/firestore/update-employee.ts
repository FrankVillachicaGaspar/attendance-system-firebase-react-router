import type { EmployeeFormType } from "../schema/employee-form.schema";

import { adminFirestoreDb } from "@/lib/firebase.server";

export async function updateEmployee(uid: string, employee: EmployeeFormType) {
  // Paso 1: Obtener las referencias de departamento y rol

  try {
    // Paso 2: Verificar que los documentos de departamento y rol existen
    const departmentSnap = await adminFirestoreDb
      .doc(`department/${employee.department}`)
      .get();

    const roleSnap = await adminFirestoreDb.doc(`role/${employee.role}`).get();
    const jobPositionSnap = await adminFirestoreDb
      .doc(`job_position/${employee.job_position}`)
      .get();

    if (!departmentSnap.exists || !roleSnap.exists || !jobPositionSnap.exists) {
      throw new Error(
        "El departamento, el rol o el puesto de trabajo no existen."
      );
    }

    // Paso 3: Crear el objeto de actualización para el empleado
    const employeeDoc = {
      email: employee.email,
      names: employee.names.toLowerCase(),
      lastname: employee.lastname.toLowerCase(),
      dni: employee.dni,
      birth_date: employee.birth_date,
      hiring_date: employee.hiring_date,
      phone_code: employee.phone_code,
      phone_number: employee.phone_number,
      job_position: jobPositionSnap.ref, // Referencia al puesto de trabajo
      salary: employee.salary,
      department: departmentSnap.ref, // Referencia al departamento
      role: roleSnap.ref, // Referencia al rol
      is_active: employee.is_active,
    };

    // Paso 4: Actualizar el documento del empleado en Firestore
    const employeeRef = adminFirestoreDb.collection("employee").doc(uid);
    await employeeRef.update(employeeDoc);
  } catch (error) {
    console.error("Error al actualizar el empleado:", error);
    return null;
  }
}
