import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function logicDeleteDepartmentByUid(uid: string) {
  const departmentCollectionRef = adminFirestoreDb.collection("department");

  const departmentRef = departmentCollectionRef.doc(uid);

  await departmentRef.update({
    deleted_at: Timestamp.now(),
  });
}
