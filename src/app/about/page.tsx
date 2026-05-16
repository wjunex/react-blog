import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this blog",
};

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <div className="border-b border-[#d8dee4] pb-6">
        <p className="text-sm font-medium text-[#0969da]">About</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f2328]">
          关于这个博客
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#656d76]">
          这里收集一些技术笔记、生活记录和阶段性的想法。
        </p>
      </div>
      <div className="rounded-xl border border-[#d8dee4] bg-[#f6f8fa] p-5 text-sm leading-7 text-[#57606a]">
        <p>
          希望它保持轻巧、清晰，也足够安静。文章页会优先服务阅读体验，列表页则尽量让内容本身成为视觉重心。
        </p>
      </div>
    </section>
  );
}
