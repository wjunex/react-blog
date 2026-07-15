import type { Metadata } from "next";
import { Suspense } from "react";
import List from "@/components/List/List";
import SortToggle from "@/components/SortToggle";
import { getQueryNumber } from "@/utils";

export const metadata: Metadata = { title: "文章" };

type HomeProps = {
  searchParams: Promise<{
    pageNum?: string | string[];
    pageSize?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);
  const sort = typeof query.sort === "string" ? query.sort : undefined;
  const isHot = sort === "hot";

  return (
    <section className="space-y-6">
      <div className="border-b border-(--border) pb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-(--accent)">
            {isHot ? "Hot Posts" : "Latest Posts"}
          </p>
          <Suspense>
            <SortToggle />
          </Suspense>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          文章
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          记录技术、生活和一些阶段性的想法。
        </p>
      </div>
      <List
        pageNum={pageNum}
        pageSize={pageSize}
        basePath="/blog"
        sortBy={isHot ? "views" : undefined}
        sortOrder={isHot ? "desc" : undefined}
      />
    </section>
  );
}
