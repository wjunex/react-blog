import { BlogItem } from "@/api/types";
import Link from "next/link";

export default async function ListItem({ item }: { item: BlogItem }) {
  return (
    <div>
      <Link href={`/blog/${item.id}`}>{item.title}</Link>
    </div>
  );
}
