import type { FirebaseObservationType } from "@/common/types/firebase/FirebaseObservationType";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { getPaginationMetadata } from "@/common/utils/pagination.utils";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllObservationTypeWithPagination({
  limit,
  page,
  skip,
}: {
  limit: number;
  page: number;
  skip: number;
}) {
  let observationTypeList: FirebaseObservationType[] = [];

  const observationTypeCollectionRef = adminFirestoreDb
    .collection("observation-type")
    .where("deleted_at", "==", null);

  const observationTypeListRef = observationTypeCollectionRef
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(skip);

  const observationTypeListSnap = await observationTypeListRef.get();

  if (!observationTypeListSnap.empty) {
    observationTypeList = observationTypeListSnap.docs.map((doc) => {
      return {
        uid: doc.id,
        ...doc.data(),
        created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
      } as FirebaseObservationType;
    });
  }

  const { totalItems, totalPages, nextPage, prevPage } =
    await getPaginationMetadata(observationTypeCollectionRef, page, limit);

  return {
    data: observationTypeList,
    page,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  } as PaginationResponse<FirebaseObservationType[]>;
}
