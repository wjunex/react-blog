import type { NoteListVO } from "@/api/generated/models";
type BlogItemType = NoteListVO;
import { apiPublicUserInfo } from "@/api/generated";
import Link from "next/link";
import { formatDate, DATE_TIME_WEEKDAY } from "@/utils";
import { CommentIcon, LikeIcon } from "@/components/Icons";
import Image from "next/image";

export default async function MomentItem({ item }: { item: BlogItemType }) {
  const blogger = await apiPublicUserInfo();
  const date = formatDate(item.createdTime, DATE_TIME_WEEKDAY);
  const href = `/moments/${item.id}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link href={href}>
        <div className="flex items-start gap-3">
          <Image
            src={blogger.avatar!}
            alt={blogger.username!}
            width={40}
            height={40}
            className="shrink-0 rounded-full border-2 border-(--border-strong)"
            priority
          />

          <div className="min-w-0">
            <span className="text-sm font-semibold text-(--text)">
              {blogger.username}
            </span>
            <div className="mt-2 line-clamp-3 leading-7 text-(--text-soft)">
              {item.content}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-(--text-muted)">
              {date ? <time dateTime={item.createdTime}>{date}</time> : null}
              {item.categoryName ? (
                <span className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-(--text-soft)">
                  {item.categoryName}
                </span>
              ) : null}
              {item.commentCount != null && item.commentCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <CommentIcon />
                  <span>{item.commentCount}</span>
                </span>
              )}
              {item.likes != null && item.likes > 0 && (
                <span className="inline-flex items-center gap-1">
                  <LikeIcon />
                  <span>{item.likes}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
