import { getBlogList } from "@/api";
import ListItem from "./ListItem";
import Pagination from "./Pagination";

type ListProps = {
  pageNum: number;
  pageSize: number;
};

export default async function List({ pageNum, pageSize }: ListProps) {
  const result = await getBlogList({
    pageNum,
    pageSize,
  });
  const { records, total, current = pageNum, size = pageSize } = result;
  const pages = result.pages ?? Math.ceil(total / size);

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
      <Pagination
        current={current}
        pageSize={size}
        total={total}
        pages={pages}
      />
    </section>
  );
}
