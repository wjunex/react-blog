import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "关于我和这个博客",
};

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/wjunex",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:hi@wjun.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "博客",
    href: "https://wjun.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
] as const;

export default function AboutPage() {
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
            src="https://img.wjun.me/upload-1770694894225-9783.jpg"
            alt="WJUN"
            width={100}
            height={100}
            className="rounded-full border-2 border-(--border-strong)"
            priority
          />
        </div>

        {/* 信息 */}
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-(--text)">Jun Wang</h2>
          <p className="mt-1 text-sm text-(--text-muted)">@wjunex</p>
          <p className="mt-3 text-sm leading-7 text-(--text-soft)">
            一个喜欢写代码、记录想法的开发者。
            专注于 Web 开发，偶尔折腾一些有趣的小项目。
            希望通过这个博客，把学到的东西沉淀下来，也分享给需要的朋友。
          </p>

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
      <div className="rounded-xl border border-(--border) bg-(--surface-muted) p-6 text-sm leading-7 text-(--text-soft)">
        <p>
          希望它保持轻巧、清晰，也足够安静。文章页会优先服务阅读体验，列表页则尽量让内容本身成为视觉重心。
        </p>
        <p className="mt-4">
          技术文章主要涉及前端开发（React、TypeScript、Next.js
          等），偶尔也会记录一些后端、运维相关的内容。
          生活类的内容则更随意一些，可能是读书笔记、旅行记录或者一些随想。
        </p>
      </div>

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
          <h3 className="text-sm font-semibold text-(--text)">站点信息</h3>
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
