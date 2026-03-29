import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Captures the `beforeinstallprompt` event so we can show a custom
 * "Add to Home Screen" banner instead of the browser default.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

import { safeGetRaw, safeSetItem } from "@/lib/safeStorage";

const DISMISSED_KEY = "grasswise-install-dismissed";

function checkDismissed(): boolean {
  const ts = safeGetRaw(DISMISSED_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < 7 * 24 * 60 * 60 * 1000;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches
  );
  const dismissedRef = useRef(checkDismissed());

  useEffect(() => {
    if (isInstalled) return;

    const handler = (e: Event) => {
      e.preventDefault();
      if (!dismissedRef.current) {
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect post-install
    const onInstalled = () => setIsInstalled(true);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isInstalled]);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome === "accepted";
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    safeSetItem(DISMISSED_KEY, String(Date.now()));
    dismissedRef.current = true;
    setDeferredPrompt(null);
  }, []);

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    install,
    dismiss,
  };
}
