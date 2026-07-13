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
  let editingId = "";

  if (id) {
    try {
      const data = await apiPublicDetail({ id });
      initialContent = data.content || "";
      editingId = data.id || "";
    } catch {
      // 不存在按新建处理
    }
  }

  return (
    <section className="mx-auto max-w-xl space-y-8 py-12">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Moments</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          {editingId ? "编辑动态" : "发布动态"}
        </h1>
      </div>
      <PublishForm initialContent={initialContent} id={editingId || undefined} />
    </section>
  );
}
