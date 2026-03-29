import React from "react";
import { motion } from "motion/react";
import { ArrowUp, Leaf, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "@/context/ProfileContext";
import { getGrowthMessage } from "@/data/lawn-profile";

export const LawnProfile = React.memo(function LawnProfile() {
  const { profile } = useProfile();

  const fields = [
    { label: "Grass Type", value: profile.grassType, icon: true },
    { label: "Climate Zone", value: `USDA Zone ${profile.zone}` },
    { label: "Region", value: profile.region },
    { label: "Lawn Size", value: profile.lawnSize },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-6 rounded-xl border border-primary/15 bg-card p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">
          Your Lawn
        </h3>
        <Link
          to="/profile"
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Settings aria-hidden="true" className="h-3 w-3" />
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {fields.map(({ label, value, icon }) => (
          <div key={label}>
            <p className="text-muted-foreground text-xs">{label}</p>
            <p className="font-medium text-foreground flex items-center gap-1">
              {icon && <Leaf aria-hidden="true" className="h-3.5 w-3.5 text-primary" />}
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-primary/10">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUp aria-hidden="true" className="h-3 w-3" />
          {getGrowthMessage(profile.region, profile.grassType)}
        </p>
      </div>
    </motion.div>
  );
});
