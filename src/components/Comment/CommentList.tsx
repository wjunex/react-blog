"use client";

import { useState, useCallback } from "react";
import { getBlogCommentTree } from "@/api";
import type { BlogComment } from "@/api/types";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

// ---------- types ----------

type CommentListProps = {
  slug: string;
  initialComments: BlogComment[];
};

// ---------- helpers ----------

function countAll(comments: BlogComment[]): number {
  return comments.reduce((sum, c) => {
    return sum + 1 + (c.children ? countAll(c.children) : 0);
  }, 0);
}

// ---------- component ----------

export default function CommentList({
  slug,
  initialComments,
}: CommentListProps) {
  const [comments, setComments] = useState(initialComments);

  const refresh = useCallback(async () => {
    try {
      const fresh = await getBlogCommentTree({ slug });
      setComments(fresh);
    } catch {
      // 静默失败 —— 刷新失败不破坏已有 UI
    }
  }, [slug]);

  const total = countAll(comments);

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <h2 className="comment-section__title">评论</h2>
        {total > 0 && (
          <span className="comment-section__count">{total}</span>
        )}
      </div>

      {/* 一级评论表单 */}
      <CommentForm slug={slug} onSuccess={refresh} />

      {/* 评论树 */}
      {comments.length > 0 && (
        <div className="comment-section__list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              slug={slug}
              onRefresh={refresh}
            />
          ))}
        </div>
      )}
    </section>
  );
}
