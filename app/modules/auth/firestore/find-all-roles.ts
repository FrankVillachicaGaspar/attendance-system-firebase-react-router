import type { FirebaseRole } from "@/common/types/firebase/FirebaseRole.type";
import { adminFirestoreDb } from "@/lib/firebase.server";
import _ from "lodash";

export default async function findAllRoles() {
  const rolesCollectionRef = adminFirestoreDb.collection("role");

  const rolesList = await rolesCollectionRef.get();

  return rolesList.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        uid: doc.id,
        name: _.capitalize(doc.data().name),
      } as FirebaseRole)
  );
}
