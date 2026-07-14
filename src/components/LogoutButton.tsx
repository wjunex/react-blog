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
      onClick={handleLogout}
      className="text-xs text-(--text-muted) transition-colors hover:text-(--accent)"
    >
      退出登录
    </button>
  );
}
