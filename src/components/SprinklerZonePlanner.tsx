import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplets, Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadZones,
  addZone,
  updateZone,
  deleteZone,
  calcWeeklyGallons,
  calcTotalWeeklyGallons,
  DEFAULT_PRECIP_RATES,
} from "@/lib/sprinklerManager";
import type { SprinklerZone, SprinklerType, DayOfWeek } from "@/lib/sprinklerManager";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

const SPRINKLER_TYPES: { value: SprinklerType; label: string; icon: string }[] = [
  { value: "rotor", label: "Rotor", icon: "🔄" },
  { value: "spray", label: "Spray", icon: "💦" },
  { value: "drip", label: "Drip", icon: "💧" },
  { value: "soaker", label: "Soaker", icon: "〰️" },
];

const TYPE_ICON: Record<SprinklerType, string> = {
  rotor: "🔄",
  spray: "💦",
  drip: "💧",
  soaker: "〰️",
};

const galFmt = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const costFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyFormState(): Omit<SprinklerZone, "id"> {
  return {
    name: "",
    type: "rotor",
    areaSqFt: 0,
    precipitationRate: DEFAULT_PRECIP_RATES.rotor,
    schedule: {
      days: [],
      startTime: "06:00",
      durationMinutes: 30,
    },
    notes: "",
  };
}

function scheduleSummary(zone: SprinklerZone): string {
  const days = zone.schedule.days
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
    .join(", ");
  return `${days || "No days"} @ ${zone.schedule.startTime} · ${zone.schedule.durationMinutes} min`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface DayToggleProps {
  selected: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

const DayToggle: React.FC<DayToggleProps> = ({ selected, onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {ALL_DAYS.map(({ key, label }) => {
      const active = selected.includes(key);
      return (
        <button
          key={key}
          type="button"
          aria-pressed={active}
          onClick={() =>
            onChange(
              active ? selected.filter((d) => d !== key) : [...selected, key],
            )
          }
          className={`min-h-[44px] min-w-[44px] rounded-full px-3 py-2 text-xs font-medium transition-colors ${
            active
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Zone form (add / edit)
// ---------------------------------------------------------------------------

interface ZoneFormProps {
  initial: Omit<SprinklerZone, "id">;
  onSubmit: (data: Omit<SprinklerZone, "id">) => void;
  onCancel: () => void;
  submitLabel: string;
}

const ZoneForm: React.FC<ZoneFormProps> = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const set = useCallback(
    <K extends keyof Omit<SprinklerZone, "id">>(
      key: K,
      value: Omit<SprinklerZone, "id">[K],
    ) => setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const setSchedule = useCallback(
    <K extends keyof SprinklerZone["schedule"]>(
      key: K,
      value: SprinklerZone["schedule"][K],
    ) =>
      setForm((prev) => ({
        ...prev,
        schedule: { ...prev.schedule, [key]: value },
      })),
    [],
  );

  const handleTypeChange = useCallback((type: SprinklerType) => {
    setForm((prev) => ({
      ...prev,
      type,
      precipitationRate: DEFAULT_PRECIP_RATES[type],
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!form.name.trim()) {
        setError("Zone name is required.");
        return;
      }
      if (!form.areaSqFt || form.areaSqFt <= 0) {
        setError("Area must be greater than 0.");
        return;
      }
      if (form.schedule.days.length === 0) {
        setError("Select at least one watering day.");
        return;
      }
      if (!form.schedule.durationMinutes || form.schedule.durationMinutes <= 0) {
        setError("Duration must be greater than 0.");
        return;
      }

      onSubmit({ ...form, name: form.name.trim(), notes: form.notes?.trim() || undefined });
    },
    [form, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="zone-name">Zone Name</Label>
        <Input
          id="zone-name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Front Lawn Zone 1"
          autoComplete="off"
          className="text-sm"
        />
      </div>

      {/* Type + Area */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="zone-type">Sprinkler Type</Label>
          <Select
            value={form.type}
            onValueChange={(v) => handleTypeChange(v as SprinklerType)}
          >
            <SelectTrigger id="zone-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPRINKLER_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span aria-hidden="true">{t.icon}</span> {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="zone-area">Area (sq ft)</Label>
          <Input
            id="zone-area"
            type="number"
            min={1}
            step={50}
            value={form.areaSqFt || ""}
            onChange={(e) => set("areaSqFt", Number(e.target.value))}
            placeholder="2000"
            autoComplete="off"
            className="text-sm tabular-nums"
          />
        </div>
      </div>

      {/* Precipitation rate */}
      <div className="space-y-1.5">
        <Label htmlFor="zone-precip">Precipitation Rate (in/hr)</Label>
        <Input
          id="zone-precip"
          type="number"
          min={0.1}
          step={0.1}
          value={form.precipitationRate}
          onChange={(e) => set("precipitationRate", Number(e.target.value))}
          autoComplete="off"
          className="text-sm tabular-nums"
        />
        <p className="text-[10px] text-muted-foreground">
          Default for {form.type}: {DEFAULT_PRECIP_RATES[form.type]} in/hr
        </p>
      </div>

      {/* Schedule: days */}
      <div className="space-y-1.5">
        <Label>Watering Days</Label>
        <DayToggle
          selected={form.schedule.days}
          onChange={(days) => setSchedule("days", days)}
        />
      </div>

      {/* Schedule: time + duration */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="zone-time">Start Time</Label>
          <Input
            id="zone-time"
            type="time"
            value={form.schedule.startTime}
            onChange={(e) => setSchedule("startTime", e.target.value)}
            className="text-sm tabular-nums"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="zone-duration">Duration (min)</Label>
          <Input
            id="zone-duration"
            type="number"
            min={1}
            step={5}
            value={form.schedule.durationMinutes || ""}
            onChange={(e) => setSchedule("durationMinutes", Number(e.target.value))}
            placeholder="30"
            autoComplete="off"
            className="text-sm tabular-nums"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="zone-notes">Notes (optional)</Label>
        <Input
          id="zone-notes"
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="e.g. Shady area, needs less water"
          autoComplete="off"
          className="text-sm"
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 gap-2 bg-primary">
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const SprinklerZonePlanner: React.FC = () => {
  const [zones, setZones] = useState<SprinklerZone[]>(loadZones);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [costRate, setCostRate] = useState(0.004); // $/gallon

  // Derived
  const totalWeeklyGallons = useMemo(
    () => calcTotalWeeklyGallons(zones),
    [zones],
  );

  const monthlyCost = useMemo(
    () => totalWeeklyGallons * (52 / 12) * costRate,
    [totalWeeklyGallons, costRate],
  );

  // Day → zones map for schedule overview
  const daySchedule = useMemo(() => {
    const map: Record<DayOfWeek, string[]> = {
      mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [],
    };
    for (const z of zones) {
      for (const d of z.schedule.days) {
        map[d].push(z.name);
      }
    }
    return map;
  }, [zones]);

  // Handlers
  const handleAdd = useCallback((data: Omit<SprinklerZone, "id">) => {
    setZones(addZone(data));
    setShowForm(false);
  }, []);

  const handleUpdate = useCallback(
    (data: Omit<SprinklerZone, "id">) => {
      if (!editingId) return;
      setZones(updateZone(editingId, data));
      setEditingId(null);
    },
    [editingId],
  );

  const handleDelete = useCallback((id: string) => {
    setZones(deleteZone(id));
    setDeletingId(null);
  }, []);

  const editingZone = editingId
    ? zones.find((z) => z.id === editingId)
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets aria-hidden="true" className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-card-foreground [text-wrap:balance]">
            Sprinkler Zone Planner
          </h3>
        </div>
        {!showForm && !editingId && (
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5 min-h-[44px]"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add Zone
          </Button>
        )}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-display font-semibold text-foreground mb-3">
                New Zone
              </h4>
              <ZoneForm
                initial={emptyFormState()}
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
                submitLabel="Add Zone"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit form */}
      <AnimatePresence>
        {editingZone && (
          <motion.div
            key={editingZone.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-display font-semibold text-foreground mb-3">
                Edit Zone
              </h4>
              <ZoneForm
                initial={{
                  name: editingZone.name,
                  type: editingZone.type,
                  areaSqFt: editingZone.areaSqFt,
                  precipitationRate: editingZone.precipitationRate,
                  schedule: { ...editingZone.schedule },
                  notes: editingZone.notes,
                }}
                onSubmit={handleUpdate}
                onCancel={() => setEditingId(null)}
                submitLabel="Save Changes"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone list */}
      {zones.length === 0 && !showForm ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No zones yet. Add your first sprinkler zone to get started.
        </p>
      ) : (
        <AnimatePresence mode="popLayout">
          {zones.map((zone) => {
            const weeklyGal = calcWeeklyGallons(zone);
            const isDeleting = deletingId === zone.id;

            return (
              <motion.div
                key={zone.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-border bg-muted/30 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span aria-hidden="true" className="text-lg shrink-0">
                      {TYPE_ICON[zone.type]}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {zone.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {scheduleSummary(zone)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm font-medium text-primary tabular-nums mr-1">
                      {galFmt.format(weeklyGal)} gal/wk
                    </span>
                    <button
                      type="button"
                      aria-label={`Edit ${zone.name}`}
                      onClick={() => {
                        setEditingId(zone.id);
                        setShowForm(false);
                        setDeletingId(null);
                      }}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md transition-colors hover:bg-muted"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${zone.name}`}
                      onClick={() => setDeletingId(isDeleting ? null : zone.id)}
                      className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {zone.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    {zone.notes}
                  </p>
                )}

                {/* Area + rate details */}
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {galFmt.format(zone.areaSqFt)} sq ft · {zone.precipitationRate} in/hr · {zone.schedule.durationMinutes} min
                </p>

                {/* Delete confirmation */}
                <AnimatePresence>
                  {isDeleting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 mt-1">
                        <p className="text-xs text-destructive flex-1">
                          Delete this zone?
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(zone.id)}
                          className="min-h-[44px] text-xs"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingId(null)}
                          className="min-h-[44px] text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Summary section */}
      {zones.length > 0 && (
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" />
            Weekly Summary
          </h4>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-display font-bold text-primary tabular-nums">
                {zones.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Zones</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-primary tabular-nums">
                {galFmt.format(totalWeeklyGallons)}
              </p>
              <p className="text-xs text-muted-foreground">Gallons / Week</p>
            </div>
            <div className="col-span-2 sm:col-span-2 space-y-1">
              <p className="text-2xl font-display font-bold text-primary tabular-nums">
                {costFmt.format(monthlyCost)}
              </p>
              <p className="text-xs text-muted-foreground">Est. Monthly Cost</p>
              <div className="flex items-center gap-2">
                <Label htmlFor="cost-rate" className="text-[10px] text-muted-foreground whitespace-nowrap">
                  $/gal:
                </Label>
                <Input
                  id="cost-rate"
                  type="number"
                  min={0.001}
                  step={0.001}
                  value={costRate}
                  onChange={(e) => setCostRate(Number(e.target.value) || 0)}
                  autoComplete="off"
                  className="h-7 w-24 text-xs tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Weekly schedule overview */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">
              Schedule Overview
            </p>
            <div className="grid grid-cols-7 gap-1">
              {ALL_DAYS.map(({ key, label }) => {
                const zoneNames = daySchedule[key];
                const hasZones = zoneNames.length > 0;
                return (
                  <div
                    key={key}
                    className={`rounded-lg p-2 text-center transition-colors ${
                      hasZones
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/30 border border-transparent"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-medium ${
                        hasZones ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </p>
                    {hasZones && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 tabular-nums">
                        {zoneNames.length} zone{zoneNames.length > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Zone detail per day */}
            <div className="space-y-1">
              {ALL_DAYS.filter(({ key }) => daySchedule[key].length > 0).map(
                ({ key, label }) => (
                  <p key={key} className="text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">{label}:</span>{" "}
                    {daySchedule[key].join(", ")}
                  </p>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
