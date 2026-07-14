import type { NoteListVO } from "@/api/generated/models";
type BlogItemType = NoteListVO;
import Link from "next/link";
import { formatDate } from "@/utils";
import { CommentIcon, LikeIcon } from "@/components/Icons";

export default function BlogItem({ item }: { item: BlogItemType }) {
  const date = formatDate(item.createdAt);
  const href = `/blog/${item.slug}`;

  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <div className="flex items-center gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-(--text-muted)">
            {date ? <time dateTime={item.createdAt}>{date}</time> : null}
            {item.categoryName && item.categoryId ? (
              <Link
                href={`/search?categoryId=${item.categoryId}`}
                className="rounded-full border border-(--border-strong) bg-(--surface-muted) px-2 py-0.5 text-(--text-soft) transition-colors hover:border-(--accent) hover:text-(--accent)"
              >
                {item.categoryName}
              </Link>
            ) : null}
            {item.tags?.map((tag) => (
              <Link
                key={tag.id}
                href={`/search?tagId=${tag.id}`}
                className="rounded-full border border-(--border) px-2 py-0.5 text-(--text-muted) transition-colors hover:border-(--accent) hover:text-(--accent)"
              >
                #{tag.name}
              </Link>
            ))}
            {item.textCount ? <span>{item.textCount} 字</span> : null}
            {item.views ? <span>{item.views} 阅读</span> : null}
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
          <h2 className="mt-3 text-xl font-semibold leading-snug tracking-tight text-(--text)">
            <Link
              href={href}
              className="transition-colors group-hover:text-(--accent)"
            >
              {item.title}
            </Link>
          </h2>
          {item.summary ? (
            <p className="mt-3 line-clamp-3 text-sm leading-7 text-(--text-soft)">
              {item.summary}
            </p>
          ) : null}
          <Link
            href={href}
            className="mt-4 inline-flex text-sm font-medium text-(--accent) transition-colors hover:text-(--accent-hover)"
          >
            阅读全文
          </Link>
        </div>
        {item.image && (
          <Link href={href} className="hidden shrink-0 sm:block">
            <img
              src={item.image}
              alt={item.title || ""}
              className="rounded-lg object-cover"
              style={{ width: 160, height: 96 }}
            />
          </Link>
        )}
      </div>
    </article>
  );
}
