"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { HamburgerIcon, CloseIcon, SearchIcon } from "@/components/Icons";

const NAV_LIST = [
  { title: "首页", path: "/" },
  { title: "文章", path: "/blog" },
  { title: "动态", path: "/moments" },
  { title: "归档", path: "/archives" },
  { title: "友链", path: "/friend-links" },
  { title: "关于", path: "/about" },
] as const;

function isActive(path: string, currentPathname: string) {
  if (path === "/") {
    return currentPathname === "/";
  }

  return (
    currentPathname === path || currentPathname.startsWith(path + "/")
  );
}

export default function NavBar({ isLoggedIn, avatar, unreadCount }: { isLoggedIn?: boolean; avatar?: string; unreadCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDetailPage = /^\/(?:moments|blog)\/[^/]+$/.test(pathname);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--surface-muted-alpha) backdrop-blur">
      <div className="mx-auto flex max-w-(--content) items-center px-5 py-4 sm:px-8 lg:px-14">
        {/* Logo */}
        <div className="mr-4 flex-1 select-none">
          {isDetailPage ? (
            <button
              onClick={() => router.back()}
              className="inline-flex items-baseline gap-2 text-[24px] font-semibold tracking-tight text-(--text) transition-colors hover:text-(--accent) cursor-pointer"
            >
              <span>𝑾𝑱𝑼𝑵</span>
              <span className="hidden text-sm font-normal text-(--text-muted) sm:inline">
                blog
              </span>
            </button>
          ) : (
            <Link
              href="/"
              className="inline-flex items-baseline gap-2 text-[24px] font-semibold tracking-tight text-(--text) transition-colors hover:text-(--accent)"
            >
              <span>𝑾𝑱𝑼𝑵</span>
            </Link>
          )}
        </div>

        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LIST.map((item) => {
            const active = isActive(item.path, pathname);

            return active ? (
              <span
                key={item.path}
                className="pointer-events-none rounded-md px-3 py-2 text-sm font-medium text-(--accent)"
              >
                {item.title}
              </span>
            ) : (
              <Link
                key={item.path}
                className="rounded-md px-3 py-2 text-sm font-medium text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent)"
                href={item.path}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* 右侧：搜索 + 主题切换 + 头像 + 汉堡按钮 */}
        <div className="flex items-center">
          <Link
            href="/search"
            className="rounded-md p-2 text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent) inline-flex"
            aria-label="搜索"
          >
            <SearchIcon />
          </Link>
          <ThemeToggle />
          {isLoggedIn && avatar && (
            unreadCount && unreadCount > 0 ? (
              <Link href="/notifications" className="p-2 inline-flex items-center">
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-(--syntax-red) text-white text-[11px] font-semibold flex items-center justify-center leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </Link>
            ) : (
              <Link href="/about" className="p-2 inline-flex items-center">
                <img
                  src={avatar + "?x-oss-process=image/resize,m_lfit,w_80,h_80"}
                  alt="avatar"
                  className="w-5 h-5 rounded-full"
                />
              </Link>
            )
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            className="flex items-center justify-center rounded-md p-1.5 text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent) md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {menuOpen && (
        <div className="border-t border-(--border) md:hidden">
          <nav className="flex flex-col gap-1 px-5 pb-4 pt-2" aria-label="Mobile">
            {NAV_LIST.map((item) => {
              const active = isActive(item.path, pathname);

              return active ? (
                <span
                  key={item.path}
                  className="pointer-events-none rounded-md px-3 py-2.5 text-sm font-medium text-(--accent)"
                >
                  {item.title}
                </span>
              ) : (
                <Link
                  key={item.path}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent)"
                  href={item.path}
                  onClick={closeMenu}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
