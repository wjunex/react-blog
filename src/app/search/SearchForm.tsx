"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/Icons";

type Props = {
  initialKeyword?: string;
  categoryId?: string;
  tagId?: string;
  pageSize: number;
};

export default function SearchForm({ initialKeyword = "", categoryId = "", tagId = "", pageSize }: Props) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(() => {
    const trimmed = keyword.trim();
    if (!trimmed && !categoryId && !tagId) return;
    const params = new URLSearchParams({ pageSize: String(pageSize) });
    if (trimmed) params.set("keyword", trimmed);
    if (categoryId) params.set("categoryId", categoryId);
    if (tagId) params.set("tagId", tagId);
    router.push(`/search?${params.toString()}`);
  }, [keyword, categoryId, tagId, pageSize, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") doSearch();
    },
    [doSearch],
  );

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入关键词..."
          className="w-full rounded-lg border border-(--border-strong) bg-(--surface) py-2.5 pl-10 pr-4 text-sm text-(--text) outline-none transition-colors placeholder:text-(--text-muted) focus:border-(--accent) focus:shadow-[0_0_0_2px_rgba(9,105,218,0.15)]"
          autoFocus
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)">
          <SearchIcon />
        </span>
      </div>
      <button
        type="button"
        onClick={doSearch}
        disabled={!keyword.trim() && !categoryId && !tagId}
        className="rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50"
      >
        搜索
      </button>
    </div>
  );
}
