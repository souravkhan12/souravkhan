"use client";

import { useEffect, useState } from "react";
import { X, Share, Plus } from "lucide-react";

/**
 * Chrome hasn't shown an automatic install banner for years — the browser
 * fires `beforeinstallprompt` and expects the *site* to provide the button.
 * Without this the app is installable but the only way in is the ⋮ menu.
 *
 * iOS never fires the event at all, so Safari gets the manual instructions.
 */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED = "pwa-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    // already installed, or the user waved it away before
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;
    try {
      if (localStorage.getItem(DISMISSED)) return;
    } catch {
      /* private mode — just show it */
    }

    const onPrompt = (e: Event) => {
      e.preventDefault(); // hold onto it so we can fire it from our own button
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setIosHint(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const ua = navigator.userAgent;
    const isIosSafari =
      /iphone|ipad|ipod/i.test(ua) &&
      /safari/i.test(ua) &&
      !/crios|fxios/i.test(ua);
    // give the page a beat to settle before asking for anything
    const t = isIosSafari ? window.setTimeout(() => setIosHint(true), 4000) : 0;

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {
      /* nothing to persist to */
    }
    setDeferred(null);
    setIosHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null); // the event is single-use either way
  };

  if (!deferred && !iosHint) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]">
      <div className="border-border bg-background flex items-start gap-3 border px-4 py-3 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="ss01 text-sm font-semibold">install this site</p>
          {deferred ? (
            <p className="mt-1 text-xs text-gray-500">
              add it to your home screen — opens full screen, works offline.
            </p>
          ) : (
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-500">
              tap <Share size={13} className="inline shrink-0" /> then
              <span className="text-foreground inline-flex items-center gap-1">
                <Plus size={13} className="shrink-0" />
                add to home screen
              </span>
            </p>
          )}

          {deferred && (
            <button
              type="button"
              onClick={install}
              className="border-border hover:border-blue hover:text-blue mt-3 inline-flex h-9 items-center border px-4 text-sm transition-colors"
            >
              install
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="hover:text-foreground -mr-1 shrink-0 p-1 text-gray-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
