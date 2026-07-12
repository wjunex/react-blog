import type { Metadata } from "next";
import List from "@/components/List/List";
import { getQueryNumber } from "@/utils";

export const metadata: Metadata = { title: "文章" };

type HomeProps = {
  searchParams: Promise<{
    pageNum?: string | string[];
    pageSize?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);

  return (
    <section className="space-y-6">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Latest Posts</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          文章
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          记录技术、生活和一些阶段性的想法。
        </p>
      </div>
      <List pageNum={pageNum} pageSize={pageSize} basePath="/blog" />
    </section>
  );
}
