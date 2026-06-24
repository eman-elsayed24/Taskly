import ArrowIcon from '../../../assets/icons/arrow.svg?react';

interface TasksPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function TasksPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
}: TasksPaginationProps) {
  // Don't show pagination if there are no items or only one page
  if (totalCount === 0 || totalPages <= 1) return null;

  
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white border-t border-slate-light/20">
      
      <p className="text-body-sm text-slate-medium">
        Showing {endItem} of {totalCount} tasks
      </p>

      
      <div className="flex items-center gap-4">
    
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-slate-medium hover:text-slate-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-medium"
          aria-label="Previous page"
        >
          <ArrowIcon className="w-2 h-3" />
        </button>

    
        <span className="text-body-sm text-slate-dark font-medium">
          Page {currentPage} of {totalPages}
        </span>

     
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-slate-medium hover:text-slate-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-medium rotate-180"
          aria-label="Next page"
        >
          <ArrowIcon className="w-2 h-3" />
        </button>
      </div>
    </div>
  );
}
