import type { Metadata } from "next";
import { apiPublicSearch, apiPublicCategoryList, apiPublicTagList } from "@/api/generated";
import BlogItem from "@/components/List/BlogItem";
import Pagination from "@/components/List/Pagination";
import SearchForm from "./SearchForm";
import { getQueryNumber } from "@/utils";

export const metadata: Metadata = { title: "搜索" };

type Props = {
  searchParams: Promise<{
    keyword?: string | string[];
    categoryId?: string | string[];
    tagId?: string | string[];
    pageNum?: string | string[];
    pageSize?: string | string[];
  }>;
};

function getStr(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export default async function SearchPage({ searchParams }: Props) {
  const query = await searchParams;
  const keyword = getStr(query.keyword);
  const categoryId = getStr(query.categoryId);
  const tagId = getStr(query.tagId);
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);

  const hasFilter = !!(keyword || categoryId || tagId);
  const isCategory = !!categoryId;
  const isTag = !!tagId;
  const hideInput = isCategory || isTag;

  // 获取分类/标签名称
  let filterName = "";
  let filterDesc = "";

  if (isCategory) {
    const cats = await apiPublicCategoryList();
    const cat = cats?.find((c) => c.id === categoryId);
    filterName = cat?.name ?? categoryId;
    filterDesc = cat?.description ?? "";
  } else if (isTag) {
    const tags = await apiPublicTagList();
    const tag = tags?.find((t) => t.id === tagId);
    filterName = tag?.name ?? tagId;
  }

  // 标题信息
  const subTitle = isCategory ? "Category" : isTag ? "Tags" : "Search";
  const pageTitle = isCategory || isTag ? filterName : "搜索";
  const pageDesc = isCategory || isTag
    ? filterDesc
    : "输入关键词或点击分类/标签，搜索站内文章。";

  let records, total, current, size, pages: number | undefined;

  if (hasFilter) {
    const result = await apiPublicSearch({
      keyword: keyword || undefined,
      categoryId: categoryId || undefined,
      tagId: tagId || undefined,
      pageNum,
      pageSize,
    });
    records = result.records ?? [];
    total = result.total ?? 0;
    current = result.current ?? pageNum;
    size = result.size ?? pageSize;
    pages = Math.ceil(total / size);
  }

  const extraParams: Record<string, string> = {};
  if (keyword) extraParams.keyword = keyword;
  if (categoryId) extraParams.categoryId = categoryId;
  if (tagId) extraParams.tagId = tagId;

  return (
    <section className="space-y-8">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">{subTitle}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          {pageTitle}
        </h1>
        {pageDesc && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
            {pageDesc}
          </p>
        )}
      </div>

      {!hideInput && (
        <SearchForm
          initialKeyword={keyword}
          categoryId={categoryId}
          tagId={tagId}
          pageSize={pageSize}
        />
      )}

      {!hasFilter ? (
        <p className="py-16 text-center text-sm text-(--text-muted)">
          输入关键词开始搜索。
        </p>
      ) : (
        <>
          <p className="text-sm text-(--text-muted)">
            共 <span className="font-medium text-(--text)">{total}</span> 篇文章
          </p>
          {records && records.length > 0 ? (
            <>
              <div className="divide-y divide-(--border)">
                {records.map((item) => (
                  <BlogItem key={item.id} item={item} />
                ))}
              </div>
              <Pagination
                current={current!}
                pageSize={size!}
                total={total!}
                pages={pages!}
                basePath="/search"
                extraParams={extraParams}
              />
            </>
          ) : (
            <p className="py-16 text-center text-sm text-(--text-muted)">
              没有找到相关文章。
            </p>
          )}
        </>
      )}
    </section>
  );
}
