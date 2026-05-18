import Link from "next/link";

type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  pages: number;
  basePath?: string;
};

const pageSizeOptions = [5, 10, 20, 50];

function getPageHref(pageNum: number, pageSize: number, basePath: string) {
  const query = new URLSearchParams({
    pageNum: String(pageNum),
    pageSize: String(pageSize),
  });

  return `${basePath}?${query.toString()}`;
}

function getPageItems(current: number, pages: number) {
  const candidates = new Set([1, pages]);

  for (let page = current - 2; page <= current + 2; page += 1) {
    if (page >= 1 && page <= pages) {
      candidates.add(page);
    }
  }

  const sortedPages = Array.from(candidates).sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  });

  return items;
}

export default function Pagination({
  current,
  pageSize,
  total,
  pages,
  basePath = "/",
}: PaginationProps) {
  if (pages <= 1 && total <= pageSize) {
    return null;
  }

  const safeCurrent = Math.min(Math.max(current, 1), Math.max(pages, 1));
  const pageItems = getPageItems(safeCurrent, pages);
  const firstItem = total === 0 ? 0 : (safeCurrent - 1) * pageSize + 1;
  const lastItem = Math.min(safeCurrent * pageSize, total);

  return (
    <nav
      className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <div className="text-sm text-[var(--text-muted)]">
        第 {firstItem}-{lastItem} 篇，共 {total} 篇
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href={getPageHref(Math.max(safeCurrent - 1, 1), pageSize, basePath)}
            aria-disabled={safeCurrent === 1}
            className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            上一页
          </Link>
          {pageItems.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-[var(--text-muted)]"
                >
                  ...
                </span>
              );
            }

            const isCurrent = item === safeCurrent;

            return (
              <Link
                key={item}
                href={getPageHref(item, pageSize, basePath)}
                aria-current={isCurrent ? "page" : undefined}
                className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] aria-current:border-[var(--accent)] aria-current:bg-[var(--accent)] aria-current:text-white"
              >
                {item}
              </Link>
            );
          })}
          <Link
            href={getPageHref(Math.min(safeCurrent + 1, pages), pageSize, basePath)}
            aria-disabled={safeCurrent === pages}
            className="rounded-md border border-[var(--border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            下一页
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>每页</span>
          {pageSizeOptions.map((option) => (
            <Link
              key={option}
              href={getPageHref(1, option, basePath)}
              aria-current={option === pageSize ? "true" : undefined}
              className="rounded-md px-2 py-1 text-[var(--text-soft)] transition-colors hover:bg-[var(--surface-muted)] aria-current:bg-[var(--surface-muted)] aria-current:text-[var(--accent)]"
            >
              {option}
            </Link>
          ))}
          <span>篇</span>
        </div>
      </div>
    </nav>
  );
}
