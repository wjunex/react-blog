import { apiPublicDetail } from "@/api/generated";
import EditorPageInner from "./EditorPageClient";

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function EditorPage({ searchParams }: Props) {
  const { slug } = await searchParams;
  let article = null;

  if (slug) {
    try {
      article = await apiPublicDetail({ slug });
    } catch {
      // slug 对应的文章不存在，按新建处理
    }
  }

  return <EditorPageInner initialArticle={article} />;
}
