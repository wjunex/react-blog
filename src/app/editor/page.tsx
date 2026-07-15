import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { apiPublicDetail } from "@/api/generated";
import { getServerToken } from "@/lib/token-server";
import EditorPageInner from "./EditorPageClient";

export const metadata: Metadata = { title: "编辑文章" };

interface Props {
  searchParams: Promise<{ slug?: string; id?: string; type?: string }>;
}

export default async function EditorPage({ searchParams }: Props) {
  if (!(await getServerToken())) {
    redirect("/login");
  }

  const { slug, id, type } = await searchParams;
  let article = null;

  if (slug || id) {
    try {
      article = await apiPublicDetail(slug ? { slug } : { id });
    } catch {
      // 文章不存在，按新建处理
    }
  }

  return <EditorPageInner initialArticle={article} initialType={Number(type) || undefined} />;
}
