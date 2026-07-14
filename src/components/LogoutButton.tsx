"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { getRefreshToken, clearTokens } from "@/lib/token";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const token = getRefreshToken();
    await logout(token ?? undefined);
    clearTokens();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="appearance-none rounded-md px-3 py-1.5 text-xs font-medium text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent) border border-(--border-strong)"
    >
      退出登录
    </button>
  );
}
