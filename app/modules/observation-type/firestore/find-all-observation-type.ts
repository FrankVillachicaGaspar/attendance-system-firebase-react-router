import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllObservationType() {
  const observationTypeCollectionRef =
    adminFirestoreDb.collection("observation-type");
  const observationTypeListRef = observationTypeCollectionRef.where(
    "deleted_at",
    "==",
    null
  );
  const observationTypeListSnap = await observationTypeListRef.get();
  const observationTypeList = observationTypeListSnap.docs.map((doc) => {
    return {
      uid: doc.id,
      ...doc.data(),
      created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
    } as FirebaseObservationType;
  });
  return observationTypeList;
}
