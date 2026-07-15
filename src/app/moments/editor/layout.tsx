import type { Metadata } from "next";

export const metadata: Metadata = { title: "发布动态" };

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
