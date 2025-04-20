import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function createDepartment(
  department: Partial<FirebaseDepartment>
) {
  try {
    const collectionRef = adminFirestoreDb.collection("department");
    await collectionRef.add({
      name: department.name,
      description: department.description,
      created_at: Timestamp.now(),
      deleted_at: null,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
