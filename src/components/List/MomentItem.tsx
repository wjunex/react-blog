import { BlogItem as BlogItemType } from "@/api/types";
import Link from "next/link";
import { formatDate, DATE_TIME } from "@/utils";
import { CommentIcon, LikeIcon } from "@/components/Icons";

export default function MomentItem({ item }: { item: BlogItemType }) {
  const date = formatDate(item.createdTime, DATE_TIME);
  const href = `/moments/${item.id}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link href={href}>
        <div className="mt-3 line-clamp-3 leading-7 text-(--text-soft)">
          {item.content}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-(--text-muted)">
          {date ? <time dateTime={item.createdTime}>{date}</time> : null}
          {item.categoryName ? (
            <span className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-(--text-soft)">
              {item.categoryName}
            </span>
          ) : null}
          {item.commentCount != null && (
            <span className="inline-flex items-center gap-1">
              <CommentIcon />
              <span>{item.commentCount}</span>
            </span>
          )}
          {item.likes != null && (
            <span className="inline-flex items-center gap-1">
              <LikeIcon />
              <span>{item.likes}</span>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
