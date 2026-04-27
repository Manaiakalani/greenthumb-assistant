import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, ImageIcon } from "lucide-react";
import { useGrassStore } from "@/stores/useGrassStore";
import { formatShortDate } from "@/lib/dateFormat";

const formatDate = (iso: string) =>
  formatShortDate(new Date(iso + "T12:00:00"));

export const PhotoCompare = () => {
  const photos = useGrassStore((s) => s.photos);
  const [beforeId, setBeforeId] = useState<string>("");
  const [afterId, setAfterId] = useState<string>("");
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const sorted = useMemo(
    () => [...photos].sort((a, b) => a.date.localeCompare(b.date)),
    [photos],
  );
  const byId = useMemo(
    () => new Map(sorted.map((p) => [p.id, p])),
    [sorted],
  );
  const beforePhoto = byId.get(beforeId);
  const afterPhoto = byId.get(afterId);

  // TODO(perf-audit): migrate drag to ref-based DOM writes (clipPath via style)
  // to avoid re-render per pointer move; deferred from this PR.

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  if (photos.length < 2) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
        <ImageIcon aria-hidden="true" className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Add at least 2 photos to compare lawn progress
        </p>
      </div>
    );
  }

  const label = (p: { date: string; note: string }) =>
    `${formatDate(p.date)}${p.note ? ` – ${p.note}` : ""}`;

  return (
    <div className="space-y-3">
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="before-select"
            className="text-xs font-medium text-muted-foreground"
          >
            Before
          </label>
          <select
            id="before-select"
            name="before-photo"
            value={beforeId}
            onChange={(e) => setBeforeId(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">Select photo…</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === afterId}>
                {label(p)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="after-select"
            className="text-xs font-medium text-muted-foreground"
          >
            After
          </label>
          <select
            id="after-select"
            name="after-photo"
            value={afterId}
            onChange={(e) => setAfterId(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
          >
            <option value="">Select photo…</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === beforeId}>
                {label(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison slider */}
      {beforePhoto && afterPhoto ? (
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden shadow-card select-none touch-none aspect-[4/3]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="slider"
          aria-label="Photo comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); setPosition((p) => Math.max(0, p - 2)); }
            if (e.key === 'ArrowRight') { e.preventDefault(); setPosition((p) => Math.min(100, p + 2)); }
          }}
        >
          {/* After image (full width, bottom layer) */}
          <img
            src={afterPhoto.photo}
            alt={afterPhoto.note || "After"}
            className="absolute inset-0 w-full h-full object-cover"
            width={800}
            height={600}
            draggable={false}
          />

          {/* Before image (clipped, top layer) */}
          <img
            src={beforePhoto.photo}
            alt={beforePhoto.note || "Before"}
            className="absolute inset-0 w-full h-full object-cover"
            width={800}
            height={600}
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            draggable={false}
          />

          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/90 pointer-events-none"
            style={{ left: `${position}%`, transform: "translateX(-50%)" }}
          />

          {/* Drag handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10"
            style={{ left: `${position}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ArrowLeftRight aria-hidden="true" className="h-5 w-5 text-gray-700" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium pointer-events-none">
            Before · {formatDate(beforePhoto.date)}
          </div>
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium pointer-events-none">
            After · {formatDate(afterPhoto.date)}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 aspect-[4/3] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Select two photos above to compare
          </p>
        </div>
      )}
    </div>
  );
};
