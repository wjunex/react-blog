import { Metadata } from "next";
import Image from "next/image";
import { apiPublicUserInfo } from "@/api/generated";
import { GitHubIcon, MailIcon, GlobeIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "关于",
  description: "关于我和这个博客",
};

export default async function AboutPage() {
  const blogger = await apiPublicUserInfo();
  return (
    <section className="space-y-8">
      {/* ── 页面头部 ── */}
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">About</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          关于
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          这里收集一些技术笔记、生活记录和阶段性的想法。
        </p>
      </div>
      {/* ── 个人简介卡片 ── */}
      <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-linear-to-br from-(--surface) via-(--surface) to-(--accent)/5 p-8 shadow-sm sm:flex sm:flex-row sm:items-center sm:gap-6">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-(--accent)/40 to-transparent" />
        <div className="flex shrink-0 justify-center">
          <Image
            src={blogger.avatar!}
            alt={blogger.username!}
            width={72}
            height={72}
            className="rounded-full ring-2 ring-(--border-strong) ring-offset-4 ring-offset-(--surface)"
            priority
          />
        </div>
        <div className="mt-5 min-w-0 text-center sm:mt-0 sm:text-left">
          <h2 className="inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-(--text)">
            {blogger.username}
          </h2>
          {blogger.signature && (
            <p className="mt-2 text-sm leading-6 text-(--text-soft)">
              {blogger.signature}
            </p>
          )}
        </div>
      </div>

      {/* ── 博客介绍 ── */}
      {blogger.intro && (
        <div
          className="rounded-2xl border border-(--border) bg-(--surface-muted) p-6 text-sm leading-7 text-(--text-soft) flex flex-col gap-4 shadow-sm"
          dangerouslySetInnerHTML={{ __html: blogger.intro }}
        />
      )}

      {/* ── 联系与站点信息 ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-(--border) p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-(--text)">关于我</h3>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              <a
                href="mailto:hi@wjun.me"
                className="group flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <MailIcon />
                </span>
                <span className="text-(--text-soft) transition-colors group-hover:text-(--text)">
                  邮箱
                </span>
                <span className="ml-auto hidden text-xs text-(--text-muted) group-hover:inline">
                  hi@wjun.me
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/wjunex"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <GitHubIcon />
                </span>
                <span className="text-(--text-soft) transition-colors group-hover:text-(--text)">
                  GitHub
                </span>
                <span className="ml-auto hidden text-xs text-(--text-muted) group-hover:inline">
                  github.com/wjunex
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://wjun.me/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <GlobeIcon />
                </span>
                <span className="text-(--text-soft) transition-colors group-hover:text-(--text)">
                  个人简历
                </span>
                <span className="ml-auto hidden text-xs text-(--text-muted) group-hover:inline">
                  wjun.me/resume
                </span>
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-(--border) p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-(--text)">我的项目</h3>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <a
                href="https://yangliuyiyi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-(--text)">杨柳依依</span>
                  <span className="ml-2 hidden text-xs text-(--text-muted) group-hover:inline">
                    yangliuyiyi.com
                  </span>
                  <p className="text-xs text-(--text-muted)">
                    一起了解诗词历史
                  </p>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://zost.cn/tab"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-(--text)">标签页</span>
                  <span className="ml-2 hidden text-xs text-(--text-muted) group-hover:inline">
                    zost.cn/tab
                  </span>
                  <p className="text-xs text-(--text-muted)">
                    一款好用的浏览器书签管理插件
                  </p>
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://zost.cn"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-(--surface-muted)"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--border) text-(--text-muted) transition-all group-hover:border-(--accent)/30 group-hover:text-(--accent)">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-(--text)">更多项目</span>
                  <span className="ml-2 hidden text-xs text-(--text-muted) group-hover:inline">
                    zost.cn
                  </span>
                  <p className="text-xs text-(--text-muted)">
                    一些有趣的网站和工具
                  </p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
