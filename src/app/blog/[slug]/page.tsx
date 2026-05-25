import { apiPublicDetail, apiPublicListByYear } from "@/api/generated";
import MDXContent from "@/components/MDXContent";
import CommentSection from "@/components/Comment/CommentSection";
import { CommentIcon } from "@/components/Icons";
import { formatDate, removeFirstH1 } from "@/utils";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

/** 预生成所有已发布文章的静态页面 */
export async function generateStaticParams() {
  const archives = await apiPublicListByYear({});
  const slugs: { slug: string }[] = [];

  for (const group of archives || []) {
    for (const item of group.notes || []) {
      if (item.slug) {
        slugs.push({ slug: item.slug });
      }
    }
  }

  return slugs;
}

/** 增量静态再生成：新文章发布后最多 10 分钟自动更新 */
export const revalidate = 600;

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const data = await apiPublicDetail({ slug });

  data.content = removeFirstH1(data.content!);

  return (
    <>
      <article>
        <header className="border-b border-(--border) pb-6 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-(--text)">
            {data.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--text-muted)">
            {data.categoryName && (
              <span className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-xs">
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
            {data.commentCount != null && (
              <a
                href="#comments"
                className="inline-flex items-center gap-1 transition-colors hover:text-(--accent)"
              >
                <CommentIcon />
                <span>{data.commentCount}</span>
              </a>
            )}
          </div>
        </header>
        <MDXContent source={data.content} />
      </article>

      {/* 评论区锚点 */}
      <section id="comments">
        <CommentSection slug={slug} />
      </section>

    </>
  );
}
