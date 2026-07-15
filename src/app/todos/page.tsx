import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { apiTodoTree } from "@/api/generated";
import { getServerToken } from "@/lib/token-server";
import TodoList from "./TodoList";

export const metadata: Metadata = { title: "待办" };

export default async function TodosPage() {
  if (!(await getServerToken())) {
    redirect("/login");
  }

  const todos = (await apiTodoTree()) || [];

  return (
    <section className="space-y-6">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Todo</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          待办
        </h1>
      </div>
      <TodoList initialTodos={todos} />
    </section>
  );
}
