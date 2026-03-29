import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface ShortcutRoute {
  key: string;
  path: string;
  label: string;
}

const NAV_SHORTCUTS: ShortcutRoute[] = [
  { key: "h", path: "/", label: "Home" },
  { key: "t", path: "/tools", label: "Tools" },
  { key: "j", path: "/journal", label: "Journal" },
  { key: "p", path: "/photos", label: "Photos" },
  { key: "s", path: "/plan", label: "Soil Plan" },
  { key: "a", path: "/achievements", label: "Achievements" },
  { key: "c", path: "/calendar", label: "Calendar" },
  { key: "l", path: "/glossary", label: "Glossary" },
];

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  const pendingG = useRef(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const clearPending = useCallback(() => {
    pendingG.current = false;
    if (pendingTimer.current) {
      clearTimeout(pendingTimer.current);
      pendingTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing
      if (isInputFocused()) return;

      const key = e.key;

      // Escape — close overlay
      if (key === "Escape") {
        if (showHelp) {
          setShowHelp(false);
          e.preventDefault();
        }
        clearPending();
        return;
      }

      // ? — toggle help
      if (key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        clearPending();
        return;
      }

      // / — focus search on glossary page
      if (key === "/" && location.pathname === "/glossary") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[type="text"], input[placeholder*="earch"]',
        );
        searchInput?.focus();
        clearPending();
        return;
      }

      // Two-key combo: g then <key>
      if (pendingG.current) {
        clearPending();
        const route = NAV_SHORTCUTS.find((s) => s.key === key);
        if (route) {
          e.preventDefault();
          if (location.pathname !== route.path) {
            navigate(route.path);
            toast(`→ ${route.label}`, { duration: 1500 });
          }
        }
        return;
      }

      // Start "g" prefix
      if (key === "g") {
        pendingG.current = true;
        // Cancel if no second key within 800ms
        pendingTimer.current = setTimeout(() => {
          pendingG.current = false;
        }, 800);
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearPending();
    };
  }, [navigate, location.pathname, showHelp, clearPending]);

  return { showHelp, setShowHelp };
}

export { NAV_SHORTCUTS };
