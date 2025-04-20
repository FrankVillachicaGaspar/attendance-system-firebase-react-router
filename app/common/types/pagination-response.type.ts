export type PaginationResponse<T> = {
  data: T;
  page: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
};
