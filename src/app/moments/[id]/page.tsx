import type { Metadata } from "next";
import { apiPublicDetail, apiPublicMomentList, apiPublicUserInfo } from "@/api/generated";
import CommentSection from "@/components/Comment/CommentSection";
import { formatDate, DATE_TIME_WEEKDAY } from "@/utils";
import Image from "next/image";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/** 预生成所有已发布动态的静态页面 */
export async function generateStaticParams() {
  const ids: { id: string }[] = [];
  let pageNum = 1;
  const pageSize = 100;

  while (true) {
    const result = await apiPublicMomentList({ pageNum, pageSize });
    for (const item of result.records!) {
      if (item.id) {
        ids.push({ id: String(item.id) });
      }
    }
    if (ids.length >= result.total!) break;
    pageNum++;
  }

  return ids;
}

/** 增量静态再生成：新动态发布后最多 10 分钟自动更新 */
export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await apiPublicDetail({ id });
    return { title: data.title?.slice(0, 30) || "动态详情" };
  } catch {
    return { title: "动态详情" };
  }
}

export default async function MomentDetail({ params }: Props) {
  const { id } = await params;
  const [data, blogger] = await Promise.all([
    apiPublicDetail({ id }),
    apiPublicUserInfo(),
  ]);

  return (
    <>
      <article>
        <header className="border-b border-(--border) pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Image
              src={blogger.avatar!}
              alt={blogger.username!}
              width={48}
              height={48}
              className="shrink-0 rounded-full border-2 border-(--border-strong)"
              priority
            />
            <div className="min-w-0">
              <span className="text-lg font-semibold text-(--text)">
                {blogger.username}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--text-muted)">
                {data.createdAt && (
                  <time dateTime={data.createdAt}>
                    {formatDate(data.createdAt, DATE_TIME_WEEKDAY)}
                  </time>
                )}
                {data.categoryName && (
                  <span className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-xs">
                    {data.categoryName}
                  </span>
                )}
                {/* {data.views != null && <span>{data.views} 阅读</span>} */}
              </div>
            </div>
          </div>
        </header>
        <div className="leading-7 text-(--text-soft)">{data.content}</div>
      </article>
      <CommentSection id={id} />
    </>
  );
}
