import Link from "next/link";

export default function NavBar() {
  const list = [
    { title: "首页", path: "/" },
    { title: "文章", path: "/list" },
    { title: "动态", path: "/moments" },
    { title: "归档", path: "/archives" },
    { title: "关于", path: "/about" },
  ];

  return (
    <header className="h-12.5  py-0! flex items-center ">
      <div className="text-[26px] select-none cursor-pointer mr-4 flex-1">
        <div>𝑾𝑱𝑼𝑵</div>
      </div>
      <div className="flex items-center gap-2">
        {list.map((item, index) => {
          return (
            <Link
              key={index}
              className="cursor-pointer select-none text-[#999] transition-all duration-300"
              href={item.path}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
