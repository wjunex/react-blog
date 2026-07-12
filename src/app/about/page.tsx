import { Metadata } from "next";
import Image from "next/image";
import { apiPublicUserInfo } from "@/api/generated";
import { GitHubIcon, MailIcon, GlobeIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "关于我和这个博客",
};

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/wjunex",
    icon: <GitHubIcon />,
  },
  {
    label: "Email",
    href: "mailto:hi@wjun.me",
    icon: <MailIcon />,
  },
  {
    label: "博客",
    href: "https://wjun.me",
    icon: <GlobeIcon />,
  },
] as const;

export default async function AboutPage() {
  const blogger = await apiPublicUserInfo();

  return (
    <section className="space-y-8">
      {/* ── 页面头部 ── */}
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">About</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          关于
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          这里收集一些技术笔记、生活记录和阶段性的想法。
        </p>
      </div>

      {/* ── 个人简介卡片 ── */}
      <div className="flex flex-col items-center gap-6 rounded-xl border border-(--border) bg-(--surface-muted) p-8 sm:flex-row sm:items-start">
        {/* 头像 */}
        <div className="shrink-0">
          <Image
            src={blogger.avatar!}
            alt={blogger.username!}
            width={100}
            height={100}
            className="rounded-full border-2 border-(--border-strong)"
            priority
          />
        </div>

        {/* 信息 */}
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-(--text)">
            {blogger.username}
          </h2>
          <p className="mt-1 text-sm text-(--text-muted)">@wjun.me</p>
          {blogger.signature && (
            <p className="mt-3 text-sm leading-7 text-(--text-soft)">
              {blogger.signature}
            </p>
          )}

          {/* 社交链接 */}
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-(--border-strong) bg-(--surface) px-3 py-1.5 text-sm font-medium text-(--text-soft) transition-colors hover:border-(--accent) hover:text-(--accent)"
              >
                {link.icon}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 博客介绍 ── */}
      {blogger.intro && (
        <div
          className="rounded-xl border border-(--border) bg-(--surface-muted) p-6 text-sm leading-7 text-(--text-soft) flex flex-col gap-4"
          dangerouslySetInnerHTML={{ __html: blogger.intro }}
        />
      )}

      {/* ── 联系与站点信息 ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-(--border) p-5">
          <h3 className="text-sm font-semibold text-(--text)">联系方式</h3>
          <ul className="mt-3 space-y-2 text-sm text-(--text-soft)">
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">📧</span>
              <a
                href="mailto:hi@wjun.me"
                className="transition-colors hover:text-(--accent)"
              >
                hi@wjun.me
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">🐙</span>
              <a
                href="https://github.com/wjunex"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-(--accent)"
              >
                github.com/wjunex
              </a>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">🌐</span>
              <a
                href="https://wjun.me"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-(--accent)"
              >
                wjun.me
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-(--border) p-5">
          <h3 className="text-sm font-semibold text-(--text)">我的网站</h3>
          <ul className="mt-3 space-y-2 text-sm text-(--text-soft)">
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">⚡</span>
              <span>框架：Next.js 16</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">🎨</span>
              <span>样式：Tailwind CSS v4</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">📝</span>
              <span>内容：Markdown / MDX</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-(--text-muted)">📅</span>
              <span>始于 2024</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
