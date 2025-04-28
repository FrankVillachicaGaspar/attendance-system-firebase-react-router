import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { adminFirestoreDb } from "@/lib/firebase.server";
import type { DocumentReference } from "firebase-admin/firestore";

export default async function findAttendanceByEmployeeAndRangeDate(
  employeeUid: string,
  rangeDate: {
    from: string;
    to: string;
  }
) {
  console.log("findAttendanceByEmployeeAndRangeDate", employeeUid, rangeDate);
  const employeeRef = adminFirestoreDb.collection("employee").doc(employeeUid);
  const employeeSnap = await employeeRef.get();

  const departmentRef = employeeSnap.data()?.department;
  const departmentSnap = await departmentRef.get();

  const jobPositionRef = employeeSnap.data()?.job_position;
  const jobPositionSnap = await jobPositionRef.get();

  // Obtenemos los registros del empleado que no estén eliminados
  // y los ordenamos por created_at_date de menor a mayor
  const attendanceListRef = adminFirestoreDb
    .collection("attendance")
    .where("employee", "==", employeeRef)
    .where("deleted_at", "==", null)
    .orderBy("created_at_date", "asc"); // Ordenar de más antiguo a más reciente

  const attendanceListSnap = await attendanceListRef.get();

  // Procesamos los documentos y los mapeamos al tipo FirebaseAttendance
  let filteredAttendances = await Promise.all(
    attendanceListSnap.docs.map(async (doc) => {
      const data = doc.data();
      const observationTypeRef: DocumentReference | null =
        data.observation_type;
      const observationTypeSnap = observationTypeRef
        ? await observationTypeRef.get()
        : null;
      return {
        uid: doc.id,
        ...data,
        employee: {
          uid: employeeSnap.id,
          names: employeeSnap.data()?.names,
          lastname: employeeSnap.data()?.lastname,
          dni: employeeSnap.data()?.dni,
          department: {
            uid: departmentSnap.id,
            name: departmentSnap.data()?.name,
            description: departmentSnap.data()?.description,
          },
          job_position: {
            uid: jobPositionSnap.id,
            name: jobPositionSnap.data()?.name,
            description: jobPositionSnap.data()?.description,
          },
        },
        created_at_date: data.created_at_date,
        deleted_at: null,
        created_at: data.created_at.toDate(),
        first_check_in_time: data.first_check_in_time,
        first_check_out_time: data.first_check_out_time,
        second_check_in_time: data.second_check_in_time,
        second_check_out_time: data.second_check_out_time,
        observation_type: observationTypeSnap
          ? {
              uid: observationTypeSnap.id,
              name: observationTypeSnap.data()?.name,
              description: observationTypeSnap.data()?.description,
            }
          : null,
        observation: data.observation,
        work_hours: data.work_hours,
        overtime: data.overtime,
      } as FirebaseAttendance;
    })
  );

  // Filtramos adicionalmente por el rango de fechas
  filteredAttendances = filteredAttendances.filter((attendance) => {
    // Convertir los strings a objetos Date para comparación correcta
    const attendanceDate = new Date(attendance.created_at_date);
    const fromDate = new Date(rangeDate.from);
    const toDate = new Date(rangeDate.to);

    // Normalizar las fechas (eliminar la parte de tiempo)
    attendanceDate.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    // Verificar si la fecha está dentro del rango (inclusivo)
    return attendanceDate >= fromDate && attendanceDate <= toDate;
  });

  return filteredAttendances;
}