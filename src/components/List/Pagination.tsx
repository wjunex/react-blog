import Link from "next/link";

type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  pages: number;
};

const pageSizeOptions = [5, 10, 20, 50];

function getPageHref(pageNum: number, pageSize: number) {
  const query = new URLSearchParams({
    pageNum: String(pageNum),
    pageSize: String(pageSize),
  });

  return `/?${query.toString()}`;
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
      className="flex flex-col gap-4 border-t border-[#d8dee4] pt-6 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Pagination"
    >
      <div className="text-sm text-[#656d76]">
        第 {firstItem}-{lastItem} 篇，共 {total} 篇
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="flex flex-wrap items-center gap-1">
          <Link
            href={getPageHref(Math.max(safeCurrent - 1, 1), pageSize)}
            aria-disabled={safeCurrent === 1}
            className="rounded-md border border-[#d0d7de] px-3 py-1.5 text-sm font-medium text-[#57606a] transition-colors hover:bg-[#f6f8fa] aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            上一页
          </Link>
          {pageItems.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-[#656d76]">
                  ...
                </span>
              );
            }

            const isCurrent = item === safeCurrent;

            return (
              <Link
                key={item}
                href={getPageHref(item, pageSize)}
                aria-current={isCurrent ? "page" : undefined}
                className="rounded-md border border-[#d0d7de] px-3 py-1.5 text-sm font-medium text-[#57606a] transition-colors hover:bg-[#f6f8fa] aria-current:border-[#0969da] aria-current:bg-[#0969da] aria-current:text-white"
              >
                {item}
              </Link>
            );
          })}
          <Link
            href={getPageHref(Math.min(safeCurrent + 1, pages), pageSize)}
            aria-disabled={safeCurrent === pages}
            className="rounded-md border border-[#d0d7de] px-3 py-1.5 text-sm font-medium text-[#57606a] transition-colors hover:bg-[#f6f8fa] aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            下一页
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#656d76]">
          <span>每页</span>
          {pageSizeOptions.map((option) => (
            <Link
              key={option}
              href={getPageHref(1, option)}
              aria-current={option === pageSize ? "true" : undefined}
              className="rounded-md px-2 py-1 text-[#57606a] transition-colors hover:bg-[#f6f8fa] aria-current:bg-[#f6f8fa] aria-current:text-[#0969da]"
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
