import React from "react";
import { cn } from "@/lib/utils";
import type { HealthStatus } from "@/types/lawn";

interface LawnStatusBadgeProps {
  status: HealthStatus;
  label: string;
  className?: string;
}

const statusConfig: Record<HealthStatus, { emoji: string; colorClass: string; bgClass: string }> = {
  healthy: { emoji: "🟢", colorClass: "text-lawn-healthy", bgClass: "bg-lawn-healthy/10" },
  caution: { emoji: "🟡", colorClass: "text-lawn-caution", bgClass: "bg-lawn-caution/10" },
  danger: { emoji: "🔴", colorClass: "text-lawn-danger", bgClass: "bg-lawn-danger/10" },
  dormant: { emoji: "💤", colorClass: "text-lawn-dormant", bgClass: "bg-lawn-dormant/10" },
};

export const LawnStatusBadge = React.memo(function LawnStatusBadge({ status, label, className }: LawnStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        config.bgClass,
        config.colorClass,
        className
      )}
      role="status"
      aria-label={`Lawn status: ${label}`}
    >
      <span aria-hidden="true">{config.emoji}</span>
      {label}
    </span>
  );
});
