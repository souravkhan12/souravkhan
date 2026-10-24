import type { Metadata } from "next";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/footer";

export const metadata: Metadata = {
  title: "offline",
  robots: { index: false, follow: false },
};

/** Served by the service worker when a navigation happens with no network. */
export default function OfflinePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-[860px] px-5 sm:px-8">
        <section className="flex min-h-[60vh] flex-col justify-center gap-4">
          <p className="font-code text-faint text-2xs">No connection</p>
          <h1 className="text-[30px] leading-[1.15] font-bold tracking-[-0.03em] sm:text-[40px]">
            You&apos;re offline.{" "}
            <span className="text-faint">
              Pages you&apos;ve already visited still work.
            </span>
          </h1>
          <p className="text-soft max-w-md text-base">
            Reconnect and this one will load.
          </p>
        </section>
        <Footer />
      </main>
    </>
  );
}
