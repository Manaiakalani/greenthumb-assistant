import { cn } from "@/lib/utils";

type StatusLevel = "healthy" | "caution" | "danger" | "dormant";

interface LawnStatusBadgeProps {
  status: StatusLevel;
  label: string;
  className?: string;
}

const statusConfig: Record<StatusLevel, { emoji: string; colorClass: string; bgClass: string }> = {
  healthy: { emoji: "🟢", colorClass: "text-lawn-healthy", bgClass: "bg-lawn-healthy/10" },
  caution: { emoji: "🟡", colorClass: "text-lawn-caution", bgClass: "bg-lawn-caution/10" },
  danger: { emoji: "🔴", colorClass: "text-lawn-danger", bgClass: "bg-lawn-danger/10" },
  dormant: { emoji: "💤", colorClass: "text-lawn-dormant", bgClass: "bg-lawn-dormant/10" },
};

export function LawnStatusBadge({ status, label, className }: LawnStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        config.bgClass,
        config.colorClass,
        className
      )}
    >
      <span>{config.emoji}</span>
      {label}
    </span>
  );
}
