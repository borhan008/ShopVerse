import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { useMemo } from "react";

export default function PaginationGeneric({
  total,
  skip,
  setSkip,
  perPage = 5,
}: {
  total: number;
  skip: number;
  setSkip: (skip: number) => void;

  perPage?: number;
}) {
  const maxPages = useMemo(() => {
    return Math.ceil(total / perPage);
  }, [total, perPage]);

  return (
    <div className="mx-auto w-full mt-8">
      {total > perPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                onClick={() => setSkip(Math.max(0, skip - 1))}
                disabled={skip === 0}
                variant="ghost"
              >
                <PaginationPrevious href="#" />
              </Button>
            </PaginationItem>
            {maxPages <= 5 ? (
              Array.from({ length: maxPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <Button
                    onClick={() => setSkip(index)}
                    disabled={skip === index}
                    variant="ghost"
                  >
                    <PaginationLink>{index + 1}</PaginationLink>
                  </Button>
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem>
                  <Button
                    onClick={() => {
                      setSkip(0);
                      console.log(skip);
                    }}
                    disabled={skip === 0}
                    variant="ghost"
                  >
                    <PaginationLink href="#">1</PaginationLink>
                  </Button>
                </PaginationItem>

                {skip - 1 > 0 && (
                  <>
                    {skip - 1 > 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <Button
                        onClick={() => setSkip(skip - 1)}
                        disabled={skip === skip - 1}
                        variant="ghost"
                      >
                        <PaginationLink>{skip}</PaginationLink>
                      </Button>
                    </PaginationItem>
                  </>
                )}

                {skip > 0 && skip < maxPages - 1 && (
                  <PaginationItem>
                    <Button
                      onClick={() => setSkip(skip)}
                      disabled={true}
                      variant="ghost"
                    >
                      <PaginationLink>{skip + 1}</PaginationLink>
                    </Button>
                  </PaginationItem>
                )}

                {skip + 1 < maxPages - 1 && (
                  <>
                    <PaginationItem>
                      <Button
                        onClick={() => setSkip(skip + 1)}
                        disabled={skip === skip + 1}
                        variant="ghost"
                      >
                        <PaginationLink>{skip + 2}</PaginationLink>
                      </Button>
                    </PaginationItem>
                    {skip + 1 < maxPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                <PaginationItem>
                  <Button
                    onClick={() => setSkip(maxPages - 1)}
                    disabled={skip === maxPages - 1}
                    variant="ghost"
                  >
                    <PaginationLink>{maxPages}</PaginationLink>
                  </Button>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <Button
                onClick={() =>
                  setSkip(Math.min((total + perPage + 1) / perPage, skip + 1))
                }
                disabled={skip * perPage + perPage >= total}
                variant="ghost"
              >
                <PaginationNext href="#" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
