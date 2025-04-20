import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function logicDeleteObservationTypeByUid(uid: string) {
  const observationTypeCollectionRef = adminFirestoreDb.collection("observation-type");
  const observationTypeRef = observationTypeCollectionRef.doc(uid);
  await observationTypeRef.update({
    deleted_at: Timestamp.now(),
  });
}
