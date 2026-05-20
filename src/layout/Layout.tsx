import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--surface) shadow-[var(--shadow)] lg:min-h-[calc(100vh-80px)]">
        <NavBar />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
