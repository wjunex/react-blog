"use client";

import type { NoteCommentVO, UserVO } from "@/api/generated/models";
import { useState, useMemo, useEffect } from "react";
import CommentForm from "./CommentForm";
import { formatDate, DATE_TIME } from "@/utils";

// ---------- types ----------

type CommentItemProps = {
  comment: NoteCommentVO;
  slug?: string;
  id?: string;
  onRefresh: () => void;
  bloggerInfo?: UserVO | null;
  isLoggedIn?: boolean;
};

// ---------- component ----------

export default function CommentItem({
  comment,
  slug,
  id,
  onRefresh,
  bloggerInfo,
  isLoggedIn,
}: CommentItemProps) {
  const replyStorageKey = `pending-replies-${comment.id}`;

  const [showReply, setShowReply] = useState(false);
  const [pendingReplies, setPendingReplies] = useState<NoteCommentVO[]>([]);
  const [ready, setReady] = useState(false);

  // 仅在客户端挂载后从 localStorage 恢复
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(replyStorageKey);
      if (raw) {
        const stored = JSON.parse(raw) as NoteCommentVO[];
        const filtered = stored.filter(
          (pr) => !(comment.children || []).some((c) => c.id === pr.id),
        );
        // eslint-disable-next-line
        setPendingReplies(filtered);
        if (filtered.length !== stored.length) {
          if (filtered.length > 0) {
            localStorage.setItem(replyStorageKey, JSON.stringify(filtered));
          } else {
            localStorage.removeItem(replyStorageKey);
          }
        }
      }
    } catch {}
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 同步到 localStorage
  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    try {
      if (pendingReplies.length > 0) {
        localStorage.setItem(replyStorageKey, JSON.stringify(pendingReplies));
      } else {
        localStorage.removeItem(replyStorageKey);
      }
    } catch {}
  }, [ready, pendingReplies, replyStorageKey]);

  const isPending = comment.status !== 1;
  const isBlogger = !!(
    bloggerInfo &&
    comment.userId &&
    comment.userId === bloggerInfo.id
  );

  // 过滤掉已审核通过（出现在服务端 children 中）的本地待审核回复
  const displayPendingReplies = useMemo(
    () =>
      ready
        ? pendingReplies.filter(
            (pr) => !(comment.children || []).some((c) => c.id === pr.id),
          )
        : [],
    [ready, pendingReplies, comment.children],
  );

  const hasChildren =
    (comment.children && comment.children.length > 0) ||
    (ready && displayPendingReplies.length > 0);

  const displayName = isBlogger ? bloggerInfo!.username : comment.nickname;
  const avatar = isBlogger
    ? bloggerInfo!.avatar
    : comment.avatar
      ? comment.avatar
      : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(comment.nickname?.slice(0, 1) ?? "?")}`;

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
              {comment.website && !isBlogger ? (
                <a
                  href={comment.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="comment-item__nickname"
                >
                  {displayName}
                </a>
              ) : (
                <span className="comment-item__nickname">
                  {displayName}
                </span>
              )}
              {isBlogger && (
                <span className="comment-item__blogger-label">博主</span>
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
                dateTime={comment.createdAt}
              >
                {formatDate(comment.createdAt, DATE_TIME)}
              </time>

              {isPending && (
                <span className="comment-item__pending-badge">审核中</span>
              )}
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
                id={id}
                parent={{
                  id: comment.id,
                  rootId: comment.rootId,
                  nickname: comment.nickname,
                }}
                onSuccess={(newComment) => {
                  setShowReply(false);
                  setPendingReplies((prev) => [...prev, newComment]);
                  onRefresh();
                }}
                onCancel={() => setShowReply(false)}
                bloggerInfo={bloggerInfo}
                isLoggedIn={isLoggedIn}
              />
            </div>
          )}
        </div>
      </div>

      {/* 子评论 */}
      {hasChildren && (
        <div className="comment-item__children">
          {(comment.children || []).map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              slug={slug}
              id={id}
              onRefresh={onRefresh}
              bloggerInfo={bloggerInfo}
              isLoggedIn={isLoggedIn}
            />
          ))}
          {displayPendingReplies.map((child) => (
            <CommentItem
              key={`pending-${child.id}`}
              comment={child}
              slug={slug}
              id={id}
              onRefresh={onRefresh}
              bloggerInfo={bloggerInfo}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}
