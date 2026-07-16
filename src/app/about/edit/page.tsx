"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCommonUpload, apiUserCurrent, apiUserProfile } from "@/api/generated";
import type { UserVO } from "@/api/generated/models/userVO";
import Button from "@/components/Button";
import { getAccessToken } from "@/lib/token";

export default function EditProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login?redirectTo=/about/edit");
      return;
    }

    apiUserCurrent()
      .then((u) => {
        setUser(u);
        setAvatar(u.avatar ?? "");
      })
      .catch(() => setError("获取用户信息失败"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await apiCommonUpload(formData as any, { path: "my/", filename: "avatar.png" });
      const cleaned = String(url ?? "").replace(
        "https://zost.oss-cn-chengdu.aliyuncs.com",
        "https://file.zost.cn"
      );
      setAvatar(cleaned);
    } catch {
      setError("上传失败");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await apiUserProfile({
        id: user?.id,
        username: formData.get("username") as string,
        avatar: avatar || undefined,
        signature: (formData.get("signature") as string) || undefined,
        intro: (formData.get("intro") as string) || undefined,
      });
      router.push("/about");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "保存失败";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-lg space-y-8 py-12">
        <p className="text-center text-sm text-(--text-muted)">加载中...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg space-y-8 py-12">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          编辑资料
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <img
            src={avatar ? avatar.replace(/\?.*$/, "") + "?x-oss-process=image/resize,m_lfit,w_200,h_200" : "/default-avatar.png"}
            alt="avatar"
            width={80}
            height={80}
            className="rounded-full ring-2 ring-(--border-strong) ring-offset-4 ring-offset-(--surface) object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "上传中..." : "更换头像"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-(--text)">
            用户名
          </label>
          <input
            id="username"
            name="username"
            required
            defaultValue={user?.username ?? ""}
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="signature" className="block text-sm font-medium text-(--text)">
            签名
          </label>
          <input
            id="signature"
            name="signature"
            defaultValue={user?.signature ?? ""}
            placeholder="一句话介绍自己"
            maxLength={100}
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="intro" className="block text-sm font-medium text-(--text)">
            个人介绍
          </label>
          <textarea
            id="intro"
            name="intro"
            rows={6}
            defaultValue={user?.intro ?? ""}
            placeholder="支持 HTML..."
            className="mt-1.5 block w-full rounded-lg border border-(--border-strong) bg-(--surface) px-3 py-2.5 text-sm text-(--text) placeholder:text-(--text-muted) focus:border-(--accent) focus:outline-none resize-y"
          />
        </div>


        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} size="md">
            {saving ? "保存中..." : "保存"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => router.back()}
          >
            取消
          </Button>
        </div>
      </form>
    </section>
  );
}
