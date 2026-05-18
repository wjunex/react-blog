import { getBlogCommentTree } from "@/api";
import CommentList from "./CommentList";
import { BlogComment } from "@/api/types";

// ---------- types ----------

type CommentSectionProps = {
  slug: string;
};

// ---------- component ----------

export default async function CommentSection({ slug }: CommentSectionProps) {
  let initialComments: BlogComment[];

  try {
    initialComments = await getBlogCommentTree({ slug });
  } catch {
    initialComments = [];
  }

  return <CommentList slug={slug} initialComments={initialComments} />;
}
