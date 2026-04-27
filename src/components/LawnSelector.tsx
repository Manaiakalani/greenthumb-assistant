import { useState } from "react";
import type { Lawn } from "@/types/multiLawn";
import { useLawns } from "@/hooks/useLawns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Plus from "lucide-react/dist/esm/icons/plus";
import Pencil from "lucide-react/dist/esm/icons/pencil";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import Sprout from "lucide-react/dist/esm/icons/sprout";
const Grass = Sprout; // alias: lucide has no Grass icon (preserve existing behavior)

interface LawnSelectorProps {
  onLawnChange?: (lawnId: string) => void;
}

type FormData = {
  name: string;
  grassType: string;
  sizeSqFt: string;
};

const emptyForm: FormData = { name: "", grassType: "", sizeSqFt: "" };

export default function LawnSelector({ onLawnChange }: LawnSelectorProps) {
  const { lawns, activeLawn, addLawn, updateLawn, deleteLawn, setActiveLawn } =
    useLawns();

  const [addOpen, setAddOpen] = useState(false);
  const [editLawn, setEditLawn] = useState<Lawn | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lawn | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  /* ---- handlers ---- */

  function handleSelect(lawnId: string) {
    if (lawnId === "__add__") {
      setForm(emptyForm);
      setAddOpen(true);
      return;
    }
    setActiveLawn(lawnId);
    onLawnChange?.(lawnId);
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    const newLawn = addLawn({
      name: form.name.trim(),
      grassType: form.grassType.trim() || undefined,
      sizeSqFt: form.sizeSqFt ? Number(form.sizeSqFt) : undefined,
    });
    setAddOpen(false);
    setForm(emptyForm);
    setActiveLawn(newLawn.id);
    onLawnChange?.(newLawn.id);
  }

  function openEdit(lawn: Lawn) {
    setEditLawn(lawn);
    setForm({
      name: lawn.name,
      grassType: lawn.grassType ?? "",
      sizeSqFt: lawn.sizeSqFt?.toString() ?? "",
    });
  }

  function handleEdit() {
    if (!editLawn || !form.name.trim()) return;
    updateLawn(editLawn.id, {
      name: form.name.trim(),
      grassType: form.grassType.trim() || undefined,
      sizeSqFt: form.sizeSqFt ? Number(form.sizeSqFt) : undefined,
    });
    setEditLawn(null);
    setForm(emptyForm);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteLawn(deleteTarget.id);
    setDeleteTarget(null);
    onLawnChange?.(activeLawn?.id ?? "");
  }

  function field(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ---- form fields shared between add/edit dialogs ---- */
  const formFields = (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <Label htmlFor="lawn-name">Name *</Label>
        <Input
          id="lawn-name"
          placeholder="e.g. Front Yard"
          value={form.name}
          onChange={(e) => field("name", e.target.value)}
          className="min-h-[44px]"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lawn-grass">Grass Type</Label>
        <Input
          id="lawn-grass"
          placeholder="e.g. Kentucky Bluegrass"
          value={form.grassType}
          onChange={(e) => field("grassType", e.target.value)}
          className="min-h-[44px]"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lawn-size">Size (sq ft)</Label>
        <Input
          id="lawn-size"
          type="number"
          min={0}
          placeholder="e.g. 5000"
          value={form.sizeSqFt}
          onChange={(e) => field("sizeSqFt", e.target.value)}
          className="min-h-[44px]"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* ---- Selector ---- */}
      <div className="flex items-center gap-2">
        <Select
          value={activeLawn?.id ?? ""}
          onValueChange={handleSelect}
        >
          <SelectTrigger className="w-[200px] min-h-[44px] bg-card rounded-xl font-display text-foreground">
            <Grass className="mr-2 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
            <SelectValue placeholder="Select lawn" />
          </SelectTrigger>

          <SelectContent className="rounded-xl">
            {lawns.map((lawn) => (
              <SelectItem
                key={lawn.id}
                value={lawn.id}
                className="min-h-[44px] font-display"
              >
                <span className="flex items-center gap-2">
                  {lawn.name}
                  {lawn.grassType && (
                    <span className="text-xs text-muted-foreground">
                      · {lawn.grassType}
                    </span>
                  )}
                </span>
              </SelectItem>
            ))}

            <SelectItem value="__add__" className="min-h-[44px] text-primary font-medium">
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Lawn
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Lawn count badge */}
        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary">
          {lawns.length}
        </span>

        {/* Edit / delete buttons for active lawn */}
        {activeLawn && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Edit ${activeLawn.name}`}
              onClick={() => openEdit(activeLawn)}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-destructive hover:text-destructive"
              aria-label={`Delete ${activeLawn.name}`}
              onClick={() => setDeleteTarget(activeLawn)}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

      {/* ---- Add Dialog ---- */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="rounded-xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Add Lawn</DialogTitle>
            <DialogDescription>
              Create a new lawn to track separately.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="min-h-[44px]"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Edit Dialog ---- */}
      <Dialog open={!!editLawn} onOpenChange={(o) => !o && setEditLawn(null)}>
        <DialogContent className="rounded-xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Lawn</DialogTitle>
            <DialogDescription>
              Update lawn details.
            </DialogDescription>
          </DialogHeader>
          {formFields}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditLawn(null)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!form.name.trim()}
              className="min-h-[44px]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Delete Confirmation Dialog ---- */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="rounded-xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Lawn</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="min-h-[44px]"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
