import { getBlogList } from "@/api";
import ListItem from "./ListItem";

export default async function List() {
  const { records } = await getBlogList({
    pageSize: 1000,
  });

  return (
    <section className="space-y-6">
      <div className="border-b border-[#d8dee4] pb-6">
        <p className="text-sm font-medium text-[#0969da]">Latest Posts</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#1f2328]">
          文章
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#656d76]">
          记录技术、生活和一些阶段性的想法。
        </p>
      </div>
      <div className="divide-y divide-[#d8dee4]">
      {records.map((item) => {
        return <ListItem key={item.id} item={item} />;
      })}
      </div>
    </section>
  );
}
