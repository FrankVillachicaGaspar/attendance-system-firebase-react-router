import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { Timestamp } from "firebase-admin/firestore";

export default async function createJobPosition(
  jobPosition: Partial<FirebaseJobPosition>
) {
  try {
    const collectionRef = adminFirestoreDb.collection("job-position");
    await collectionRef.add({
      name: jobPosition.name,
      description: jobPosition.description,
      created_at: Timestamp.now(),
      deleted_at: null,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
}
