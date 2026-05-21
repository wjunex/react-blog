"use client";

import { useState, useCallback, useEffect } from "react";
import { getBlogCommentTree } from "@/api";
import type { BlogComment } from "@/api/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

// ---------- localStorage helpers ----------

function loadPending(key: string): BlogComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePending(key: string, list: BlogComment[]) {
  if (typeof window === "undefined") return;
  try {
    if (list.length > 0) {
      localStorage.setItem(key, JSON.stringify(list));
    } else {
      localStorage.removeItem(key);
    }
  } catch {}
}

// ---------- types ----------

type CommentListProps = {
  slug?: string;
  id?: string;
  initialComments: BlogComment[];
};

// ---------- helpers ----------

function countAll(comments: BlogComment[]): number {
  return comments.reduce((sum, c) => {
    return sum + 1 + (c.children ? countAll(c.children) : 0);
  }, 0);
}

function findCommentById(comments: BlogComment[], id?: string): boolean {
  if (!id) return false;
  for (const c of comments) {
    if (c.id === id) return true;
    if (c.children && findCommentById(c.children, id)) return true;
  }
  return false;
}

// ---------- component ----------

export default function CommentList({
  slug,
  id,
  initialComments,
}: CommentListProps) {
  const storageKey = `pending-comments-${slug || id}`;
  const [comments, setComments] = useState(initialComments);
  const [pendingComments, setPendingComments] = useState<BlogComment[]>([]);
  const [ready, setReady] = useState(false);

  // 仅在客户端挂载后从 localStorage 恢复，确保 hydration 时与服务端一致
  useEffect(() => {
    const stored = loadPending(storageKey);
    if (stored.length > 0) {
      const filtered = stored.filter(
        (pc) => !findCommentById(comments, pc.id),
      );
      if (filtered.length !== stored.length) savePending(storageKey, filtered);
      // eslint-disable-next-line
      setPendingComments(filtered);
    }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 同步到 localStorage
  useEffect(() => {
    if (!ready) return;
    savePending(storageKey, pendingComments);
  }, [ready, pendingComments, storageKey]);

  const refresh = useCallback(async () => {
    try {
      const fresh = await getBlogCommentTree(
        id !== undefined ? { id } : { slug: slug! },
      );
      setComments(fresh);
      setPendingComments((prev) =>
        prev.filter((pc) => !findCommentById(fresh, pc.id)),
      );
    } catch {
      // 静默失败 —— 刷新失败不破坏已有 UI
    }
  }, [slug, id]);

  const handleNewComment = useCallback((comment: BlogComment) => {
    setPendingComments((prev) => [comment, ...prev]);
    refresh();
  }, [refresh]);

  const total = countAll(comments) + (ready ? pendingComments.length : 0);

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__title">评论</h2>
        {total > 0 && <span className="comment-section__count">{total}</span>}
      </div>

      {/* 评论树（含本地待审核评论） */}
      {(comments.length > 0 || (ready && pendingComments.length > 0)) && (
        <div className="comment-section__list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              id={id}
              onRefresh={refresh}
            />
          ))}
          {ready &&
            pendingComments.map((comment) => (
              <CommentItem
                key={`pending-${comment.id}`}
                comment={comment}
                slug={slug}
                id={id}
                onRefresh={refresh}
              />
            ))}
        </div>
      )}

      {/* 一级评论表单 */}
      {(slug || id !== undefined) && (
        <CommentForm slug={slug} id={id} onSuccess={handleNewComment} />
      )}
    </section>
  );
}
