import { getBlogDetails } from "@/api";
import MDXContent from "@/components/MDXContent";
import CommentSection from "@/components/Comment/CommentSection";
import { formatDate, removeFirstH1 } from "@/utils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const data = await getBlogDetails({
    slug,
  });

  data.content = removeFirstH1(data.content);

  return (
    <>
      <article>
        <header className="border-b border-[var(--border)] pb-6 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--text)]">
            {data.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-muted)]">
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
            {data.textCount != null && <span>{data.textCount} 字</span>}
            {data.views != null && <span>{data.views} 阅读</span>}
          </div>
        </header>
        <MDXContent source={data.content} />
      </article>
      <CommentSection slug={slug} />
    </>
  );
}
