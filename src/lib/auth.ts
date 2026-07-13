"use server";

import { cookies } from "next/headers";
import { apiAuthLogin, apiAuthLogout, apiNoteSave } from "@/api/generated";

type LoginState = {
  success?: boolean;
  error?: string;
  accessToken?: string;
  refreshToken?: string;
} | null;

export async function login(prevState: LoginState, formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { success: false, error: "请输入手机号和密码" };
  }

  try {
    const tokens = await apiAuthLogin({ phone, password });
    const cookieStore = await cookies();

    // 清除旧版单 token（迁移兼容）
    cookieStore.delete("token");

    cookieStore.set("accessToken", tokens.accessToken!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    cookieStore.set("refreshToken", tokens.refreshToken!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return {
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : "登录失败";
    return { success: false, error: message };
  }
}

export async function logout(refreshToken?: string) {
  // 通知后端登出（不关心结果）
  if (refreshToken) {
    try {
      await apiAuthLogout({ refreshToken });
    } catch {
      // 即使后端失败也继续清除本地状态
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("token"); // 旧版兼容
  return { success: true };
}

type PublishState = { success?: boolean; error?: string } | null;

export async function publishMoment(prevState: PublishState, formData: FormData) {
  const content = formData.get("content") as string;
  const id = formData.get("id") as string;

  if (!content || !content.trim()) {
    return { success: false, error: "请输入内容" };
  }

  try {
    await apiNoteSave({ id: id || undefined, content: content.trim(), type: 2, isPublish: true });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "发布失败";
    return { success: false, error: message };
  }
}
