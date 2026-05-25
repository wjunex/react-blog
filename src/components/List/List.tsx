import { apiPublicList, apiPublicMomentList } from "@/api/generated";
import BlogItem from "./BlogItem";
import MomentItem from "./MomentItem";
import Pagination from "./Pagination";

type ListProps = {
  pageNum: number;
  pageSize: number;
  type?: number;
  basePath?: string;
};

export default async function List({
  pageNum,
  pageSize,
  type,
  basePath = "/",
}: ListProps) {
  const result =
    type === 2
      ? await apiPublicMomentList({ pageNum, pageSize })
      : await apiPublicList({ pageNum, pageSize });

  const { records, total, current = pageNum, size = pageSize } = result;
  const pages = result.pages ?? Math.ceil(total! / size);

  return (
    <>
      <div className="divide-y divide-(--border)">
        {records!.map((item) => {
          if (type === 2) {
            return <MomentItem key={item.id} item={item} />;
          }
          return <BlogItem key={item.id} item={item} />;
        })}
      </div>
      <Pagination
        current={current!}
        pageSize={size}
        total={total!}
        pages={pages}
        basePath={basePath}
      />
    </>
  );
}
