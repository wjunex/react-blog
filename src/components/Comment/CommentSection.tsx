import { getBlogCommentTree, getBloggerInfo } from "@/api";
import { getToken } from "@/lib/auth";
import CommentList from "./CommentList";
import type { BlogComment, BloggerInfo } from "@/api/types";

// ---------- types ----------

type CommentSectionProps = {
  slug?: string;
  id?: string;
};

// ---------- component ----------

export default async function CommentSection({ slug, id }: CommentSectionProps) {
  let initialComments: BlogComment[];

  try {
    initialComments = await getBlogCommentTree(
      id !== undefined ? { id } : { slug: slug! },
    );
  } catch {
    initialComments = [];
  }

  let bloggerInfo: BloggerInfo | null = null;
  try {
    bloggerInfo = await getBloggerInfo();
  } catch {
    // 获取博主信息失败时不阻塞评论展示
  }

  const token = await getToken();
  const isLoggedIn = !!token;

  return (
    <CommentList
      slug={slug}
      id={id}
      initialComments={initialComments}
      bloggerInfo={bloggerInfo}
      isLoggedIn={isLoggedIn}
    />
  );
}
