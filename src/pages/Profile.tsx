import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Activity from "lucide-react/dist/esm/icons/activity";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import CalendarDays from "lucide-react/dist/esm/icons/calendar-days";
import Camera from "lucide-react/dist/esm/icons/camera";
import Globe from "lucide-react/dist/esm/icons/globe";
import HelpCircle from "lucide-react/dist/esm/icons/help-circle";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Loader2 from "lucide-react/dist/esm/icons/loader-2";
import LocateFixed from "lucide-react/dist/esm/icons/locate-fixed";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Ruler from "lucide-react/dist/esm/icons/ruler";
import Sprout from "lucide-react/dist/esm/icons/sprout";
import Trophy from "lucide-react/dist/esm/icons/trophy";
import Wheat from "lucide-react/dist/esm/icons/wheat";
import User from "lucide-react/dist/esm/icons/user";
import Maximize from "lucide-react/dist/esm/icons/maximize";
import { toast } from "sonner";
import { detectLocation } from "@/lib/geolocation";
import { useProfile } from "@/context/ProfileContext";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { CollectorCardModal } from "@/components/CollectorCardModal";
import { NotificationSettings } from "@/components/NotificationSettings";
import { DataBackupCard } from "@/components/DataBackupCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { checkAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { useEarnedBadges } from "@/hooks/useEarnedBadges";
import { useGrassStore } from "@/stores/useGrassStore";
import { haptic } from "@/lib/haptics";
import {
  USDA_ZONES,
  CLIMATE_REGIONS,
  GRASS_TYPES,
  LAWN_SIZES,
  suggestRegion,
  type USDAZone,
  type ClimateRegion,
  type LawnSize,
} from "@/types/profile";

const Profile = () => {
  const { profile, updateProfile } = useProfile();

  const handleZoneChange = useCallback(
    (zone: USDAZone) => {
      const region = suggestRegion(zone);
      const grassOptions = GRASS_TYPES[region];
      const grassType = (grassOptions as readonly string[]).includes(profile.grassType)
        ? profile.grassType
        : grassOptions[0];
      updateProfile({ zone, region, grassType });
    },
    [profile.grassType, updateProfile],
  );

  const handleRegionChange = useCallback(
    (region: ClimateRegion) => {
      const grassOptions = GRASS_TYPES[region];
      const grassType = (grassOptions as readonly string[]).includes(profile.grassType)
        ? profile.grassType
        : grassOptions[0];
      updateProfile({ region, grassType });
    },
    [profile.grassType, updateProfile],
  );

  const [detecting, setDetecting] = useState(false);

  const handleDetectLocation = useCallback(async () => {
    setDetecting(true);
    try {
      const geo = await detectLocation();
      const location = geo.state ? `${geo.city}, ${geo.state}` : geo.city;
      const grassOptions = GRASS_TYPES[geo.region];
      const grassType = (grassOptions as readonly string[]).includes(profile.grassType)
        ? profile.grassType
        : grassOptions[0];
      updateProfile({
        location,
        zone: geo.zone,
        region: geo.region,
        grassType,
        latitude: geo.latitude,
        longitude: geo.longitude,
      });
      toast.success("Location detected!", {
        description: `${location} · Zone ${geo.zone} · ${geo.region}`,
      });
      haptic("success");

      // Check achievements for location detection
      const { journal, photos } = useGrassStore.getState();
      const newAch = checkAchievements({
        journal,
        photos,
        profile: { ...profile, location, zone: geo.zone, region: geo.region, grassType },
        locationDetected: true,
      });
      for (const id of newAch) {
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (ach) toast(`${ach.emoji} Achievement Unlocked!`, { description: ach.title });
      }
    } catch {
      toast.error("Could not detect location", {
        description: "Please enable location permissions or enter manually.",
      });
    } finally {
      setDetecting(false);
    }
  }, [profile, updateProfile]);

  const grassOptions = GRASS_TYPES[profile.region] ?? GRASS_TYPES["Transition Zone"];
  const { earned: badgesEarned, total: badgesTotal } = useEarnedBadges();
  const journal = useGrassStore((s) => s.journal);
  const photos = useGrassStore((s) => s.photos);

  const memberSince = useMemo(() => {
    const timestamps = [
      ...journal.map((e) => e.createdAt),
      ...badgesEarned.map((b) => b.earnedAt),
    ].filter(Boolean);
    if (timestamps.length === 0) return null;
    return new Date(Math.min(...timestamps));
  }, [journal, badgesEarned]);

  return (
    <div className="min-h-screen bg-background pb-28">
      <AppHeader />

      <main id="main-content" className="max-w-2xl mx-auto px-5 sm:px-8 pb-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mt-4 mb-6"
        >
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Link to="/">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-2xl font-bold text-foreground">
            Your Lawn Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your profile so Grasswise can give you the most
            accurate recommendations.
          </p>
        </motion.div>

        {/* Your Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="rounded-xl border border-primary/15 bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy aria-hidden="true" className="h-4 w-4 text-primary" />
              Your Stats
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 min-h-[44px]">
                <div className="rounded-lg bg-green-500/10 p-2 shrink-0">
                  <Activity aria-hidden="true" className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground">{journal.length}</p>
                  <p className="text-xs text-muted-foreground">Activities</p>
                </div>
              </div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <div className="rounded-lg bg-blue-500/10 p-2 shrink-0">
                  <Camera aria-hidden="true" className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground">{photos.length}</p>
                  <p className="text-xs text-muted-foreground">Photos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <div className="rounded-lg bg-amber-500/10 p-2 shrink-0">
                  <Trophy aria-hidden="true" className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground">
                    {badgesEarned.length}
                    <span className="text-sm font-normal text-muted-foreground">/{badgesTotal}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
              <div className="flex items-center gap-3 min-h-[44px]">
                <div className="rounded-lg bg-purple-500/10 p-2 shrink-0">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">
                    {memberSince
                      ? memberSince.toLocaleDateString(undefined, { month: "short", year: "numeric" })
                      : "Just joined"}
                  </p>
                  <p className="text-xs text-muted-foreground">Member since</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Summary card — at the top */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ruler aria-hidden="true" className="h-4 w-4 text-primary" />
              Profile Summary
            </h2>
            <div className="grid grid-cols-2 gap-5 text-sm">
              {[
                { icon: User, label: "Name", value: profile.name || "Not set" },
                { icon: MapPin, label: "Location", value: profile.location || "Not set" },
                { icon: Globe, label: "USDA Zone", value: `Zone ${profile.zone}` },
                { icon: Leaf, label: "Region", value: profile.region },
                { icon: Wheat, label: "Grass Type", value: profile.grassType },
                { icon: Maximize, label: "Lawn Size", value: profile.lawnSize },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
                    <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs">{label}</p>
                    <p className="font-medium text-foreground truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Earned badges showcase */}
            {badgesEarned.length > 0 && (
              <div className="mt-4 pt-3 border-t border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Badges ({badgesEarned.length}/{badgesTotal})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {badgesEarned.slice(0, 8).map((a) => (
                    <div
                      key={a.id}
                      title={a.title}
                      className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-base"
                    >
                      {a.emoji}
                    </div>
                  ))}
                  {badgesEarned.length > 8 && (
                    <div className="h-8 px-2 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                      +{badgesEarned.length - 8}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-primary/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Changes are saved automatically.
              </p>
              <CollectorCardModal />
            </div>
          </div>

          {/* Personal */}
          <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card space-y-5">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Sprout aria-hidden="true" className="h-4 w-4 text-primary" />
              Personal
            </h2>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="display-name"
                autoComplete="off"
                placeholder="e.g. Alex…"
                maxLength={40}
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    autoComplete="off"
                    className="pl-9"
                    placeholder="e.g. Charlotte, NC…"
                    maxLength={60}
                    value={profile.location}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="shrink-0"
                  aria-label="Detect my location"
                  title="Auto-detect location, zone, and region"
                >
                  {detecting ? (
                    <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed aria-hidden="true" className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tap detect to auto-fill your location, zone, and region.
              </p>
            </div>
          </div>

          {/* Climate & Zone */}
          <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card space-y-5">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Globe aria-hidden="true" className="h-4 w-4 text-primary" />
              Climate & Zone
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usda-zone">USDA Hardiness Zone</Label>
                <Select
                  value={profile.zone}
                  onValueChange={(val) => handleZoneChange(val as USDAZone)}
                >
                  <SelectTrigger id="usda-zone">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {USDA_ZONES.map((z) => (
                      <SelectItem key={z} value={z}>
                        Zone {z}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="climate-region">Climate Region</Label>
                <Select
                  value={profile.region}
                  onValueChange={(val) =>
                    handleRegionChange(val as ClimateRegion)
                  }
                >
                  <SelectTrigger id="climate-region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIMATE_REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Changing your zone will suggest a matching climate region
              automatically.
            </p>
          </div>

          {/* Lawn details */}
          <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card space-y-5">
            <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
              <Leaf aria-hidden="true" className="h-4 w-4 text-primary" />
              Lawn Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grass-type">Grass Type</Label>
                <Select
                  value={profile.grassType}
                  onValueChange={(val) => updateProfile({ grassType: val })}
                >
                  <SelectTrigger id="grass-type">
                    <SelectValue placeholder="Select grass" />
                  </SelectTrigger>
                  <SelectContent>
                    {grassOptions.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link
                  to="/grass-quiz"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <HelpCircle aria-hidden="true" className="h-3 w-3" />
                  Not sure? Take the grass quiz →
                </Link>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lawn-size">Lawn Size</Label>
                <Select
                  value={profile.lawnSize}
                  onValueChange={(val) =>
                    updateProfile({ lawnSize: val as LawnSize })
                  }
                >
                  <SelectTrigger id="lawn-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {LAWN_SIZES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card">
            <NotificationSettings />
          </div>

          {/* Export & Backup */}
          <div className="rounded-xl border border-primary/15 bg-card p-6 shadow-card">
            <DataBackupCard />
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Profile;
