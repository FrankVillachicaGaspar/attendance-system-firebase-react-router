import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function createObservationType(
  observationType: Partial<FirebaseObservationType>
) {
  try {
    const collectionRef = adminFirestoreDb.collection("observation-type");
    await collectionRef.add({
      name: observationType.name,
      description: observationType.description,
      created_at: Timestamp.now(),
      deleted_at: null,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
