import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "@/assets/styles/globals.css";
import Layout from "@/layout/Layout";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "wjun · blog",
    template: "%s | wjun · blog",
  },
  description: "个人博客，记录技术笔记、生活思考和阶段性想法",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "wjun · blog",
    title: "wjun · blog",
    description: "个人博客，记录技术笔记、生活思考和阶段性想法",
  },
  twitter: {
    card: "summary_large_image",
  },
  keywords: ["博客", "技术", "前端", "React", "Next.js", "Web开发"],
};

const themeScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("theme");
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Script
          id="baidu-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var _hmt = _hmt || [];
                    (function() {
                      var hm = document.createElement("script");
                      hm.src = "https://hm.baidu.com/hm.js?947029a7f30f3f565abaafca23a90358";
                      var s = document.getElementsByTagName("script")[0];
                      s.parentNode.insertBefore(hm, s);
                    })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="var(--accent)" showSpinner={false} />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
