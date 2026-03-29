import { forwardRef } from "react";
import {
  Globe, Leaf, MapPin, Maximize, User, Wheat,
  Shield, Star, Crown, Sparkles, Gem,
  type LucideIcon,
} from "lucide-react";
import type { UserProfile } from "@/types/profile";
import type { Achievement } from "@/types/journal";

/* ------------------------------------------------------------------ */
/*  Rarity system                                                      */
/* ------------------------------------------------------------------ */

export type Rarity = "Common" | "Uncommon" | "Rare" | "Ultra Rare" | "Legendary";

const RARITY_CONFIG: Record<
  Rarity,
  { icon: LucideIcon; color: string; border: string; glow: string; bg: string; foil: boolean }
> = {
  Common:     { icon: Shield,   color: "#6b7280", border: "#9ca3af", glow: "none",                                   bg: "linear-gradient(135deg,#f5f0e1,#ede6d3)", foil: false },
  Uncommon:   { icon: Star,     color: "#15803d", border: "#22c55e", glow: "0 0 12px rgba(34,197,94,0.25)",           bg: "linear-gradient(135deg,#f5f0e1,#e8ebd6)", foil: false },
  Rare:       { icon: Gem,      color: "#1d4ed8", border: "#3b82f6", glow: "0 0 18px rgba(59,130,246,0.3)",           bg: "linear-gradient(135deg,#f5f0e1,#dde5e8)", foil: true },
  "Ultra Rare": { icon: Crown,  color: "#7c3aed", border: "#a78bfa", glow: "0 0 22px rgba(167,139,250,0.35)",        bg: "linear-gradient(135deg,#f5f0e1,#e8ddf0)", foil: true },
  Legendary:  { icon: Sparkles, color: "#d97706", border: "#f59e0b", glow: "0 0 28px rgba(245,158,11,0.4)",           bg: "linear-gradient(135deg,#f5f0e1,#f0e8d0)", foil: true },
};

/** Derive rarity from profile completeness */
export function deriveRarity(profile: UserProfile): Rarity {
  let score = 0;
  if (profile.name) score++;
  if (profile.location) score++;
  if (profile.zone) score++;
  if (profile.region) score++;
  if (profile.grassType) score++;
  if (profile.lawnSize) score++;
  // Bonus for extreme zones
  const z = parseInt(profile.zone, 10);
  if (z <= 2 || z >= 12) score += 2;
  else if (z <= 3 || z >= 10) score++;

  if (score >= 8) return "Legendary";
  if (score >= 7) return "Ultra Rare";
  if (score >= 5) return "Rare";
  if (score >= 4) return "Uncommon";
  return "Common";
}

/* ------------------------------------------------------------------ */
/*  Fun titles                                                         */
/* ------------------------------------------------------------------ */

const GRASS_TITLES: Record<string, string> = {
  "Kentucky Bluegrass": "Bluegrass Baron",
  "Tall Fescue": "Fescue Guardian",
  "Fine Fescue": "Shade Whisperer",
  "Perennial Ryegrass": "Ryegrass Ranger",
  "Bermudagrass": "Bermuda Boss",
  "Zoysiagrass": "Zoysia Zen Master",
  "St. Augustinegrass": "Augustine Ace",
  "Centipedegrass": "Centipede Captain",
  "Bahiagrass": "Bahia Brawler",
};

const FALLBACK_TITLES = [
  "Lawn Whisperer", "Turf Titan", "Grass Guardian",
  "Sod Sage", "Mow Master", "Green Keeper",
];

function getTitle(profile: UserProfile): string {
  return GRASS_TITLES[profile.grassType]
    ?? FALLBACK_TITLES[Math.abs(hashStr(profile.grassType)) % FALLBACK_TITLES.length];
}

/** Stable card number from profile data */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function getCardNumber(profile: UserProfile): string {
  const seed = Math.abs(
    hashStr(`${profile.name}${profile.location}${profile.zone}${profile.grassType}`),
  );
  return String(seed % 10000).padStart(4, "0");
}

/* ------------------------------------------------------------------ */
/*  Series name from region                                            */
/* ------------------------------------------------------------------ */

function getSeriesName(profile: UserProfile): string {
  const r = profile.region;
  if (r === "Cool-Season") return "Cool-Season Series";
  if (r === "Warm-Season") return "Warm-Season Series";
  return "Transition Series";
}

function getEditionLabel(rarity: Rarity): string {
  switch (rarity) {
    case "Legendary":  return "✦ Legendary Edition";
    case "Ultra Rare": return "✦ Ultra Rare Edition";
    case "Rare":       return "◆ Rare Edition";
    case "Uncommon":   return "● Uncommon Edition";
    default:           return "○ Standard Edition";
  }
}

/* ------------------------------------------------------------------ */
/*  SVG leaf corner decorations                                        */
/* ------------------------------------------------------------------ */

function LeafCorner({ flip, className }: { flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: 0.12,
      }}
    >
      <path
        d="M5 75 C5 75 10 30 40 15 C55 8 75 5 75 5 C75 5 55 20 50 40 C45 60 40 75 5 75Z"
        fill="currentColor"
      />
      <path
        d="M5 75 C20 55 30 40 75 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M30 50 L18 55" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M42 38 L30 45" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M55 25 L42 33" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface CollectorCardProps {
  profile: UserProfile;
  /** Earned achievements to display on the card (shows up to 6) */
  earnedBadges?: Achievement[];
}

export const CollectorCard = forwardRef<HTMLDivElement, CollectorCardProps>(
  ({ profile, earnedBadges = [] }, ref) => {
    const rarity = deriveRarity(profile);
    const cfg = RARITY_CONFIG[rarity];
    const displayBadges = earnedBadges.slice(0, 6);
    const RarityIcon = cfg.icon;
    const title = getTitle(profile);
    const cardNum = getCardNumber(profile);
    const series = getSeriesName(profile);
    const edition = getEditionLabel(rarity);

    const fields: { icon: LucideIcon; label: string; value: string }[] = [
      { icon: User,     label: "Name",      value: profile.name || "Not set" },
      { icon: MapPin,   label: "Location",  value: profile.location || "Not set" },
      { icon: Globe,    label: "USDA Zone", value: `Zone ${profile.zone}` },
      { icon: Leaf,     label: "Region",    value: profile.region },
      { icon: Wheat,    label: "Grass Type",value: profile.grassType },
      { icon: Maximize, label: "Lawn Size", value: profile.lawnSize },
    ];

    return (
      <div
        ref={ref}
        className="collector-card"
        style={{
          /* Card outer shell */
          position: "relative",
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          padding: 6,
          background: `linear-gradient(145deg, #1a3d2b, #2c5a3f, #1a3d2b)`,
          boxShadow: cfg.glow !== "none"
            ? `0 8px 32px rgba(0,0,0,0.35), ${cfg.glow}`
            : "0 8px 32px rgba(0,0,0,0.35)",
          fontFamily: "'Fraunces', 'Georgia', serif",
          overflow: "hidden",
        }}
      >
        {/* Foil shimmer overlay for rare+ cards */}
        {cfg.foil && (
          <div
            className="collector-card-foil"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 16,
              background:
                "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 70%, transparent 80%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}

        {/* Inner gold border */}
        <div
          style={{
            border: `2px solid ${cfg.border}44`,
            borderRadius: 12,
            padding: 3,
          }}
        >
          {/* Card body */}
          <div
            style={{
              background: cfg.bg,
              borderRadius: 10,
              padding: "20px 22px 16px",
              position: "relative",
              overflow: "hidden",
              minHeight: 280,
            }}
          >
            {/* Corner leaf decorations */}
            <LeafCorner className="absolute top-0 left-0 w-20 h-20 text-green-900" />
            <LeafCorner flip className="absolute top-0 right-0 w-20 h-20 text-green-900" />
            <LeafCorner className="absolute bottom-0 right-0 w-20 h-20 text-green-900 rotate-180" />
            <LeafCorner flip className="absolute bottom-0 left-0 w-20 h-20 text-green-900 rotate-180" />

            {/* Side botanical vines */}
            <div
              style={{
                position: "absolute",
                left: 2,
                top: "15%",
                bottom: "15%",
                width: 30,
                opacity: 0.07,
                background:
                  "repeating-linear-gradient(180deg, transparent 0px, #1a3d2b 2px, transparent 4px, transparent 18px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 2,
                top: "15%",
                bottom: "15%",
                width: 30,
                opacity: 0.07,
                background:
                  "repeating-linear-gradient(180deg, transparent 0px, #1a3d2b 2px, transparent 4px, transparent 18px)",
              }}
            />

            {/* Card number */}
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 14,
                fontSize: 10,
                color: "#8b7e6a",
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: 1,
              }}
            >
              #{cardNum}
            </div>

            {/* Header */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1a3d2b",
                  textTransform: "uppercase",
                  letterSpacing: 2.5,
                  marginBottom: 2,
                  textShadow: "0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                Lawn Care Collector's Card
              </h2>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: cfg.color,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                {title}
              </p>
            </div>

            {/* Profile fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 14px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {fields.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.3))",
                    border: "1px solid rgba(139,126,106,0.25)",
                    borderRadius: 8,
                    padding: "7px 10px",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2c5a3f, #1a3d2b)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={14} color="#d4cfc0" strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: "#8b7e6a",
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: "#2d2a24",
                        margin: 0,
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 120,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Earned badges strip */}
            {displayBadges.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  marginTop: 12,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {displayBadges.map((b) => (
                  <div
                    key={b.id}
                    title={b.title}
                    role="img"
                    aria-label={b.title}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.35))",
                      border: "1px solid rgba(139,126,106,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    {b.emoji}
                  </div>
                ))}
                {earnedBadges.length > 6 && (
                  <span
                    style={{
                      fontSize: 10,
                      color: "#8b7e6a",
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    +{earnedBadges.length - 6}
                  </span>
                )}
              </div>
            )}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg, transparent, #8b7e6a44, transparent)",
                margin: "14px 20px 10px",
              }}
            />

            {/* Bottom rarity badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "linear-gradient(90deg, rgba(26,61,43,0.9), rgba(44,90,63,0.9))",
                  borderRadius: 20,
                  padding: "5px 16px",
                  border: `1px solid ${cfg.border}66`,
                }}
              >
                <RarityIcon size={13} color={cfg.border} strokeWidth={2.5} />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#d4cfc0",
                    textTransform: "uppercase",
                    letterSpacing: 1.8,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {edition} — {series}
                </span>
              </div>
            </div>

            {/* Tiny Grasswise watermark */}
            <p
              style={{
                textAlign: "center",
                fontSize: 8,
                color: "#8b7e6a88",
                marginTop: 8,
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: 1,
              }}
            >
              GRASSWISE · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

CollectorCard.displayName = "CollectorCard";
