import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function logicDeleteJobPositionByUid(uid: string) {
  const jobPositionCollectionRef = adminFirestoreDb.collection("job-position");
  const jobPositionRef = jobPositionCollectionRef.doc(uid);
  await jobPositionRef.update({
    deleted_at: Timestamp.now(),
  });
}
