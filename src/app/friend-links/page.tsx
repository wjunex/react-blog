import { Metadata } from "next";
import FriendLinkSection from "@/components/FriendLink/FriendLinkSection";

export const metadata: Metadata = {
  title: "友链",
  description: "友情链接",
};

export default function FriendLinks() {
  return (
    <section className="space-y-10">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Links</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-(--text)">
          友链
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-(--text-muted)">
          欢迎互加友链，提交申请后审核通过即可展示。
        </p>
      </div>

      <FriendLinkSection />
    </section>
  );
}
