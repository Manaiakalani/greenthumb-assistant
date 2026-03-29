import { motion } from "motion/react";
import { ActionCard } from "@/components/ActionCard";
import { useProfile } from "@/context/ProfileContext";
import { getSeasonalActions } from "@/data/actions";

export function ActionsSection() {
  const { profile } = useProfile();
  const actions = getSeasonalActions(
    profile.region,
    profile.grassType,
    new Date().getMonth(),
  );

  return (
    <div className="mt-8 space-y-4">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display text-lg font-semibold text-foreground"
      >
        Today's Actions
      </motion.h2>

      {actions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No actions for this time of year. Check back next season!</p>
      ) : (
        actions.map((action) => (
          <ActionCard key={action.title} {...action} />
        ))
      )}
    </div>
  );
}
