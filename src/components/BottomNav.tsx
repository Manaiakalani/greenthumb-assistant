import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import Home from "lucide-react/dist/esm/icons/home";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import Camera from "lucide-react/dist/esm/icons/camera";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import Trophy from "lucide-react/dist/esm/icons/trophy";
import ClipboardList from "lucide-react/dist/esm/icons/clipboard-list";
import { useTranslation } from "react-i18next";

const NAV_KEYS = [
  { to: "/",            icon: Home,          i18nKey: "nav.home" },
  { to: "/plan",        icon: ClipboardList, i18nKey: "nav.plan" },
  { to: "/journal",     icon: BookOpen,      i18nKey: "nav.journal" },
  { to: "/photos",      icon: Camera,        i18nKey: "nav.photos" },
  { to: "/tools",       icon: Wrench,        i18nKey: "nav.tools" },
  { to: "/achievements", icon: Trophy,        i18nKey: "nav.badges" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <nav aria-label={t("nav.mainNavigation")} className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-md safe-area-bottom">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5">
        {NAV_KEYS.map(({ to, icon: Icon, i18nKey }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-0.5 px-3 py-3 min-w-[44px] min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {active && (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                aria-hidden="true"
                className={`h-5 w-5 relative z-10 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[11px] font-medium relative z-10 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {t(i18nKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
