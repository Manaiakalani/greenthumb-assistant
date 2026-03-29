import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Keyboard, X } from "lucide-react";
import { useKeyboardShortcuts, NAV_SHORTCUTS } from "@/hooks/useKeyboardShortcuts";
import { cn } from "@/lib/utils";

const kbdClass =
  "bg-muted border border-border rounded px-1.5 py-0.5 text-xs font-mono inline-flex items-center justify-center min-w-[1.5rem]";

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className={kbdClass}>{children}</kbd>;
}

interface ShortcutRowProps {
  keys: string[];
  description: string;
}

function ShortcutRow({ keys, description }: ShortcutRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-foreground">{description}</span>
      <span className="flex items-center gap-1 shrink-0">
        {keys.map((k, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground text-xs">then</span>}
            <Kbd>{k}</Kbd>
          </span>
        ))}
      </span>
    </div>
  );
}

function HelpOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <motion.div
            ref={overlayRef}
            className={cn(
              "bg-card rounded-xl shadow-card w-full max-w-md max-h-[80vh] overflow-y-auto",
              "border border-border p-6",
              "overscroll-contain",
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-sm p-1 opacity-70 transition-colors hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close shortcuts help"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation shortcuts */}
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Navigation
              </h3>
              <div className="divide-y divide-border">
                {NAV_SHORTCUTS.map((s) => (
                  <ShortcutRow key={s.key} keys={["g", s.key]} description={s.label} />
                ))}
              </div>
            </div>

            {/* Action shortcuts */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Actions
              </h3>
              <div className="divide-y divide-border">
                <ShortcutRow keys={["?"]} description="Toggle this help" />
                <ShortcutRow keys={["Esc"]} description="Close overlay / modal" />
                <ShortcutRow keys={["/"]} description="Focus search (Glossary page)" />
              </div>
            </div>

            {/* Footer hint */}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Press <Kbd>?</Kbd> anytime to toggle this overlay
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function KeyboardShortcuts() {
  const { showHelp, setShowHelp } = useKeyboardShortcuts();

  return <HelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />;
}
