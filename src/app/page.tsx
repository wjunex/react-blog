import Link from "next/link";
import { apiPublicList, apiPublicMomentList } from "@/api/generated";
import BlogItem from "@/components/List/BlogItem";
import MomentItem from "@/components/List/MomentItem";
import { getServerToken } from "@/lib/token-server";
import { ButtonLink } from "@/components/Button";

export default async function Home() {
  const isLoggedIn = !!(await getServerToken());
  const [blogResult, hotResult, momentResult] = await Promise.allSettled([
    apiPublicList({ pageNum: 1, pageSize: 2 }),
    apiPublicList({ pageNum: 1, pageSize: 3, sortBy: "views", sortOrder: "desc" }),
    apiPublicMomentList({ pageNum: 1, pageSize: 3 }),
  ]);

  const recentPosts =
    blogResult.status === "fulfilled" ? (blogResult.value.records ?? []) : [];
  const hotPosts =
    hotResult.status === "fulfilled" ? (hotResult.value.records ?? []) : [];
  const recentMoments =
    momentResult.status === "fulfilled"
      ? (momentResult.value.records ?? [])
      : [];

  return (
    <section className="space-y-12">
      {/* ── Hero ── */}
      <div className="border-b border-(--border) pb-8">
        <p className="text-sm font-medium text-(--accent)">
          Hello, welcome to my blog
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          <span className="text-(--accent)">W君</span>
          的网络日志
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-(--text-soft)">
          这里是我的个人博客，记录技术笔记、生活思考和阶段性的想法。
          希望通过文字，把学到的东西沉淀下来，也分享给需要的朋友。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {isLoggedIn && (
            <ButtonLink href="/editor" variant="primary" size="sm">
              写文章
            </ButtonLink>
          )}
          <ButtonLink href="/blog" variant="secondary" size="sm">
            浏览文章
          </ButtonLink>
          <ButtonLink href="/about" variant="secondary" size="sm">
            关于我
          </ButtonLink>
        </div>
      </div>

      {/* ── Recent Posts ── */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--text)">最新发布</h2>
          <Link href="/blog" className="text-sm font-medium text-(--accent) transition-colors hover:text-(--accent-hover)">
            查看更多 →
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="divide-y divide-(--border)">
            {recentPosts.map((item) => (
              <BlogItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-(--text-muted)">
            暂无文章
          </p>
        )}
      </div>

      {/* ── Hot Posts ── */}
      {hotPosts.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--text)">热门文章</h2>
            <Link href="/blog?sort=hot" className="text-sm font-medium text-(--accent) transition-colors hover:text-(--accent-hover)">
              查看更多 →
            </Link>
          </div>
          <div className="divide-y divide-(--border)">
            {hotPosts.map((item) => (
              <BlogItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Moments ── */}
      {recentMoments.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--text)">最新动态</h2>
            <Link
              href="/moments"
              className="text-sm font-medium text-(--accent) transition-colors hover:text-(--accent-hover)"
            >
              查看更多 →
            </Link>
          </div>
          <div className="divide-y divide-(--border)">
            {recentMoments.map((item) => (
              <MomentItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Links ── */}
      <div className="rounded-xl border border-(--border) bg-(--surface-muted) p-6">
        <h2 className="text-sm font-medium text-(--text-soft)">快捷导航</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { title: "文章", path: "/blog", desc: "浏览全部文章" },
            { title: "动态", path: "/moments", desc: "零碎想法记录" },
            { title: "归档", path: "/archives", desc: "按年份浏览" },
            { title: "关于", path: "/about", desc: "了解更多" },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="group rounded-lg border border-(--border) bg-(--surface) p-4 transition-colors hover:border-(--accent)"
            >
              <h3 className="text-sm font-semibold text-(--text) transition-colors group-hover:text-(--accent)">
                {link.title}
              </h3>
              <p className="mt-1 text-xs text-(--text-muted)">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
