import { motion } from "framer-motion";
import { Calendar, Scissors, Sprout, Droplets } from "lucide-react";

interface QuickStatProps {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}

function QuickStat({ icon: Icon, label, value, sub }: QuickStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card border border-border shadow-card">
      <Icon className="h-4 w-4 text-primary mb-0.5" />
      <span className="text-lg font-display font-bold text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground leading-tight text-center">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground/60">{sub}</span>}
    </div>
  );
}

export function QuickStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="grid grid-cols-4 gap-2"
    >
      <QuickStat icon={Scissors} label="Last Mow" value="3d" sub="ago" />
      <QuickStat icon={Sprout} label="Last Feed" value="18d" sub="ago" />
      <QuickStat icon={Droplets} label="Last Rain" value="1d" sub="ago" />
      <QuickStat icon={Calendar} label="Season" value="Mid" sub="Spring" />
    </motion.div>
  );
}
