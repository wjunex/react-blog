"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { HamburgerIcon, CloseIcon } from "@/components/Icons";
import { logout } from "@/lib/auth";
import { getRefreshToken, clearTokens } from "@/lib/token";

const NAV_LIST = [
  { title: "首页", path: "/" },
  { title: "文章", path: "/blog" },
  { title: "动态", path: "/moments" },
  { title: "归档", path: "/archives" },
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

export default function NavBar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    const token = getRefreshToken();
    await logout(token ?? undefined);
    clearTokens();
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--surface-muted-alpha) backdrop-blur">
      <div className="mx-auto flex max-w-(--content) items-center px-5 py-4 sm:px-8 lg:px-14">
        {/* Logo */}
        <div className="mr-4 flex-1 select-none">
          <Link
            href="/"
            className="inline-flex items-baseline gap-2 text-[24px] font-semibold tracking-tight text-(--text) transition-colors hover:text-(--accent)"
          >
            <span>𝑾𝑱𝑼𝑵</span>
            <span className="hidden text-sm font-normal text-(--text-muted) sm:inline">
              blog
            </span>
          </Link>
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

        {/* 右侧：登出 + 主题切换 + 汉堡按钮 */}
        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent)"
            >
              退出
            </button>
          )}
          <ThemeToggle />
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
