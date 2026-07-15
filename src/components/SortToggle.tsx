"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SortToggle() {
  const searchParams = useSearchParams();
  const current = searchParams.get("sort");
  const isHot = current === "hot";

  const getHref = (sort: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    params.delete("pageNum");
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="inline-flex rounded-lg border border-(--border) p-0.5">
      <Link
        href={getHref(null)}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
          !isHot
            ? "bg-(--accent) text-white"
            : "text-(--text-soft) hover:text-(--text)"
        }`}
      >
        最新
      </Link>
      <Link
        href={getHref("hot")}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
          isHot
            ? "bg-(--accent) text-white"
            : "text-(--text-soft) hover:text-(--text)"
        }`}
      >
        最热
      </Link>
    </div>
  );
}
