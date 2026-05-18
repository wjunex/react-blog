"use client";

import type { BlogComment } from "@/api/types";
import { useState } from "react";
import CommentForm from "./CommentForm";

// ---------- types ----------

type CommentItemProps = {
  comment: BlogComment;
  slug: string;
  onRefresh: () => void;
};

// ---------- helpers ----------

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function avatarFallback(nickname?: string) {
  if (!nickname) return "?";
  return nickname.charAt(0).toUpperCase();
}

// ---------- component ----------

export default function CommentItem({
  comment,
  slug,
  onRefresh,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const hasChildren = comment.children && comment.children.length > 0;

  const avatar = comment.avatar
    ? comment.avatar
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(comment.nickname ?? "?")}`;

  return (
    <div className="comment-item">
      <div className="comment-item__card">
        {/* 头像 */}
        <div className="comment-item__avatar">
          <img
            src={avatar}
            alt={comment.nickname ?? ""}
            width={40}
            height={40}
            loading="lazy"
          />
        </div>

        {/* 主体 */}
        <div className="comment-item__body">
          {/* 头部信息 */}
          <div className="comment-item__header">
            <div className="comment-item__meta">
              {comment.website ? (
                <a
                  href={comment.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comment-item__nickname"
                >
                  {comment.nickname}
                </a>
              ) : (
                <span className="comment-item__nickname">
                  {comment.nickname}
                </span>
              )}

              {comment.replyNickname && (
                <>
                  <span className="comment-item__reply-icon">→</span>
                  <span className="comment-item__reply-to">
                    {comment.replyNickname}
                  </span>
                </>
              )}

              {comment.ipLocation && (
                <span className="comment-item__location">
                  {comment.ipLocation}
                </span>
              )}

              <time
                className="comment-item__time"
                dateTime={comment.createdTime}
              >
                {formatDate(comment.createdTime)}
              </time>
            </div>
          </div>

          {/* 内容 */}
          <div className="comment-item__content">{comment.content}</div>

          {/* 底部操作 */}
          <div className="comment-item__actions">
            <button
              type="button"
              onClick={() => setShowReply(!showReply)}
              className="comment-item__action-btn"
            >
              回复
            </button>

            {comment.likeCount != null && comment.likeCount > 0 && (
              <span className="comment-item__likes">
                👍 {comment.likeCount}
              </span>
            )}
          </div>

          {/* 内联回复表单 */}
          {showReply && (
            <div className="comment-item__reply-form">
              <CommentForm
                slug={slug}
                parent={{
                  id: comment.id,
                  rootId: comment.rootId,
                  nickname: comment.nickname,
                }}
                onSuccess={() => {
                  setShowReply(false);
                  onRefresh();
                }}
                onCancel={() => setShowReply(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* 子评论 */}
      {hasChildren && (
        <div className="comment-item__children">
          {comment.children!.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              slug={slug}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
