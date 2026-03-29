import { useCallback, useRef, useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useProfile } from "@/context/ProfileContext";
import { getPlanForRegion, CATEGORY_META } from "@/data/soilPlans";

/* ─── html2canvas helpers (match CollectorCardModal pattern) ── */

async function elementToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
}

async function elementToBlob(el: HTMLElement): Promise<Blob> {
  const canvas = await elementToCanvas(el);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}

/* ─── Component ─────────────────────────────────────── */

export function SharePlanButton() {
  const { profile } = useProfile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const plan = getPlanForRegion(profile.region);

  /* ---- Download as PNG ---- */
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const blob = await elementToBlob(cardRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grasswise-plan-${profile.region.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Plan image downloaded!");
    } catch {
      toast.error("Could not export plan image. Try again or use a different browser.");
    } finally {
      setBusy(false);
    }
  }, [profile.region]);

  /* ---- Share via Web Share API or clipboard fallback ---- */
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const blob = await elementToBlob(cardRef.current);
      const file = new File([blob], "grasswise-plan.png", { type: "image/png" });

      const shareText = `My ${plan.region} lawn care plan for ${plan.year} 🌱 #Grasswise #LawnCare`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Grasswise ${plan.region} Plan`,
          text: shareText,
          files: [file],
        });
        toast.success("Shared!");
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Plan image copied to clipboard!");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Could not share plan. Try downloading the image instead.");
    } finally {
      setBusy(false);
    }
  }, [plan.region, plan.year]);

  return (
    <>
      {/* Hidden render target for html2canvas */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        <div
          ref={cardRef}
          style={{
            width: 480,
            padding: 32,
            fontFamily: "Inter, system-ui, sans-serif",
            background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #22c55e 100%)",
            borderRadius: 16,
            color: "#fff",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase" as const,
                letterSpacing: 1.5,
                opacity: 0.8,
                marginBottom: 4,
              }}
            >
              Grasswise · {plan.year}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {plan.region} Lawn Plan
            </div>
            {profile.grassType ? (
              <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
                🌿 {profile.grassType} · Zone {profile.zone}
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.25)",
              marginBottom: 16,
            }}
          />

          {/* Steps list */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {plan.applications.map((step) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <span style={{ fontSize: 18, lineHeight: "1.2" }}>
                  {CATEGORY_META[step.category].emoji}
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>
                    {step.dateRange}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 20,
              fontSize: 10,
              opacity: 0.6,
              textAlign: "center" as const,
            }}
          >
            Generated by Grasswise 🌱
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2" aria-busy={busy}>
        <Button
          onClick={handleDownload}
          disabled={busy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="h-4 w-4" aria-hidden="true" />
          )}
          Download Plan
        </Button>
        <Button
          onClick={handleShare}
          disabled={busy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </Button>
      </div>
    </>
  );
}
