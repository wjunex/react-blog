"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
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
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      退出登录
    </Button>
  );
}
