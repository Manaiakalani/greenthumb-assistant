import { useSyncExternalStore, useState } from "react";
import { motion } from "motion/react";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Moon from "lucide-react/dist/esm/icons/moon";
import Sun from "lucide-react/dist/esm/icons/sun";
import User from "lucide-react/dist/esm/icons/user";
import Search from "lucide-react/dist/esm/icons/search";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useProfile } from "@/context/ProfileContext";
import { useTranslation } from "react-i18next";
import { CommandPalette } from "@/components/CommandPalette";

function GrasswiseLogo({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={className}>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary p-1.5">
          <Leaf aria-hidden="true" className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-display text-xl font-bold text-foreground tracking-tight">
          {t("common.appName")}
        </span>
      </div>
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Render the button at full size always to avoid layout shift; show a
  // neutral Sun icon until mounted, then swap to the resolved-theme icon.
  const isDark = mounted && resolvedTheme === "dark";
  const label = !mounted
    ? t("common.switchToDark")
    : isDark
      ? t("common.switchToLight")
      : t("common.switchToDark");

  return (
    <button
      onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
      className="rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label={label}
      aria-hidden={!mounted}
      tabIndex={mounted ? 0 : -1}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-4 w-4" />
      ) : (
        <Moon aria-hidden="true" className="h-4 w-4" />
      )}
    </button>
  );
}

export function AppHeader() {
  const { profile } = useProfile();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-3.5 flex items-center justify-between">
        <GrasswiseLogo />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 truncate max-w-[160px] hidden sm:inline-block">
            {t("common.zone", { zone: profile.zone })} · {profile.region}
          </span>
          <button
            onClick={() => setSearchOpen(true)}
            className="rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={`Search (${isMac ? "⌘K" : "Ctrl+K"})`}
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-muted-foreground bg-muted border border-border rounded px-1 py-0.5">
              {isMac ? "⌘K" : "Ctrl+K"}
            </kbd>
          </button>
          <ThemeToggle />
          <Link
            to="/profile"
            className="rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={t("common.editProfile")}
          >
            <User aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
    <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
