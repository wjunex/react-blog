import { getMomentsDetails } from "@/api";
import CommentSection from "@/components/Comment/CommentSection";
import { formatDate, DATE_TIME } from "@/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MomentDetail({ params }: Props) {
  const { id } = await params;
  const data = await getMomentsDetails({ id });

  return (
    <>
      <article>
        <header className="border-b border-[var(--border)] pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-muted)]">
            {data.categoryName && (
              <span className="rounded-full border border-[var(--border-strong)] bg-[var(--surface-muted)] px-2 py-0.5 text-xs">
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
        <div className="leading-7 text-[--text-soft]">{data.content}</div>
      </article>
      <CommentSection id={id} />
    </>
  );
}
