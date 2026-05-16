import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-4 text-xl">抱歉，您访问的页面不存在</p>
      <Link href={"/"}>
        <button className="mt-6 px-4 py-2  text-black rounded ">
          返回首页
        </button>
      </Link>
    </div>
  );
}
