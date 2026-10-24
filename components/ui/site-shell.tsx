import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

/**
 * The page frame for every route other than the homepage — and the same
 * 860px column the homepage uses, so moving between pages never shifts the
 * left edge. `wide` opens it to 1080px; nothing uses it now — every page
 * sits on the same column so the navbar never changes width between pages.
 */
export function SiteShell({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <>
      <Navbar wide={wide} />
      <main
        className={`mx-auto min-h-screen px-5 sm:px-8 ${
          wide ? "max-w-[1080px]" : "max-w-[860px]"
        }`}
      >
        {children}
        <Footer />
      </main>
    </>
  );
}
