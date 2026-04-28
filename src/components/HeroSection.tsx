import { motion } from "motion/react";
import { LawnStatusBadge } from "@/components/LawnStatusBadge";
import { useProfile } from "@/context/ProfileContext";
import { getTimelineForRegion } from "@/data/timeline";
import type { HealthStatus } from "@/types/lawn";
import heroLawnWebp from "@/assets/hero-lawn.webp";
import heroLawnJpg from "@/assets/hero-lawn.jpg";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Derive an overall health status from the current month's growth phase */
function deriveHealthStatus(region: string, month: number): { status: HealthStatus; label: string } {
  const timeline = getTimelineForRegion(region as "Cool-Season" | "Transition Zone" | "Warm-Season");
  const phase = timeline[month]?.phase ?? "active";

  switch (phase) {
    case "dormant":  return { status: "dormant",  label: "Dormant" };
    case "recovery": return { status: "caution",  label: "Recovering" };
    case "stress":   return { status: "danger",   label: "Heat Stress" };
    case "slowing":  return { status: "caution",  label: "Slowing" };
    case "peak":     return { status: "healthy",  label: "Thriving" };
    case "active":
    default:         return { status: "healthy",  label: "Healthy" };
  }
}

const badgeBg: Record<HealthStatus, string> = {
  healthy: "bg-lawn-healthy/20",
  caution: "bg-lawn-caution/20",
  danger: "bg-lawn-danger/20",
  dormant: "bg-lawn-dormant/20",
};

export function HeroSection() {
  const { profile } = useProfile();
  const greeting = getGreeting();
  const nameDisplay = profile.name ? `, ${profile.name}` : "";
  const { status, label } = deriveHealthStatus(profile.region, new Date().getMonth());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="relative rounded-2xl overflow-hidden mt-6 mb-10"
    >
      <picture>
        <source srcSet={heroLawnWebp} type="image/webp" />
        <img
          src={heroLawnJpg}
          alt="Lush green lawn in morning sunlight"
          className="w-full h-44 object-cover"
          width={640}
          height={176}
          decoding="async"
          // @ts-expect-error — React 19 expects lowercase; browsers accept both
          fetchpriority="high"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-body mb-0.5">
              {greeting}{nameDisplay} 👋
            </p>
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              Your Lawn Today
            </h1>
          </div>
          <LawnStatusBadge
            status={status}
            label={label}
            className={`${badgeBg[status]} text-primary-foreground backdrop-blur-sm`}
          />
        </div>
      </div>
    </motion.div>
  );
}
