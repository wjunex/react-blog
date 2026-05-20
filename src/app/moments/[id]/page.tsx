import { getBlogDetails } from "@/api";
import CommentSection from "@/components/Comment/CommentSection";
import { formatDate, DATE_TIME } from "@/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/** 增量静态再生成：新动态发布后最多 10 分钟自动更新 */
export const revalidate = 600;

export default async function MomentDetail({ params }: Props) {
  const { id } = await params;
  const data = await getBlogDetails({ id });

  return (
    <>
      <article>
        <header className="border-b border-(--border) pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--text-muted)">
            {data.categoryName && (
              <span className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-xs">
                {data.categoryName}
              </span>
            )}
            {data.createdTime && (
              <time dateTime={data.createdTime}>
                {formatDate(data.createdTime, DATE_TIME)}
              </time>
            )}
            {data.views != null && <span>{data.views} 阅读</span>}
          </div>
        </header>
        <div className="leading-7 text-(--text-soft)">{data.content}</div>
      </article>
      <CommentSection id={id} />
    </>
  );
}
