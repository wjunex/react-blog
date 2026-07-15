"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiTodoDelete, apiTodoSave } from "@/api/generated";
import type { TodoTreeDTO } from "@/api/generated/models";

export default function TodoList({ initialTodos }: { initialTodos: TodoTreeDTO[] }) {
  const router = useRouter();
  const [todos, setTodos] = useState(initialTodos);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const add = async () => {
    const title = newTitle.trim();
    if (!title || adding) return;
    setAdding(true);
    try {
      const result = await apiTodoSave({ title });
      setTodos((prev) => [...prev, result]);
      setNewTitle("");
      router.refresh();
    } finally {
      setAdding(false);
    }
  };

  const toggle = async (item: TodoTreeDTO) => {
    const nextStatus = item.status === 1 ? 0 : 1;
    await apiTodoSave({ id: item.id, title: item.title!, status: nextStatus });
    setTodos((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, status: nextStatus } : t)),
    );
    router.refresh();
  };

  const del = async (id: string) => {
    await apiTodoDelete({ id });
    setTodos((prev) => prev.filter((t) => t.id !== id));
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder="添加新待办..."
          className="flex-1 rounded-lg border border-(--border) bg-(--surface-muted) px-3 py-2 text-sm text-(--text) outline-none focus:border-(--accent) transition-colors"
        />
        <button
          onClick={add}
          disabled={adding || !newTitle.trim()}
          className="px-4 py-2 text-xs rounded-lg bg-(--accent) text-white font-medium hover:opacity-85 transition-opacity disabled:opacity-50 shrink-0"
        >
          {adding ? "添加中..." : "添加"}
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="py-12 text-center text-sm text-(--text-muted)">暂无待办</p>
      ) : (
        <div className="space-y-1">
          {[...todos].sort((a, b) => (a.status ?? 0) - (b.status ?? 0)).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-(--surface-muted) group"
            >
              <button
                onClick={() => toggle(item)}
                className={`shrink-0 w-4 h-4 rounded-full border-2 transition-colors cursor-pointer ${
                  item.status === 1
                    ? "bg-(--accent) border-(--accent)"
                    : "border-(--border-strong) hover:border-(--accent)"
                }`}
              />
              <span
                className={`flex-1 text-sm text-(--text) ${
                  item.status === 1 ? "line-through text-(--text-muted)" : ""
                }`}
              >
                {item.title}
              </span>
              <button
                onClick={() => del(item.id!)}
                className="shrink-0 text-xs text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity hover:text-(--syntax-red)"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
