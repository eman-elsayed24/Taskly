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
  if (totalCount === 0) return null;

  return (
    <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6">
      <p className="text-body-sm text-slate-medium">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)}-
        {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
        {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded text-slate-medium bg-white border border-slate-light hover:bg-surface-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          ‹
        </button>
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
                  <span className="text-slate-medium px-2">...</span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-slate-medium bg-white border border-slate-light hover:bg-surface-highest'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              </div>
            );
          })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded text-slate-medium bg-white border border-slate-light hover:bg-surface-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}
