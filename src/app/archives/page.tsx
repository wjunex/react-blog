import type { Metadata } from "next";
import Link from "next/link";
import { apiPublicListByYear, apiPublicCategoryList, apiPublicTagList } from "@/api/generated";
import { formatDate } from "@/utils";
import type { NoteListVO } from "@/api/generated/models";

export const metadata: Metadata = { title: "归档" };

// ── helpers ──────────────────────────────────────────────
const CATEGORY_TYPES = [
  { key: "life", label: "生活" },
  { key: "tech", label: "技术" },
] as const;

// ── page ─────────────────────────────────────────────────
export default async function Archives() {
  const [archives, categoryList, tagList] = await Promise.all([
    apiPublicListByYear({}),
    apiPublicCategoryList(),
    apiPublicTagList(),
  ]);


  // series 分类：只展示分类名，不展示系列下的全部文章
  const seriesCounts = new Map<string, number>();
  for (const group of archives || []) {
    for (const note of group.notes || []) {
      if (note.categoryId) {
        seriesCounts.set(note.categoryId, (seriesCounts.get(note.categoryId) || 0) + 1);
      }
    }
  }

  const seriesIds = new Set(
    (categoryList || []).filter((c) => c.isSeries).map((c) => c.id ?? "")
  );
  const seriesCategories = (categoryList || []).filter((c) => c.isSeries);

  // 系列按分类创建时间归入对应年份
  const seriesByYear = new Map<number, typeof seriesCategories>();
  for (const cat of seriesCategories) {
    const year = cat.createdAt ? new Date(cat.createdAt).getFullYear() : 0;
    if (!year) continue;
    const list = seriesByYear.get(year) || [];
    list.push(cat);
    seriesByYear.set(year, list);
  }

  type TimelineEntry =
    | { kind: "article"; data: NoteListVO }
    | { kind: "series"; data: (typeof seriesCategories)[number] };

  const archivesList = (archives || [])
    .map((group) => {
      const articles: TimelineEntry[] = (group.notes || [])
        .filter((note) => !note.categoryId || !seriesIds.has(note.categoryId))
        .map((note) => ({ kind: "article" as const, data: note }));

      const seriesEntries: TimelineEntry[] =
        (seriesByYear.get(group.year ?? 0) || []).map((cat) => ({
          kind: "series" as const,
          data: cat,
        }));

      return {
        year: group.year ?? 0,
        entries: [...articles, ...seriesEntries].sort((a, b) => {
          const dateA =
            a.kind === "article"
              ? a.data.createdAt || ""
              : a.data.createdAt || "";
          const dateB =
            b.kind === "article"
              ? b.data.createdAt || ""
              : b.data.createdAt || "";
          return dateB.localeCompare(dateA);
        }),
      };
    })
    .filter((g) => g.entries.length > 0)
    .sort((a, b) => b.year - a.year);

  // 补充没有文章的年份中的系列
  for (const [year, entries] of seriesByYear) {
    if (!archivesList.find((g) => g.year === year)) {
      archivesList.push({
        year,
        entries: entries.map((cat) => ({ kind: "series" as const, data: cat })),
      });
    }
  }
  archivesList.sort((a, b) => b.year - a.year);

  // 按 type 归组
  const groupedCategories = CATEGORY_TYPES.map((type) => ({
    ...type,
    items: (categoryList || []).filter(
      (c) => c.type === type.key,
    ),
  })).filter((g) => g.items.length > 0);

  const hasCategories = groupedCategories.length > 0;
  const hasArchives = archivesList.length > 0;

  return (
    <section className="space-y-10">
      {/* ── 页面头部 ── */}
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Timeline</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          归档
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          按年份浏览所有文章，追溯过往的每一段记录。
        </p>
      </div>

      {/* ── 分类标签 ── */}
      {hasCategories && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-(--text-soft)">标签分类</h2>

          <div className="flex flex-wrap gap-6">
            {groupedCategories
              .map((group) => ({
                ...group,
                items: group.items.filter((c) => !c.isSeries),
              }))
              .filter((g) => g.items.length > 0)
              .map((group) => (
                <div key={group.key} className="space-y-2 min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/search?categoryId=${cat.id}`}
                        className="inline-flex items-center rounded-full border border-(--border) px-2.5 py-0.5 text-xs text-(--text-soft) transition-colors hover:border-(--accent) hover:text-(--accent)"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-(--text-muted)">
                标签
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tagList?.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/search?tagId=${tag.id}`}
                    className="inline-flex items-center rounded-full border border-(--border) px-2.5 py-0.5 text-xs text-(--text-soft) transition-colors hover:border-(--accent) hover:text-(--accent)"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── 分隔线 ── */}
      {hasCategories && hasArchives && <hr className="border-(--border)" />}

      {/* ── 时间线 ── */}
      <div>
        <h2 className="mb-6 text-sm font-medium text-(--text-soft)">时间线</h2>

        {hasArchives ? (
          <div className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-(--border)">
            {archivesList.map((item) => (
              <div key={item.year} className="relative pb-8 last:pb-0">
                {/* 圆点 */}
                <span className="absolute -left-[23px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-(--accent) bg-(--surface)" />

                {/* 年份 */}
                <h3 className="text-lg font-semibold text-(--text)">
                  {item.year}
                </h3>

                {/* 文章列表 */}
                <ul className="mt-3 space-y-2">
                  {item.entries.map((entry) =>
                    entry.kind === "article" ? (
                      <li key={entry.data.id} className="flex items-baseline gap-3">
                        <time
                          dateTime={entry.data.createdAt?.slice(0, 10)}
                          className="shrink-0 tabular-nums text-(--text-muted)"
                        >
                          {entry.data.createdAt?.slice(5, 10)}
                        </time>
                        <Link
                          href={`/blog/${entry.data.slug}`}
                          className="truncate text-sm font-normal text-(--text) transition-colors hover:text-(--accent)"
                        >
                          {entry.data.title}
                        </Link>
                      </li>
                    ) : (
                      <li key={entry.data.id} className="flex items-baseline gap-3">
                        <time
                          dateTime={entry.data.createdAt?.slice(0, 10)}
                          className="shrink-0 tabular-nums text-(--text-muted)"
                        >
                          {entry.data.createdAt?.slice(5, 10)}
                        </time>
                        <Link
                          href={`/search?categoryId=${entry.data.id}`}
                          className="truncate text-sm font-normal text-(--text) transition-colors hover:text-(--accent)"
                        >
                          {entry.data.name}
                          <span className="ml-1 text-(--text-muted)">
                            ({seriesCounts.get(entry.data.id || "") || 0}篇)
                          </span>
                        </Link>
                      </li>
                    )
                  )}
                  {item.entries.length === 0 && (
                    <li className="text-sm text-(--text-muted)">暂无文章</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-(--text-muted)">
            暂无归档数据，文章发布后将自动出现在这里。
          </p>
        )}
      </div>
    </section>
  );
}
