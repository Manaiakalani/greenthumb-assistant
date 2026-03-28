import type { LucideIcon } from "lucide-react";

/** Status levels used for action cards (mow, water, fertilize, etc.) */
export type ActionStatus = "safe" | "caution" | "danger";

/** Status levels for overall lawn health badge */
export type HealthStatus = "healthy" | "caution" | "danger" | "dormant";

/** Growth phases used in the seasonal timeline */
export type GrowthPhase =
  | "dormant"
  | "recovery"
  | "active"
  | "peak"
  | "slowing"
  | "stress";

/** A single action recommendation shown on the dashboard */
export interface ActionItem {
  icon: LucideIcon;
  title: string;
  description: string;
  status: ActionStatus;
  statusLabel: string;
  detail?: string;
}

/** A single quick-stat card (e.g. "Last Mow: 3d ago") */
export interface QuickStatItem {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}

/** Monthly data for the seasonal timeline */
export interface MonthData {
  month: string;
  short: string;
  phase: GrowthPhase;
  tasks: string[];
}


