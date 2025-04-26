import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllJobPosition() {
  const jobPositionCollectionRef = adminFirestoreDb.collection("job_position");
  const jobPositionListRef = jobPositionCollectionRef.where(
    "deleted_at",
    "==",
    null
  );
  const jobPositionListSnap = await jobPositionListRef.get();
  const jobPositionList = jobPositionListSnap.docs.map((doc) => {
    return {
      uid: doc.id,
      ...doc.data(),
      created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
    } as FirebaseJobPosition;
  });
  return jobPositionList;
}
