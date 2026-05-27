"use client";

import { apiPublicFriendLinkApply } from "@/api/generated";
import type { FriendLink } from "@/api/generated/models";
import { useState, useTransition, type FormEvent } from "react";

// ---------- types ----------

type FriendLinkFormProps = {
  onSuccess?: (link: FriendLink) => void;
};

// ---------- helpers ----------

function isUrl(value: string) {
  return /^https?:\/\/.+/.test(value);
}

// ---------- component ----------

export default function FriendLinkForm({ onSuccess }: FriendLinkFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = (data.get("name") as string)?.trim() || "";
    const url = (data.get("url") as string)?.trim() || "";
    const logo = (data.get("logo") as string)?.trim() || "";
    const description = (data.get("description") as string)?.trim() || "";
    const email = (data.get("email") as string)?.trim() || "";

    if (!name) {
      setError("站点名称不能为空");
      return;
    }
    if (!url) {
      setError("站点地址不能为空");
      return;
    }
    if (!isUrl(url)) {
      setError("站点地址格式不正确");
      return;
    }
    if (logo && !isUrl(logo)) {
      setError("Logo 地址格式不正确");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("邮箱格式不正确");
      return;
    }

    startTransition(async () => {
      try {
        const result = await apiPublicFriendLinkApply({
          name,
          url,
          logo: logo || undefined,
          description: description || undefined,
          email: email || undefined,
        });
        setSuccess(true);
        form.reset();
        onSuccess?.(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 comment-form">
      <div className="flex items-center gap-1 comment-form__title">
        <h3 className="">申请友链</h3>
      </div>

      <div className="comment-form__fields">
        <div className="comment-form__field">
          <label htmlFor="fl-name" className="comment-form__label">
            站点名称 <span className="comment-form__required">*</span>
          </label>
          <input
            id="fl-name"
            name="name"
            type="text"
            className="comment-form__input"
            placeholder="你的站点名称"
            maxLength={64}
            required
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="fl-url" className="comment-form__label">
            站点地址 <span className="comment-form__required">*</span>
          </label>
          <input
            id="fl-url"
            name="url"
            type="url"
            className="comment-form__input"
            placeholder="https://"
            maxLength={256}
            required
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="fl-logo" className="comment-form__label">
            Logo 地址
          </label>
          <input
            id="fl-logo"
            name="logo"
            type="url"
            className="comment-form__input"
            placeholder="https://"
            maxLength={256}
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="fl-desc" className="comment-form__label">
            站点描述
          </label>
          <input
            id="fl-desc"
            name="description"
            type="text"
            className="comment-form__input"
            placeholder="简单介绍一下你的站点"
            maxLength={128}
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="fl-email" className="comment-form__label">
            联系邮箱
          </label>
          <input
            id="fl-email"
            name="email"
            type="email"
            className="comment-form__input"
            placeholder="用于审核通知"
            maxLength={128}
          />
        </div>
      </div>

      {error && (
        <p className="comment-form__error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="comment-form__success" role="status">
          申请已提交，审核通过后将显示在友链列表中
        </p>
      )}

      <button type="submit" className="comment-form__submit" disabled={pending}>
        {pending ? "提交中…" : "提交申请"}
      </button>
    </form>
  );
}
