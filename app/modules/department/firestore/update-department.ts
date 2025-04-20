import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { adminFirestoreDb } from "@/lib/firebase.server";

export default async function updateDepartment(department: Partial<FirebaseDepartment>) {
  const departmentCollectionRef = adminFirestoreDb.collection("department");

  const departmentRef = departmentCollectionRef.doc(department.uid!);

  await departmentRef.update({
    name: department.name,
    description: department.description,
  });
}
