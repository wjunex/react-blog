import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const list = [
    { title: "首页", path: "/" },
    { title: "动态", path: "/moments" },
    { title: "关于", path: "/about" },
  ];

  return (
    <header className="flex items-center border-b border-(--border) bg-(--surface-muted-alpha) px-5 py-4 backdrop-blur sm:px-8 lg:px-14">
      <div className="mr-4 flex-1 select-none">
        <Link
          href="/"
          className="inline-flex items-baseline gap-2 text-[24px] font-semibold tracking-tight text-(--text) transition-colors hover:text-(--accent)"
        >
          <span>𝑾𝑱𝑼𝑵</span>
          <span className="hidden text-sm font-normal text-(--text-muted) sm:inline">
            blog
          </span>
        </Link>
      </div>
      <nav className="flex items-center gap-1" aria-label="Primary">
        {list.map((item) => {
          return (
            <Link
              key={item.path}
              className="rounded-md px-3 py-2 text-sm font-medium text-(--text-soft) transition-colors hover:bg-(--surface) hover:text-(--accent)"
              href={item.path}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="ml-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
