import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/token-server";
import { apiPublicDetail } from "@/api/generated";
import PublishForm from "./PublishForm";

export const metadata: Metadata = { title: "发布动态" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewMomentPage({ searchParams }: Props) {
  if (!(await getServerToken())) {
    redirect("/login");
  }

  const { id } = await searchParams;
  let initialContent = "";
  let initialImages: string[] = [];
  let editingId = "";

  if (id) {
    try {
      const data = await apiPublicDetail({ id });
      initialContent = data.content || "";
      initialImages = data.images || [];
      editingId = data.id || "";
    } catch {
      // 不存在按新建处理
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <PublishForm initialContent={initialContent} initialImages={initialImages} id={editingId || undefined} />
    </section>
  );
}
