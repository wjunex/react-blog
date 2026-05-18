"use client";

import { addBlogComment } from "@/api";
import type { BlogComment } from "@/api/types";
import { useState, useTransition, type FormEvent } from "react";

// ---------- types ----------

type CommentFormProps = {
  /** 文章 slug */
  slug?: string;
  /** 动态 id */
  id?: string;
  /** 回复时传入父评论信息 */
  parent?: Pick<BlogComment, "id" | "rootId" | "nickname">;
  /** 提交成功后回调 */
  onSuccess?: () => void;
  /** 取消回复 */
  onCancel?: () => void;
};

// ---------- helpers ----------

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isUrl(value: string) {
  return /^https?:\/\/.+/.test(value);
}

// ---------- component ----------

export default function CommentForm({
  slug,
  id,
  parent,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isReply = !!parent;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    const nickname = (data.get("nickname") as string).trim();
    const email = (data.get("email") as string).trim();
    const website = (data.get("website") as string).trim();
    const content = (data.get("content") as string).trim();

    // 验证
    if (!nickname) {
      setError("昵称不能为空");
      return;
    }
    if (!email) {
      setError("邮箱不能为空");
      return;
    }
    if (!isEmail(email)) {
      setError("邮箱格式不正确");
      return;
    }
    if (website && !isUrl(website)) {
      setError("网站地址格式不正确");
      return;
    }
    if (!content) {
      setError("评论内容不能为空");
      return;
    }

    const comment: BlogComment = {
      slug: slug || (id !== undefined ? id : ""),
      content,
      nickname,
      email,
      website: website || undefined,
    };

    if (id !== undefined) {
      comment.noteId = id;
    }

    if (isReply) {
      comment.parentId = parent.id;
      comment.rootId = parent.rootId ?? parent.id;
      comment.replyNickname = parent.nickname;
    }

    startTransition(async () => {
      try {
        await addBlogComment(comment);
        setSuccess(true);
        form.reset();
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`comment-form ${isReply ? "comment-form--reply" : ""}`}
    >
      {isReply && (
        <div className="mb-3 flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>
            回复{" "}
            <strong className="text-[var(--text)]">{parent.nickname}</strong>
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          >
            取消
          </button>
        </div>
      )}

      {!isReply && (
        <h3 className="comment-form__title">发表评论</h3>
      )}

      <div className="comment-form__fields">
        <div className="comment-form__field">
          <label htmlFor="nickname" className="comment-form__label">
            昵称 <span className="comment-form__required">*</span>
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            className="comment-form__input"
            placeholder="你的昵称"
            maxLength={32}
            required
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="email" className="comment-form__label">
            邮箱 <span className="comment-form__required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="comment-form__input"
            placeholder="your@email.com"
            maxLength={128}
            required
          />
        </div>

        <div className="comment-form__field">
          <label htmlFor="website" className="comment-form__label">
            网站
          </label>
          <input
            id="website"
            name="website"
            type="url"
            className="comment-form__input"
            placeholder="https://"
            maxLength={256}
          />
        </div>
      </div>

      <div className="comment-form__field">
        <label htmlFor="content" className="comment-form__label sr-only">
          评论内容
        </label>
        <textarea
          id="content"
          name="content"
          className="comment-form__textarea"
          rows={isReply ? 3 : 4}
          placeholder={isReply ? "写下你的回复…" : "写下你的评论…"}
          maxLength={2000}
          required
        />
      </div>

      {error && (
        <p className="comment-form__error" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="comment-form__success" role="status">
          {isReply ? "回复已提交" : "评论已提交，审核通过后将显示"}
        </p>
      )}

      <button
        type="submit"
        className="comment-form__submit"
        disabled={pending}
      >
        {pending
          ? "提交中…"
          : isReply
            ? "提交回复"
            : "提交评论"}
      </button>
    </form>
  );
}
