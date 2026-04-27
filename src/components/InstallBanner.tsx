import { motion } from "motion/react";
import Download from "lucide-react/dist/esm/icons/download";
import X from "lucide-react/dist/esm/icons/x";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallBanner() {
  const { canInstall, install, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="mb-4 rounded-xl border border-primary/25 bg-gradient-to-r from-primary/10 to-primary/5 p-4 flex items-center gap-3"
    >
      <div className="rounded-lg bg-primary/15 p-2 shrink-0">
        <Download className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          Install Grasswise
        </p>
        <p className="text-xs text-muted-foreground">
          Add to your home screen for quick access — works offline!
        </p>
      </div>
      <button
        onClick={install}
        className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Install
      </button>
      <button
        onClick={dismiss}
        className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss install prompt"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  );
}
