import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  HardDrive,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";
import { useGrassStore } from "@/stores/useGrassStore";
import {
  exportAllData,
  downloadBackup,
  importBackup,
  restoreBackup,
  estimateBackupSize,
  formatBytes,
  type GrasswiseBackup,
} from "@/lib/dataExport";

const LAST_BACKUP_KEY = "grasswise-last-backup";

export function DataBackupCard() {
  const { updateProfile } = useProfile();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);

  const [exporting, setExporting] = useState(false);
  const [sizeEstimate, setSizeEstimate] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  const [confirmRestore, setConfirmRestore] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<GrasswiseBackup | null>(null);
  const [importing, setImporting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  // Compute size estimate and last-backup date on mount / data change
  useEffect(() => {
    try {
      const data = exportAllData();
      setSizeEstimate(formatBytes(estimateBackupSize(data)));
    } catch {
      setSizeEstimate(null);
    }

    const stored = localStorage.getItem(LAST_BACKUP_KEY);
    if (stored) setLastBackup(stored);
  }, [journal.length, photos.length, achievements.length]);

  // ---- Export ----
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const data = exportAllData();
      downloadBackup(data);

      const now = new Date().toISOString();
      localStorage.setItem(LAST_BACKUP_KEY, now);
      setLastBackup(now);

      toast.success("Backup downloaded! 📦", {
        description: "Keep this file safe — you can restore it later.",
      });
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  }, []);

  // ---- Import ----
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Reset input so the same file can be re-selected
      e.target.value = "";

      setImporting(true);
      try {
        const data = await importBackup(file);
        setPendingBackup(data);
        setConfirmRestore(true);
      } catch (err) {
        toast.error("Invalid backup file", {
          description: err instanceof Error ? err.message : "Could not read file.",
        });
      } finally {
        setImporting(false);
      }
    },
    [],
  );

  const handleRestore = useCallback(() => {
    if (!pendingBackup) return;
    try {
      restoreBackup(pendingBackup, updateProfile);

      const dateLabel = new Date(
        pendingBackup.exportDate ?? pendingBackup.exportDate,
      ).toLocaleDateString();

      toast.success("Backup restored! 🎉", {
        description: `Data from ${dateLabel} has been loaded.`,
      });

      // Reload so all components pick up restored data
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error("Restore failed", {
        description: "Something went wrong while restoring the backup.",
      });
    } finally {
      setPendingBackup(null);
      setConfirmRestore(false);
    }
  }, [pendingBackup, updateProfile]);

  const cancelRestore = useCallback(() => {
    setConfirmRestore(false);
    setPendingBackup(null);
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <HardDrive className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Data &amp; Backup
        </h3>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        All your data is stored locally on this device. Export a backup or
        restore from a previous one.
      </p>

      {/* Data summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { count: journal.length, label: "Journal entries" },
          { count: photos.length, label: "Photos" },
          { count: achievements.length, label: "Achievements" },
        ].map(({ count, label }) => (
          <div
            key={label}
            className="rounded-lg border border-border bg-background p-2.5"
          >
            <p className="text-lg font-display font-bold text-foreground">
              {count}
            </p>
            <p className="text-[11px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Size estimate & last backup */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {sizeEstimate && <span>Estimated backup size: {sizeEstimate}</span>}
        {lastBackup && (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            Last backup: {new Date(lastBackup).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
          className="gap-2 border-primary/20 hover:bg-primary/5"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download Backup
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          variant="outline"
          className="gap-2 border-primary/20 hover:bg-primary/5"
        >
          {importing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Restore
        </Button>
      </div>

      {/* Restore confirmation dialog */}
      <AnimatePresence>
        {confirmRestore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Replace all current data?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This will overwrite your current profile, journal, photos,
                    achievements, and plan progress with the backup file. This
                    cannot be undone.
                  </p>
                  {pendingBackup && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Backup from{" "}
                      {new Date(pendingBackup.exportDate).toLocaleDateString()}{" "}
                      — {pendingBackup.journal?.length ?? 0} journal entries,{" "}
                      {pendingBackup.photos?.length ?? 0} photos,{" "}
                      {pendingBackup.achievements?.length ?? 0} achievements.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={cancelRestore}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleRestore}
                >
                  Yes, Restore
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
