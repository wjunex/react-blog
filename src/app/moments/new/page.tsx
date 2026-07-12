import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerToken } from "@/lib/token-server";
import PublishForm from "./PublishForm";

export const metadata: Metadata = { title: "发布动态" };

export default async function NewMomentPage() {
  if (!(await getServerToken())) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-xl space-y-8 py-12">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Moments</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          发布动态
        </h1>
      </div>
      <PublishForm />
    </section>
  );
}
