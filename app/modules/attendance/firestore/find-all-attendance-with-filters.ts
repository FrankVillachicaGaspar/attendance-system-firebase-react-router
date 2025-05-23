import type { FirebaseAttendance } from "@/common/types/firebase/FirebaseAttendance";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { endOfDay, format, parseISO, startOfDay } from "date-fns";
import {
  Timestamp,
  type DocumentReference,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export interface FindaAllAttendanceFilters {
  dni: string | null;
  date: string | null;
  department: string | null;
}

export default async function findAllAttendanceWithFilters(
  filters: FindaAllAttendanceFilters
) {
  let attendanceList: FirebaseAttendance[] = [];
  const attendanceCollectionRef = adminFirestoreDb.collection("attendance");

  let attendanceListRef = attendanceCollectionRef.where(
    "deleted_at",
    "==",
    null
  );

  if (filters.date) {
    attendanceListRef = attendanceListRef.where(
      "created_at_date",
      "==",
      filters.date
    );
  }

  if (filters.department && filters.department.trim() !== "") {
    const departmentRef = adminFirestoreDb
      .collection("department")
      .doc(filters.department);

    const employeesQuerySnapshot = await adminFirestoreDb
      .collection("employee")
      .where("department", "==", departmentRef) // Filtra por la referencia al departamento
      .get();

    const employeeRefs = employeesQuerySnapshot.docs.map((doc) =>
      adminFirestoreDb.collection("employee").doc(doc.id)
    );

    if (employeeRefs.length) {
      attendanceListRef = attendanceListRef.where(
        "employee",
        "in",
        employeeRefs
      );
    } else {
      attendanceListRef = attendanceListRef.where(
        "employee",
        "==",
        "non-existent-id"
      );
    }
  }

  if (filters.dni && filters.dni.trim() !== "") {
    console.log(filters.dni);
    const employeesQuerySnapshot = await adminFirestoreDb
      .collection("employee")
      .where("dni", "==", filters.dni)
      .get();

    const employeeRefs = employeesQuerySnapshot.docs.map((doc) =>
      adminFirestoreDb.collection("employee").doc(doc.id)
    );

    if (employeeRefs.length) {
      attendanceListRef = attendanceListRef.where(
        "employee",
        "in",
        employeeRefs
      );
    } else {
      attendanceListRef = attendanceListRef.where(
        "employee",
        "==",
        "non-existent-id"
      );
    }
  }

  const attendanceListSnap = await attendanceListRef.get();

  attendanceList = await Promise.all(
    attendanceListSnap.docs.map(async (doc) => await getAttendance(doc))
  );

  return attendanceList;
}

async function getAttendance(doc: QueryDocumentSnapshot<any>) {
  const observationTypeRef: DocumentReference = doc.data().observation_type;
  const observationTypeSnap = await observationTypeRef?.get();

  const employeeRef: DocumentReference = doc.data().employee;
  const employeeSnap = await employeeRef.get();

  const departmentRef: DocumentReference = employeeSnap.data()?.department;
  const departmentSnap = await departmentRef.get();

  const jobPositionRef: DocumentReference = employeeSnap.data()?.job_position;
  const jobPositionSnap = await jobPositionRef.get();

  if (!employeeSnap.exists || !departmentSnap.exists) {
    throw new Error("Error al obtener las asistencias");
  }

  return {
    uid: doc.id,
    observation_type: observationTypeSnap
      ? {
          uid: observationTypeSnap.id,
          name: observationTypeSnap.data()!.name,
          description: observationTypeSnap.data()!.description,
        }
      : null,
    employee: {
      uid: employeeSnap.id,
      names: employeeSnap.data()!.names,
      lastname: employeeSnap.data()!.lastname,
      dni: employeeSnap.data()!.dni,
      department: {
        uid: departmentSnap.id,
        name: departmentSnap.data()!.name,
        description: departmentSnap.data()!.description,
      },
      job_position: {
        uid: jobPositionSnap.id,
        name: jobPositionSnap.data()!.name,
        description: jobPositionSnap.data()!.description,
      },
    },
    first_check_in_time: doc.data().first_check_in_time,
    first_check_out_time: doc.data().first_check_out_time,
    second_check_in_time: doc.data().second_check_in_time,
    second_check_out_time: doc.data().second_check_out_time,
    work_hours: doc.data().work_hours,
    overtime: doc.data().overtime,
    observation: doc.data().observation,
    created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
    created_at_date: doc.data().created_at_date,
    deleted_at: doc.data().deleted_at,
  } as FirebaseAttendance;
}
