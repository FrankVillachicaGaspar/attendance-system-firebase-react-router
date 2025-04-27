import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { adminFirestoreDb } from "@/lib/firebase.server";

export default async function getAttendancesByEmployee(
  employeeUid: string,
  date: Date
) {
  const employeeRef = adminFirestoreDb.collection("employee").doc(employeeUid);

  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  // Create a query for attendance records
  const attendanceCollectionRef = adminFirestoreDb
    .collection("attendance")
    .orderBy("created_at", "desc")
    .where("employee", "==", employeeRef)
    .where("created_at", ">=", startOfMonth)
    .where("created_at", "<=", endOfMonth);

  const attendanceList = await attendanceCollectionRef.get();

  const attendances = attendanceList.docs.map((doc) => {
    return {
      uid: doc.id,
      employee: {
        uid: doc.data().employee.uid,
        names: doc.data().employee.names,
        lastname: doc.data().employee.lastname,
        dni: doc.data().employee.dni,
        department: doc.data().employee.department,
        job_position: doc.data().employee.job_position,
      },
      observation_type: {
        uid: doc.data().observation_type.uid,
        name: doc.data().observation_type.name,
        description: doc.data().observation_type.description,
      },
      observation: doc.data().observation,
      first_check_in_time: doc.data().first_check_in_time,
      first_check_out_time: doc.data().first_check_out_time,
      second_check_in_time: doc.data().second_check_in_time,
      second_check_out_time: doc.data().second_check_out_time,
      work_hours: doc.data().work_hours,
      overtime: doc.data().overtime,
      created_at: doc.data().created_at,
      created_at_date: doc.data().created_at_date,
      deleted_at: doc.data().deleted_at,
    } as FirebaseAttendance;
  });

  return attendances;
}
