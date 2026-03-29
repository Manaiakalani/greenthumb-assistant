import { useState, useCallback } from "react";
import type { Lawn } from "@/types/multiLawn";
import {
  loadLawns,
  saveLawns,
  addLawn as addLawnToStorage,
  updateLawn as updateLawnInStorage,
  deleteLawn as deleteLawnFromStorage,
  setActiveLawn as setActiveLawnInStorage,
} from "@/lib/lawnManager";

export function useLawns() {
  const [manager, setManager] = useState(() => loadLawns());

  const refresh = useCallback(() => {
    const latest = loadLawns();
    setManager(latest);
    return latest;
  }, []);

  const addLawn = useCallback(
    (lawn: Omit<Lawn, "id" | "createdAt">) => {
      const newLawn = addLawnToStorage(lawn);
      refresh();
      return newLawn;
    },
    [refresh],
  );

  const updateLawn = useCallback(
    (id: string, updates: Partial<Lawn>) => {
      updateLawnInStorage(id, updates);
      refresh();
    },
    [refresh],
  );

  const deleteLawn = useCallback(
    (id: string) => {
      deleteLawnFromStorage(id);
      refresh();
    },
    [refresh],
  );

  const setActiveLawn = useCallback(
    (id: string) => {
      setActiveLawnInStorage(id);
      const updated = loadLawns();
      setManager(updated);
      saveLawns(updated);
    },
    [],
  );

  const activeLawn =
    manager.lawns.find((l) => l.id === manager.activeLawnId) ?? null;

  return {
    lawns: manager.lawns,
    activeLawn,
    addLawn,
    updateLawn,
    deleteLawn,
    setActiveLawn,
  };
}
