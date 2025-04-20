import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import { adminFirestoreDb } from "@/lib/firebase.server";

export default async function updateJobPosition(jobPosition: Partial<FirebaseJobPosition>) {
  const jobPositionCollectionRef = adminFirestoreDb.collection("job-position");

  const jobPositionRef = jobPositionCollectionRef.doc(jobPosition.uid!);

  await jobPositionRef.update({
    name: jobPosition.name,
    description: jobPosition.description,
  });
}
