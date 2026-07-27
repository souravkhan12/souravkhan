import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

/**
 * The standard page frame for every route other than the homepage: navbar, a
 * 1200px hairline-bordered column, and the footer. Extracted so a new route
 * can't accidentally ship without the chrome (or without the max-width, which
 * makes the grid bands run off the side of the screen).
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
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
