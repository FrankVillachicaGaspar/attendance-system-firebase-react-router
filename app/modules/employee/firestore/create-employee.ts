import { adminAuth, adminFirestoreDb } from "@/lib/firebase.server";
import type { EmployeeFormType } from "../schema/employee-form.schema";
import { Timestamp } from "firebase-admin/firestore";

export async function createEmployee(employee: EmployeeFormType) {
  // Paso 1: Registrar al usuario en Firebase Authentication
  try {
    // Crear el usuario con el email y contraseña (dni en este caso)
    const userCredential = await adminAuth.createUser({
      email: employee.email,
      password: employee.dni,
    });

    // Paso 2: Obtener las referencias de departamento y rol
    const departmentSnap = await adminFirestoreDb
      .doc(`department/${employee.department}`)
      .get();

    const roleSnap = await adminFirestoreDb.doc(`role/${employee.role}`).get();

    const jobPositionSnap = await adminFirestoreDb
      .doc(`job-position/${employee.job_position}`)
      .get();

    if (!departmentSnap.exists || !roleSnap.exists || !jobPositionSnap.exists) {
      throw new Error(
        "El departamento, el rol o el puesto de trabajo no existen."
      );
    }

    // Paso 3: Crear el documento del employee en Firestore
    const employeeDoc = {
      email: employee.email,
      names: employee.names,
      lastname: employee.lastname,
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
      deleted_at: null, // Se puede manejar un campo de eliminación si es necesario
      created_at: Timestamp.fromMillis(Date.now()),
    };

    // Paso 4: Crear el documento del empleado con el uid del usuario recién creado
    await adminFirestoreDb
      .doc(`employee/${userCredential.uid}`)
      .set(employeeDoc);
  } catch (error) {
    console.error(
      "Error al registrar el usuario y crear el documento: ",
      error
    );
  }
  return null;
}
