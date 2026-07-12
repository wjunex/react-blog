import Link from "next/link";
import List from "@/components/List/List";
import { getQueryNumber } from "@/utils";
import { getServerToken } from "@/lib/token-server";

type MomentsProps = {
  searchParams: Promise<{
    pageNum?: string | string[];
    pageSize?: string | string[];
  }>;
};

export default async function Moments({ searchParams }: MomentsProps) {
  const query = await searchParams;
  const pageNum = getQueryNumber(query.pageNum, 1);
  const pageSize = getQueryNumber(query.pageSize, 10);
  const isLoggedIn = !!(await getServerToken());

  return (
    <section className="space-y-6">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Moments</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          动态
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          一些零碎的、即时的想法和记录。
        </p>
        {isLoggedIn && (
          <Link
            href="/moments/new"
            className="mt-4 inline-block rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            发布动态
          </Link>
        )}
      </div>
      <List
        pageNum={pageNum}
        pageSize={pageSize}
        type={2}
        basePath="/moments"
      />
    </section>
  );
}
