import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-(--border) bg-(--surface-muted-alpha) px-5 py-6 text-xs text-(--text-muted) sm:px-8 lg:px-14">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>© 2024-2026 wjun.me · Built by Jun Wang</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=52230102000488"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-(--accent)"
          >
            <Image
              src="https://img.wjun.me/upload-1747114767780-1336.png"
              width={14}
              height={14}
              alt="beian"
            />
            <span>贵公网安备52230102000488号</span>
          </a>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-(--accent)"
          >
            黔ICP备2024042286号-2
          </a>
        </div>
      </div>
    </footer>
  );
}
