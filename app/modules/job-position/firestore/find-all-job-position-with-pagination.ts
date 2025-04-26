import type { FirebaseJobPosition } from "@/common/types/firebase/FirebaseJobPosition";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { getPaginationMetadata } from "@/common/utils/pagination.utils";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllJobPositionWithPagination({
  limit,
  page,
  skip,
}: {
  limit: number;
  page: number;
  skip: number;
}) {
  let jobPositionList: FirebaseJobPosition[] = [];

  const jobPositionCollectionRef = adminFirestoreDb
    .collection("job_position")
    .where("deleted_at", "==", null);

  const jobPositionListRef = jobPositionCollectionRef
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(skip);

  const jobPositionListSnap = await jobPositionListRef.get();

  if (!jobPositionListSnap.empty) {
    jobPositionList = jobPositionListSnap.docs.map((doc) => {
      return {
        uid: doc.id,
        ...doc.data(),
        created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
      } as FirebaseJobPosition;
    });
  }

  const { totalItems, totalPages, nextPage, prevPage } =
    await getPaginationMetadata(jobPositionCollectionRef, page, limit);

  return {
    data: jobPositionList,
    page,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  } as PaginationResponse<FirebaseJobPosition[]>;
}
