interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  itemLabel = 'items',
  onPageChange,
}: PaginationProps) {
  // Don't show pagination if there are no items or if total items don't exceed page size
  if (totalCount === 0 || totalCount <= pageSize) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Left side - Showing text */}
      <p className="text-body-sm text-slate-medium">
        Showing {startItem}-{endItem} of {totalCount} {itemLabel}
      </p>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 flex items-center justify-center rounded text-body-sm font-medium text-slate-dark bg-white border border-slate-light/60 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page => {
            // Show first page, last page, current page, and pages around current
            return (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            );
          })
          .map((page, index, array) => {
            // Add ellipsis if there's a gap
            const prevPage = array[index - 1];
            const showEllipsis = prevPage && page - prevPage > 1;

            return (
              <div key={page} className="flex items-center gap-2">
                {showEllipsis && (
                  <span className="text-slate-medium text-body-sm">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] h-8 px-3 flex items-center justify-center rounded text-body-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-dark bg-white border border-slate-light/60 hover:bg-slate-50'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              </div>
            );
          })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 flex items-center justify-center rounded text-body-sm font-medium text-slate-dark bg-white border border-slate-light/60 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
