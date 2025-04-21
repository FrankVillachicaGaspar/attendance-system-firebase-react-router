import type { FirebaseDepartment } from "@/common/types/firebase/FirebaseDepartment.type";
import type { PaginationResponse } from "@/common/types/pagination-response.type";
import { getPaginationMetadata } from "@/common/utils/pagination.utils";
import { adminFirestoreDb } from "@/lib/firebase.server";
import { format } from "date-fns";

export default async function findAllDepartmentWithPagination({
  limit,
  page,
  skip,
}: {
  limit: number;
  page: number;
  skip: number;
}) {
  let departmentList: FirebaseDepartment[] = [];

  const departmentCollectionRef = adminFirestoreDb
    .collection("department")
    .where("deleted_at", "==", null);

  const departmentListRef = departmentCollectionRef
    .orderBy("created_at", "desc")
    .limit(limit)
    .offset(skip);

  const departmentListSnap = await departmentListRef.get();

  if (!departmentListSnap.empty) {
    departmentList = departmentListSnap.docs.map((doc) => {
      return {
        uid: doc.id,
        ...doc.data(),
        created_at: format(doc.data().created_at.toDate(), "dd/MM/yyyy HH:mm"),
      } as FirebaseDepartment;
    });
  }

  const { totalItems, totalPages, nextPage, prevPage } =
    await getPaginationMetadata(departmentCollectionRef, page, limit);

  return {
    data: departmentList,
    page,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  } as PaginationResponse<FirebaseDepartment[]>;
}
