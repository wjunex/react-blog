import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import BackToTop from "@/components/BackToTop";
import { getServerToken } from "@/lib/token-server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = !!(await getServerToken());

  return (
    <div className="sm:min-h-screen sm:px-6 sm:py-5 lg:py-10">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col sm:overflow-hidden sm:min-h-[calc(100vh-40px)] sm:rounded-2xl sm:border sm:border-(--border) sm:bg-(--surface) sm:shadow-(--shadow) lg:min-h-[calc(100vh-80px)]">
        <NavBar />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
          <div className="mx-auto w-full max-w-3xl">{children}</div>
        </main>
        <Footer isLoggedIn={isLoggedIn} />
      </div>
      <BackToTop />
    </div>
  );
}
