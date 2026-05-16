import Link from "next/link";

export default function NavBar() {
  const list = [
    { title: "首页", path: "/" },
    { title: "关于", path: "/about" },
  ];

  return (
    <header className="flex items-center border-b border-[#d8dee4] bg-[#f6f8fa]/80 px-5 py-4 backdrop-blur sm:px-8 lg:px-14">
      <div className="mr-4 flex-1 select-none">
        <Link
          href="/"
          className="inline-flex items-baseline gap-2 text-[24px] font-semibold tracking-tight text-[#1f2328] transition-colors hover:text-[#0969da]"
        >
          <span>𝑾𝑱𝑼𝑵</span>
          <span className="hidden text-sm font-normal text-[#656d76] sm:inline">
            blog
          </span>
        </Link>
      </div>
      <nav className="flex items-center gap-1" aria-label="Primary">
        {list.map((item) => {
          return (
            <Link
              key={item.path}
              className="rounded-md px-3 py-2 text-sm font-medium text-[#57606a] transition-colors hover:bg-white hover:text-[#0969da]"
              href={item.path}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
