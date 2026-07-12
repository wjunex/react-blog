import { apiPublicFriendLinkList, apiPublicUserInfo } from "@/api/generated";
import type { FriendLink, UserVO } from "@/api/generated/models";
import FriendLinkForm from "./FriendLinkForm";

export default async function FriendLinkSection() {
  const [linksResult, bloggerInfo] = await Promise.allSettled([
    apiPublicFriendLinkList(),
    apiPublicUserInfo(),
  ]);

  const links: FriendLink[] =
    linksResult.status === "fulfilled" ? linksResult.value : [];
  const blogger: UserVO | null =
    bloggerInfo.status === "fulfilled" ? bloggerInfo.value : null;

  const approved = (links || []).filter((l) => l.status === 1);

  return (
    <div>
      <h2 className="mb-6 text-sm font-medium text-(--text-soft)">友链</h2>

      {approved.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--surface-muted) p-3 transition-colors hover:border-(--accent)"
            >
              <img
                src={
                  link.logo
                    ? link.logo
                    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(link.name?.slice(0, 1) ?? "?")}`
                }
                alt={link.name ?? ""}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <span className="text-xs font-medium text-(--text)">
                  {link.name}
                </span>
                {
                  <p className=" text-[10px] text-(--text-muted) line-clamp-2">
                    {link.description || `暂无描述`}
                  </p>
                }
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-xs text-(--text-muted)">暂无友链</p>
      )}

      <hr className="my-12 border-(--border)" />
      <FriendLinkForm bloggerInfo={blogger} />
    </div>
  );
}
