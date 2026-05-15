import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="md:p-[20mm]">
        <div className="min-h-screen items-center flex flex-col mx-auto bg-white md:p-[20mm] max-w-[210mm]">
          <div className="flex-1 w-full flex gap-2">
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
              <NavBar />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
