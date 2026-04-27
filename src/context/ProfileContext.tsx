import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PROFILE,
  type UserProfile,
} from "@/types/profile";

const STORAGE_KEY = "grasswise-profile";

interface ProfileContextValue {
  profile: UserProfile;
  /** Replace one or more profile fields and persist to localStorage */
  updateProfile: (updates: Partial<UserProfile>) => void;
  /** Whether the user has ever saved their profile */
  hasCompletedSetup: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

import { safeGetRaw, safeSetItem } from "@/lib/safeStorage";

function loadProfile(): UserProfile {
  try {
    const raw = safeGetRaw(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProfile>;
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch {
    // Corrupted data — fall back to defaults
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile: UserProfile) {
  safeSetItem(STORAGE_KEY, profile);
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [hasCompletedSetup, setHasCompletedSetup] = useState(
    () => safeGetRaw(STORAGE_KEY) !== null,
  );

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      saveProfile(next);
      return next;
    });
    setHasCompletedSetup(true);
  }, []);

  // Keep localStorage in sync if another tab changes it
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ profile, updateProfile, hasCompletedSetup }),
    [profile, updateProfile, hasCompletedSetup],
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within <ProfileProvider>");
  }
  return ctx;
}
