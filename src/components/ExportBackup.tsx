import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Download from "lucide-react/dist/esm/icons/download";
import HardDrive from "lucide-react/dist/esm/icons/hard-drive";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import Upload from "lucide-react/dist/esm/icons/upload";
import AlertTriangle from "lucide-react/dist/esm/icons/alert-triangle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";
import { useGrassStore } from "@/stores/useGrassStore";
import { formatShortDate } from "@/lib/dateFormat";

/**
 * Export / Import (restore) all Grasswise data as JSON.
 */
export function ExportBackup() {
  const { profile, updateProfile } = useProfile();
  const [exporting, setExporting] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const { journal, photos, achievements, weeklyGoals } = useGrassStore.getState();
      const data = {
        exportedAt: new Date().toISOString(),
        version: 1,
        profile,
        journal,
        photos,
        achievements,
        weeklyGoals,
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `grasswise-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success("Backup downloaded! 📦", {
        description: "Keep this file safe — you can restore it later.",
      });
    } catch {
      toast.error("Export failed", {
        description: "Check available storage and try again.",
      });
    } finally {
      setExporting(false);
    }
  }, [profile]);

  /* ---- Restore from file ---- */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingFile(reader.result as string);
      setConfirmRestore(true);
    };
    reader.onerror = () => toast.error("Could not read file. Select a valid Grasswise .json backup.");
    reader.readAsText(file);
    // Reset input so the same file can be selected again
    e.target.value = "";
  }, []);

  const handleRestore = useCallback(() => {
    if (!pendingFile) return;
    try {
      const data = JSON.parse(pendingFile);

      // Basic validation
      if (!data.version || !data.exportedAt) {
        toast.error("Invalid backup file", { description: "This doesn't look like a Grasswise backup. Export one from the app first." });
        return;
      }

      // Schema validation — ensure expected data shapes
      if (data.profile && typeof data.profile !== "object") {
        toast.error("Invalid backup", { description: "Profile data is malformed. Try a different backup file." });
        return;
      }
      if (data.journal !== undefined && !Array.isArray(data.journal)) {
        toast.error("Invalid backup", { description: "Journal data is malformed. Try a different backup file." });
        return;
      }
      if (data.photos !== undefined && !Array.isArray(data.photos)) {
        toast.error("Invalid backup", { description: "Photos data is malformed. Try a different backup file." });
        return;
      }
      if (data.achievements !== undefined && !Array.isArray(data.achievements)) {
        toast.error("Invalid backup", { description: "Achievements data is malformed. Try a different backup file." });
        return;
      }

      // Restore each data type
      if (data.profile) {
        updateProfile(data.profile);
      }
      useGrassStore.getState().restoreAll({
        journal: Array.isArray(data.journal) ? data.journal : undefined,
        photos: Array.isArray(data.photos) ? data.photos : undefined,
        achievements: Array.isArray(data.achievements) ? data.achievements : undefined,
        weeklyGoals: data.weeklyGoals ?? undefined,
      });

      toast.success("Backup restored! 🎉", {
        description: `Data from ${formatShortDate(data.exportedAt)} has been loaded.`,
      });

      // Reload to reflect restored data
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error("Restore failed", { description: "The file could not be parsed. Re-export a backup and try again." });
    } finally {
      setPendingFile(null);
      setConfirmRestore(false);
    }
  }, [pendingFile, updateProfile]);

  // Reactive data summary from Zustand store
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const achievements = useGrassStore((s) => s.achievements);
  const journalCount = journal.length;
  const photoCount = photos.length;
  const achievementCount = achievements.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <HardDrive className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Data & Backup
        </h3>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        All your data is stored locally on this device. Export a backup or
        restore from a previous one.
      </p>

      {/* Data summary */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border border-border bg-background p-2.5">
          <p className="text-lg font-display font-bold text-foreground">{journalCount}</p>
          <p className="text-[11px] text-muted-foreground">Journal entries</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-2.5">
          <p className="text-lg font-display font-bold text-foreground">{photoCount}</p>
          <p className="text-[11px] text-muted-foreground">Photos</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-2.5">
          <p className="text-lg font-display font-bold text-foreground">{achievementCount}</p>
          <p className="text-[11px] text-muted-foreground">Achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
          className="gap-2 border-primary/20 hover:bg-primary/5"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
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
          variant="outline"
          className="gap-2 border-primary/20 hover:bg-primary/5"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Restore Backup
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
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">Replace all data?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This will overwrite your current profile, journal, photos, and achievements
                    with the backup file. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setConfirmRestore(false); setPendingFile(null); }}
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
