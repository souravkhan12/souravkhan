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
      <main className="border-border mx-auto min-h-screen max-w-[1200px] border-x">
        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-code text-soft text-xs">no connection</p>
          <h1 className="ss01 page-title">you&apos;re offline</h1>
          <p className="text-soft max-w-md text-sm">
            pages you&apos;ve already visited are still available. reconnect and
            this one will load.
          </p>
        </section>
        <Footer />
      </main>
    </>
  );
}
