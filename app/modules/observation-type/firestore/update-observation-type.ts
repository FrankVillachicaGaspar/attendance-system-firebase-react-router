import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import { adminFirestoreDb } from "@/lib/firebase.server";

export default async function updateObservationType(observationType: Partial<FirebaseObservationType>) {
  const observationTypeCollectionRef = adminFirestoreDb.collection("observation-type");

  const observationTypeRef = observationTypeCollectionRef.doc(observationType.uid!);

  await observationTypeRef.update({
    name: observationType.name,
    description: observationType.description,
  });
}
