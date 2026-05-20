import { BlogItem as BlogItemType } from "@/api/types";
import Link from "next/link";
import { formatDate, DATE_TIME } from "@/utils";

/** 简洁对话气泡图标 */
function CommentIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
      <path d="M8 2C4.686 2 2 4.24 2 7c0 1.526.723 2.91 1.89 3.86L3 14l2.84-1.417c.696.268 1.45.417 2.16.417 3.314 0 6-2.24 6-5s-2.686-5-6-5z" />
    </svg>
  );
}

/** 简洁爱心图标 */
function LikeIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
      <path d="M8 3.5C6.5 1.5 3 1.5 3 5c0 2.5 5 7.5 5 7.5S13 7.5 13 5c0-3.5-3.5-3.5-5-1.5z" />
    </svg>
  );
}

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
