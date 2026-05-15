import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this blog",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-8 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          About
        </h1>

        <div className="flex flex-col gap-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          <p>
            Welcome to this blog — a place to write, share, and explore ideas.
            Built with Next.js and Tailwind CSS.
          </p>
          <p>
            This project was bootstrapped with{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              create-next-app
            </code>{" "}
            and serves as a clean starting point for a personal blog or
            content-driven site.
          </p>
        </div>
      </main>
    </div>
  );
}
