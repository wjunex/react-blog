import type { Metadata } from "next";
import Link from "next/link";
import { apiPublicDetail, apiPublicListByYear } from "@/api/generated";
import MDXContent from "@/components/MDXContent";
import ImageViewer from "@/components/ImageViewer";
import CommentSection from "@/components/Comment/CommentSection";
import { CommentIcon } from "@/components/Icons";
import { formatDate, removeFirstH1 } from "@/utils";
import { getServerToken } from "@/lib/token-server";
import Badge from "@/components/Badge";
import DeleteArticleButton from "@/components/DeleteArticleButton";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await apiPublicDetail({ slug });
    return { title: data.title || "" };
  } catch {
    return { title: "文章详情" };
  }
}

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
  const isLoggedIn = !!(await getServerToken());

  data.content = removeFirstH1(data.content!);

  return (
    <>
      <article>
        <header className="border-b border-(--border) pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-(--text)">
            {data.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--text-muted)">
            {data.categoryName && (
              <Badge variant="category">{data.categoryName}</Badge>
            )}
            {data.createdAt && (
              <time dateTime={data.createdAt}>
                {formatDate(data.createdAt)}
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
            {isLoggedIn && (
              <>
                <Link
                  href={`/editor?slug=${slug}`}
                  className="text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
                >
                  编辑
                </Link>
                {data.id && <DeleteArticleButton id={data.id} redirectTo="/blog" />}
              </>
            )}
          </div>
        </header>
        <ImageViewer>
          <MDXContent source={data.content} />
        </ImageViewer>
        {data.tags && data.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {data.tags.map((tag) => (
              <Badge key={tag.id}>#{tag.name}</Badge>
            ))}
          </div>
        )}
      </article>

      {/* 评论区锚点 */}
      <section id="comments">
        <CommentSection slug={slug} />
      </section>

    </>
  );
}
