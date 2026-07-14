import type { Metadata } from "next";
import Link from "next/link";
import { apiPublicDetail, apiPublicMomentList, apiPublicUserInfo } from "@/api/generated";
import CommentSection from "@/components/Comment/CommentSection";
import { formatDate, DATE_TIME_WEEKDAY } from "@/utils";
import { getServerToken } from "@/lib/token-server";
import Badge from "@/components/Badge";
import DeleteArticleButton from "@/components/DeleteArticleButton";

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
  const [data, blogger, isLoggedIn] = await Promise.all([
    apiPublicDetail({ id }),
    apiPublicUserInfo(),
    getServerToken().then((t) => !!t),
  ]);

  return (
    <>
      <article>
        <header className="border-b border-(--border) pb-8 mb-12">
          <div className="flex items-center gap-4">
            <img
              src={blogger.avatar!}
              alt={blogger.username!}
              width={48}
              height={48}
              className="shrink-0 rounded-full border-2 border-(--border-strong)"
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
                  <Badge variant="category">{data.categoryName}</Badge>
                )}
                {/* {data.views != null && <span>{data.views} 阅读</span>} */}
                {isLoggedIn && (
                  <>
                    <Link
                      href={`/moments/editor?id=${id}`}
                      className="text-xs text-(--text-muted) hover:text-(--accent) transition-colors"
                    >
                      编辑
                    </Link>
                    {data.id && <DeleteArticleButton id={data.id} redirectTo="/moments" message="确定删除这条动态？此操作不可撤销。" />}
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="leading-7 text-(--text-soft)">{data.content}</div>
        {data.images && data.images.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {data.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className="rounded-lg object-cover"
                style={{ width: 200, height: 200 }}
              />
            ))}
          </div>
        )}
      </article>
      <CommentSection id={id} />
    </>
  );
}
