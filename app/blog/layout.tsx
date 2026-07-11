import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="border-border mx-auto min-h-screen max-w-[1200px] border-x">
        {children}
        <Footer />
      </main>
    </>
  );
}
