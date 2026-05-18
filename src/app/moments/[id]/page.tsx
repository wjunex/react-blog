import { getBlogDetails, getMomentsDetails } from "@/api";
import CommentSection from "@/components/Comment/CommentSection";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function MomentDetail({ params }: Props) {
  const { id } = await params;
  const data = await getBlogDetails({ id });
  console.log(data);

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
                {formatDate(data.createdTime)}
              </time>
            )}
            {data.views != null && <span>{data.views} 阅读</span>}
          </div>
        </header>
        <div className="text-sm leading-7 text-[var(--text-soft)] whitespace-pre-wrap">
          {data.content}
        </div>
      </article>
      <CommentSection id={id} />
    </>
  );
}
