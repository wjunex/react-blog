import { apiPublicCommentTree, apiPublicUserInfo } from "@/api/generated";
import { getServerToken } from "@/lib/token-server";
import CommentList from "./CommentList";
import type { NoteCommentVO, UserVO } from "@/api/generated/models";

// ---------- types ----------

type CommentSectionProps = {
  slug?: string;
  id?: string;
};

// ---------- component ----------

export default async function CommentSection({ slug, id }: CommentSectionProps) {
  let initialComments: NoteCommentVO[];

  try {
    initialComments = await apiPublicCommentTree(
      id !== undefined ? { id } : { slug: slug! },
    );
  } catch {
    initialComments = [];
  }

  let bloggerInfo: UserVO | null = null;
  try {
    bloggerInfo = await apiPublicUserInfo();
  } catch {
    // 获取博主信息失败时不阻塞评论展示
  }

  const token = await getServerToken();
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
