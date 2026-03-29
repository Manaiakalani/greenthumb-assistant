import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Plus, Trash2, Flame, Calendar } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { PageTransition } from "@/components/PageTransition";
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
import { calculateStreak } from "@/lib/journal";
import { checkAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { useProfile } from "@/context/ProfileContext";
import { haptic } from "@/lib/haptics";
import { formatShortDate, formatShortDateNoYear, formatMonthYear } from "@/lib/dateFormat";
import { WeeklyGoalsWidget } from "@/components/WeeklyGoalsWidget";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { useGrassStore } from "@/stores/useGrassStore";
import { ACTIVITY_TYPES, ACTIVITY_META, type ActivityType } from "@/types/journal";

const Journal = () => {
  const { profile } = useProfile();
  const entries = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);
  const addEntry = useGrassStore((s) => s.addEntry);
  const deleteEntry = useGrassStore((s) => s.deleteEntry);
  const [activity, setActivity] = useState<ActivityType>("mow");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showForm, setShowForm] = useState(false);

  const streak = useMemo(() => calculateStreak(entries), [entries]);

  const handleAdd = useCallback(() => {
    if (!activity) return;
    const entry = addEntry({ activity, notes: notes.trim(), date });
    setNotes("");
    setShowForm(false);
    haptic("success");

    const meta = ACTIVITY_META[activity];
    toast.success(`${meta.emoji} ${meta.label}!`, {
      description: `Logged for ${formatShortDate(date)}`,
    });

    // Check achievements
    const newAch = checkAchievements({
      journal: [entry, ...entries],
      photos,
      profile,
    });
    for (const id of newAch) {
      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (ach) {
        toast(`${ach.emoji} Achievement Unlocked!`, { description: ach.title });
      }
    }
  }, [activity, notes, date, entries, photos, profile, addEntry]);

  const handleDelete = useCallback((id: string) => {
    deleteEntry(id);
    haptic("light");
    toast("Entry removed");
  }, [deleteEntry]);

  // Group entries by month
  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const entry of entries) {
      const key = entry.date.slice(0, 7); // YYYY-MM
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    }
    return [...map.entries()];
  }, [entries]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <AppHeader />
      <PageTransition>
        <main id="main-content" className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen aria-hidden="true" className="h-6 w-6 text-primary" />
                Lawn Journal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track every mow, water, and treatment.
              </p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                <Flame aria-hidden="true" className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {streak}d streak
                </span>
              </div>
            )}
          </div>

          {/* Weekly goals tracker */}
          <WeeklyGoalsWidget entries={entries} />

          {/* Activity heatmap */}
          <div className="mb-6">
            <ActivityHeatmap entries={entries} />
          </div>

          {/* Add entry button / form */}
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  onClick={() => { setShowForm(true); haptic("light"); }}
                  className="w-full gap-2 bg-primary mb-6"
                >
                  <Plus aria-hidden="true" className="h-4 w-4" />
                  Log Activity
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="journal-activity">Activity</Label>
                    <Select value={activity} onValueChange={(v) => setActivity(v as ActivityType)}>
                      <SelectTrigger id="journal-activity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {ACTIVITY_META[t].emoji} {ACTIVITY_META[t].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="journal-date">Date</Label>
                    <Input
                      id="journal-date"
                      type="date"
                      name="journal-date"
                      autoComplete="off"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="journal-notes">Notes (optional)</Label>
                  <Input
                    id="journal-notes"
                    name="journal-notes"
                    autoComplete="off"
                    placeholder="e.g. Set mower to 3.5 inches…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAdd} className="flex-1 bg-primary gap-1">
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                    Save Entry
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries list */}
          {entries.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen aria-hidden="true" className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No entries yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Tap "Log Activity" to start tracking your lawn care.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([monthKey, monthEntries]) => {
                const [year, month] = monthKey.split("-");
                const monthName = formatMonthYear(new Date(+year, +month - 1));
                return (
                  <div key={monthKey}>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
                      <h3 className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
                        {monthName}
                      </h3>
                      <span className="text-[10px] text-muted-foreground">
                        ({monthEntries.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {monthEntries.map((entry, i) => {
                        const meta = ACTIVITY_META[entry.activity];
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center gap-3 rounded-lg border border-primary/10 bg-card p-3 group"
                          >
                            <div className={`h-9 w-9 rounded-lg ${meta.color} flex items-center justify-center text-white text-lg shrink-0`}>
                              {meta.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {meta.label}
                              </p>
                              {entry.notes && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {entry.notes}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground shrink-0">
                              {formatShortDateNoYear(new Date(entry.date + "T12:00:00"))}
                            </span>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="sm:opacity-0 sm:group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-[opacity,color] p-1.5 rounded-md min-w-[28px] min-h-[28px] flex items-center justify-center"
                              aria-label="Delete entry"
                            >
                              <Trash2 aria-hidden="true" className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </PageTransition>
      <BottomNav />
    </div>
  );
};

export default Journal;
