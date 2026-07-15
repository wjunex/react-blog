import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { apiNotifyList } from "@/api/generated";
import { getServerToken } from "@/lib/token-server";
import { formatDate, DATE_TIME } from "@/utils";
import NotifyActions from "./NotifyActions";

export const metadata: Metadata = { title: "通知" };

export default async function NotificationsPage() {
  if (!(await getServerToken())) {
    redirect("/login");
  }

  const list = (await apiNotifyList()) || [];

  return (
    <section className="space-y-6">
      <div className="border-b border-(--border) pb-6">
        <p className="text-sm font-medium text-(--accent)">Notifications</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-(--text)">
          通知
        </h1>
      </div>

      {list.length === 0 ? (
        <p className="py-12 text-center text-sm text-(--text-muted)">暂无通知</p>
      ) : (
        <div className="space-y-1">
          {list.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 rounded-lg px-3 py-3 transition-colors ${
                item.read ? "" : "bg-(--surface-muted)"
              }`}
            >
              {!item.read && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-(--accent)" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-(--text)">{item.content}</p>
                <p className="mt-1 text-xs text-(--text-muted)">
                  {formatDate(item.createdAt, DATE_TIME)}
                </p>
              </div>
              <NotifyActions id={item.id!} read={item.read} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
