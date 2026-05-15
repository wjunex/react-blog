import Image from "next/image";

export default function Footer() {
  return (
    <footer className="card flex-col flex items-center justify-center gap-1 text-xs">
      <div className="flex items-center gap-1">
        <a
          href="https://beian.mps.gov.cn/#/query/webSearch?code=52230102000488"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        >
          <Image
            src="https://img.wjun.me/upload-1747114767780-1336.png"
            width={14}
            height={14}
            alt="beian"
          />

          <span>贵公网安备52230102000488号</span>
        </a>
      </div>

      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
      >
        黔ICP备2024042286号-2
      </a>

      <span>© 2024–2026 wjun.me · Built by Jun Wang</span>
    </footer>
  );
}
