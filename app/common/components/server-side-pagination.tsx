import { Button } from "@/components/ui/button";
import { usePagination } from "@mantine/hooks";
import { useNavigate, useNavigation } from "react-router";
import type { PaginationResponse } from "../types/pagination-response.type";

interface Props<T> {
  paginationMetadata: PaginationResponse<T[]>;
}

export default function ServerSidePagination<T>({
  paginationMetadata,
}: Props<T>) {
  const navigate = useNavigate();
  const pagination = usePagination({
    total: paginationMetadata.totalPages,
    initialPage: paginationMetadata.page,
  });

  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page.toString());
    console.log(searchParams.toString());
    navigate(`?${searchParams.toString()}`);
    pagination.setPage(page);
  };

  return (
    <>
      {paginationMetadata.data.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={paginationMetadata.prevPage === null}
            >
              <span>{"<<"}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(paginationMetadata.prevPage!)}
              disabled={paginationMetadata.prevPage === null}
            >
              <span>{"<"}</span>
            </Button>

            {Array.from({ length: pagination.range.length }).map((_, index) => (
              <Button
                key={index}
                variant={
                  pagination.active === index + 1 ? "default" : "outline"
                }
                size="icon"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(paginationMetadata.nextPage!)}
              disabled={paginationMetadata.nextPage === null}
            >
              <span>{">"}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(paginationMetadata.totalPages)}
              disabled={paginationMetadata.nextPage === null}
            >
              <span>{">>"}</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
