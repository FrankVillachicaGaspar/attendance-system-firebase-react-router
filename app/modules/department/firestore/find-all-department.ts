import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllDepartment() {
  const departmentCollectionRef = adminFirestoreDb.collection("department");
  const departmentListRef = departmentCollectionRef.where(
    "deleted_at",
    "==",
    null
  );
  const departmentListSnap = await departmentListRef.get();
  const departmentList = departmentListSnap.docs.map(
    (doc) =>
      ({
        uid: doc.id,
        ...doc.data(),
        created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
      } as FirebaseDepartment)
  );
  return departmentList;
}
