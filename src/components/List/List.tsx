import { getBlogList } from "@/api";
import ListItem from "./ListItem";

export default async function List() {
  const { records } = await getBlogList({
    pageSize: 20,
  });

  return (
    <>
      {records.map((item) => {
        return <ListItem key={item.id} item={item} />;
      })}
    </>
  );
}
