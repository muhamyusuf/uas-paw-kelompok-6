import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Reusable pagination component
 */
export function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, current page, and pages around current
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push({ type: "page", value: i });
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push({ type: "ellipsis", value: i });
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      <div className="flex gap-1">
        {pageNumbers.map((item, index) => {
          if (item.type === "ellipsis") {
            return (
              <span key={`ellipsis-${index}`} className="text-muted-foreground px-2">
                ...
              </span>
            );
          }
          return (
            <Button
              key={item.value}
              variant={currentPage === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(item.value)}
              className="min-w-10"
            >
              {item.value}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/**
 * Pagination info text
 */
export function PaginationInfo({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  itemName = "items",
  className = "",
}) {
  return (
    <div
      className={cn("text-muted-foreground flex items-center justify-between text-sm", className)}
    >
      <p>
        Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} {itemName}
      </p>
      {totalPages > 1 && (
        <p>
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
}

PaginationInfo.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemName: PropTypes.string,
  className: PropTypes.string,
};
