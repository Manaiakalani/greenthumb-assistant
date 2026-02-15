import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export function GrasswiseLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary p-1.5">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold text-foreground tracking-tight">
          Grasswise
        </span>
      </div>
    </div>
  );
}

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <GrasswiseLogo />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-full bg-secondary">
            Zone 7 · Transition
          </span>
        </div>
      </div>
    </motion.header>
  );
}
