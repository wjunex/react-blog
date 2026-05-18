import { getBlogCommentTree } from "@/api";
import CommentList from "./CommentList";
import { BlogComment } from "@/api/types";

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

  return (
    <CommentList slug={slug} id={id} initialComments={initialComments} />
  );
}
