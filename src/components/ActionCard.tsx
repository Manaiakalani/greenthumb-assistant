import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type ActionStatus = "safe" | "caution" | "danger";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: ActionStatus;
  statusLabel: string;
  detail?: string;
  className?: string;
}

const statusStyles: Record<ActionStatus, string> = {
  safe: "border-lawn-healthy/30 bg-lawn-healthy/5",
  caution: "border-lawn-caution/30 bg-lawn-caution/5",
  danger: "border-lawn-danger/30 bg-lawn-danger/5",
};

const statusDotStyles: Record<ActionStatus, string> = {
  safe: "bg-lawn-healthy",
  caution: "bg-lawn-caution",
  danger: "bg-lawn-danger",
};

export function ActionCard({ icon: Icon, title, description, status, statusLabel, detail, className }: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border p-5 shadow-card transition-shadow hover:shadow-card-hover",
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className={cn("h-2 w-2 rounded-full", statusDotStyles[status])} />
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          {detail && (
            <p className="mt-2 text-xs text-muted-foreground/70 italic">{detail}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
