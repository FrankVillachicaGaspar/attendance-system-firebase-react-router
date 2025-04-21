import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { getPaginationMetadata } from "@/common/utils/pagination.utils";
import { adminFirestoreDb } from "@/lib/firebase.server";
import type {
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";

export default async function findAllEmployeeWithPaginationAndFilters({
  limit,
  skip,
  page,
}: {
  limit: number;
  skip: number;
  page: number;
}): Promise<PaginationResponse<FirebaseEmployee[]>> {
  const employeeCollectionRef = adminFirestoreDb
    .collection("employee")
    .where("deleted_at", "==", null);

  const employeeListRef = employeeCollectionRef
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(skip);

  const employeeListSnap = await employeeListRef.get();

  const employees = await Promise.all(
    employeeListSnap.docs.map(async (doc) => {
      if (doc.exists) {
        return await getEmployeeData(doc);
      }
      return null;
    })
  );

  const { totalItems, totalPages, nextPage, prevPage } =
    await getPaginationMetadata(employeeCollectionRef, page, limit);

  return {
    data: employees.filter((employee) => employee !== null),
    page,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  } as PaginationResponse<FirebaseEmployee[]>;
}

async function getEmployeeData(doc: QueryDocumentSnapshot<any>) {
  const roleRef: DocumentReference = doc.data().role;
  const jobPositionRef: DocumentReference = doc.data().job_position;
  const departmentRef: DocumentReference = doc.data().department;

  const roleSnap = await roleRef.get();
  const jobPositionSnap = await jobPositionRef.get();
  const departmentSnap = await departmentRef.get();

  if (!roleSnap.exists || !jobPositionSnap.exists || !departmentSnap.exists) {
    throw new Error("Error al obtener los datos del empleado");
  }

  return {
    ...doc.data(),
    uid: doc.id,
    role: {
      uid: roleSnap.id,
      ...roleSnap.data(),
    },
    job_position: {
      uid: jobPositionSnap.id,
      ...jobPositionSnap.data(),
    },
    department: {
      uid: departmentSnap.id,
      ...departmentSnap.data(),
    },
  } as FirebaseEmployee;
}
