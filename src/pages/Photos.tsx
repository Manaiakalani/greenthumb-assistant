import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Camera from "lucide-react/dist/esm/icons/camera";
import Plus from "lucide-react/dist/esm/icons/plus";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import ImageIcon from "lucide-react/dist/esm/icons/image";
import X from "lucide-react/dist/esm/icons/x";
import ArrowLeftRight from "lucide-react/dist/esm/icons/arrow-left-right";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
import { PhotoCompare } from "@/components/PhotoCompare";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { compressImage } from "@/lib/journal";
import { checkAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { useProfile } from "@/context/ProfileContext";
import { haptic } from "@/lib/haptics";
import { useGrassStore } from "@/stores/useGrassStore";
import { formatShortDateNoYear, formatMonthYear } from "@/lib/dateFormat";

const Photos = () => {
  const { profile } = useProfile();
  const photos = useGrassStore((s) => s.photos);
  const journal = useGrassStore((s) => s.journal);
  const storeAddPhoto = useGrassStore((s) => s.addPhoto);
  const storeDeletePhoto = useGrassStore((s) => s.deletePhoto);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lightbox) lightboxRef.current?.focus();
  }, [lightbox]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setPreview(compressed);
      setShowForm(true);
    } catch {
      toast.error("Could not process image. Try a different file format (JPG or PNG).");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!preview) return;
    const entry = storeAddPhoto({ photo: preview, note: note.trim(), date });
    setPreview(null);
    setNote("");
    setShowForm(false);
    haptic("success");
    toast.success("📸 Photo saved!");

    // Check achievements
    const newAch = checkAchievements({
      journal,
      photos: [entry, ...photos],
      profile,
    });
    for (const id of newAch) {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        toast(`${ach.emoji} Achievement Unlocked!`, { description: ach.title });
      }
    }
  }, [preview, note, date, photos, journal, profile, storeAddPhoto]);

  const handleDelete = useCallback((id: string) => {
    storeDeletePhoto(id);
    haptic("light");
    toast("Photo removed");
  }, [storeDeletePhoto]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, typeof photos>();
    for (const p of photos) {
      const key = p.date.slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return [...map.entries()];
  }, [photos]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <Camera aria-hidden="true" className="h-6 w-6 text-primary" />
              Photo Timeline
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Capture your lawn's progress over time.
            </p>
          </div>

          {/* Progress Comparison */}
          {photos.length >= 2 && (
            <div className="mb-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <ArrowLeftRight aria-hidden="true" className="h-5 w-5 text-primary" />
                Progress Comparison
              </h2>
              <PhotoCompare />
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full gap-2 bg-primary mb-6"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  {uploading ? "Processing…" : "Add Photo"}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 rounded-xl border border-primary/20 bg-card p-5 shadow-card space-y-4"
              >
                {preview && (
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover" width={400} height={192} decoding="async" />
                    <button
                      onClick={() => { setPreview(null); setShowForm(false); }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                      aria-label="Remove selected photo preview"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="photo-date">Date</Label>
                    <Input id="photo-date" type="date" name="photo-date" autoComplete="off" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="photo-note">Note (optional)</Label>
                    <Input
                      id="photo-note"
                      name="photo-note"
                      autoComplete="off"
                      placeholder="e.g. After first mow…"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setShowForm(false); setPreview(null); }} className="flex-1">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} className="flex-1 bg-primary gap-1">
                    <Camera aria-hidden="true" className="h-3.5 w-3.5" />
                    Save Photo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Photo grid */}
          {photos.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon aria-hidden="true" className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No photos yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Snap a photo of your lawn to start tracking its progress.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([monthKey, monthPhotos]) => {
                const [year, month] = monthKey.split("-");
                const monthName = formatMonthYear(new Date(+year, +month - 1));
                return (
                  <div key={monthKey}>
                    <h3 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {monthName}
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {monthPhotos.map((photo, i) => (
                        <motion.div
                          key={photo.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: Math.min(i, 12) * 0.03 }}
                          role="button"
                          tabIndex={0}
                          className="relative group rounded-lg overflow-hidden aspect-square cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                          onClick={() => setLightbox(photo.photo)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setLightbox(photo.photo);
                            }
                          }}
                          aria-label={`View photo${photo.note ? `: ${photo.note}` : ''}`}
                        >
                          <img
                            src={photo.photo}
                            alt={photo.note || "Lawn photo"}
                            className="w-full h-full object-cover"
                            width={300}
                            height={300}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-[10px] text-white truncate">
                              {formatShortDateNoYear(new Date(photo.date + "T12:00:00"))}
                              {photo.note && ` · ${photo.note}`}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(photo.id); }}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/40 text-white sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/60 min-w-[28px] min-h-[28px] flex items-center justify-center"
                            aria-label="Delete photo"
                          >
                            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {lightbox && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label="Photo lightbox"
                className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
                onClick={() => setLightbox(null)}
                onKeyDown={(e) => { if (e.key === 'Escape') setLightbox(null); }}
                tabIndex={-1}
                ref={lightboxRef}
              >
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  src={lightbox}
                  alt="Lawn photo"
                  width={800}
                  height={600}
                  className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
                />
                <button
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => setLightbox(null)}
                  aria-label="Close lightbox"
                >
                  <X aria-hidden="true" className="h-6 w-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Photos;
