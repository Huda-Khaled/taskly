import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createHref = (page: number) => {
    const params = new URLSearchParams();

    params.set('page', page.toString());

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.set(key, value);
      }
    });

    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-1">
      {currentPage > 1 ? (
        <Link
          href={createHref(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary"
        >
          ‹
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center text-slate-mid opacity-40">
          ‹
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Link
          key={pageNum}
          href={createHref(pageNum)}
          className={`flex h-8 w-8 items-center justify-center rounded text-body-md ${
            pageNum === currentPage
              ? 'bg-primary text-white'
              : 'text-slate-mid hover:bg-slate-100'
          }`}
        >
          {pageNum}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={createHref(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center text-slate-mid hover:text-primary"
        >
          ›
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center text-slate-mid opacity-40">
          ›
        </span>
      )}
    </div>
  );
}
