"use server";

import { cookies } from "next/headers";
import { login as loginAPI, saveNote } from "@/api";

type LoginState = { success?: boolean; error?: string } | null;

export async function login(prevState: LoginState, formData: FormData) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { success: false, error: "请输入手机号和密码" };
  }

  try {
    const token = await loginAPI({ phone, password });
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "登录失败";
    return { success: false, error: message };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  return { success: true };
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

type PublishState = { success?: boolean; error?: string } | null;

export async function publishMoment(prevState: PublishState, formData: FormData) {
  const content = formData.get("content") as string;

  if (!content || !content.trim()) {
    return { success: false, error: "请输入内容" };
  }

  try {
    await saveNote({ content: content.trim() });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "发布失败";
    return { success: false, error: message };
  }
}
