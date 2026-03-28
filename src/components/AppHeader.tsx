import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Moon, Sun, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useProfile } from "@/context/ProfileContext";
import { useTranslation } from "react-i18next";

function GrasswiseLogo({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <Link to="/" className={className}>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary p-1.5">
          <Leaf className="h-5 w-5 text-primary-foreground" />
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-7 h-7" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      aria-label={resolvedTheme === "dark" ? t("common.switchToLight") : t("common.switchToDark")}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export function AppHeader() {
  const { profile } = useProfile();
  const { t } = useTranslation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <GrasswiseLogo />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 truncate max-w-[160px] hidden sm:inline-block">
            {t("common.zone", { zone: profile.zone })} · {profile.region}
          </span>
          <ThemeToggle />
          <Link
            to="/profile"
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={t("common.editProfile")}
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
