import { getBlogCommentTree } from "@/api";
import CommentList from "./CommentList";

// ---------- types ----------

type CommentSectionProps = {
  slug: string;
};

// ---------- component ----------

export default async function CommentSection({ slug }: CommentSectionProps) {
  let initialComments;

  try {
    initialComments = await getBlogCommentTree({ slug });
  } catch {
    initialComments = [];
  }

  return <CommentList slug={slug} initialComments={initialComments} />;
}
