import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import clsx from 'clsx';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={clsx('flex items-center justify-center gap-2', className)}>
      <Button
        variant="secondary"
        size="sm"
        icon={ChevronLeft}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-neutral-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                currentPage === page
                  ? 'bg-accent-cyan text-primary-dark'
                  : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
              )}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        icon={ChevronRight}
        iconPosition="right"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

export default Pagination;