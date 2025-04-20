export function getPaginationSearchParams(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function getPaginationMetadata(
  documentRef: FirebaseFirestore.Query<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  >,
  page: number,
  limit: number
) {
  const totalItems = (await documentRef.count().get()).data().count;
  const totalPages = Math.ceil(totalItems / limit);
  const nextPage = page + 1;
  const prevPage = page - 1;

  return {
    totalPages,
    totalItems,
    nextPage: nextPage <= totalPages ? nextPage : null,
    prevPage: prevPage > 0 ? prevPage : null,
  };
}
