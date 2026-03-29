import { useCallback, useRef, useState } from "react";
import { Download, Share2, Sparkles, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CollectorCard, deriveRarity } from "@/components/CollectorCard";
import { useProfile } from "@/context/ProfileContext";
import { useEarnedBadges } from "@/hooks/useEarnedBadges";

async function cardToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
    logging: false,
  });
}

async function cardToBlob(el: HTMLElement): Promise<Blob> {
  const canvas = await cardToCanvas(el);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
  });
}

export function CollectorCardModal() {
  const { profile } = useProfile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const rarity = deriveRarity(profile);
  const { earned: earnedBadges } = useEarnedBadges();

  /* ---- Download as PNG ---- */
  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const blob = await cardToBlob(cardRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `grasswise-card-${profile.name || "collector"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Card downloaded!");
    } catch {
      toast.error("Could not export card image. Try again or use a different browser.");
    } finally {
      setBusy(false);
    }
  }, [profile.name]);

  /* ---- Share via Web Share API or clipboard fallback ---- */
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const blob = await cardToBlob(cardRef.current);
      const file = new File([blob], "grasswise-card.png", { type: "image/png" });

      const shareText = `Check out my ${rarity} Grasswise Collector Card! 🌱🃏 #Grasswise #LawnCare`;

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My Grasswise Collector's Card",
          text: shareText,
          files: [file],
        });
        toast.success("Shared!");
      } else {
        // Fallback: copy image to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Card copied to clipboard!");
      }
    } catch (err: unknown) {
      // User cancelled share is not an error
      if (err instanceof Error && err.name === "AbortError") return;
      toast.error("Could not share card. Try downloading the image instead.");
    } finally {
      setBusy(false);
    }
  }, [rarity]);

  /* ---- Copy share text ---- */
  const handleCopyCaption = useCallback(async () => {
    const text = `🌱 My ${rarity} Grasswise Collector Card!\n🌿 ${profile.grassType} · Zone ${profile.zone} · ${profile.region}\n🃏 #Grasswise #LawnCare`;
    await navigator.clipboard.writeText(text);
    toast.success("Caption copied!");
  }, [rarity, profile.grassType, profile.zone, profile.region]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Generate Collector Card
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-0 bg-transparent border-0 shadow-none overflow-visible [&>button]:text-white [&>button]:hover:text-white/80">
        <DialogHeader className="sr-only">
          <DialogTitle>Lawn Care Collector's Card</DialogTitle>
          <DialogDescription>
            Your personalized lawn care collector card. Download or share it!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* The card */}
          <CollectorCard ref={cardRef} profile={profile} earnedBadges={earnedBadges} />

          {/* Action buttons */}
          <div className="flex items-center gap-3" aria-busy={busy}>
            <Button
              onClick={handleDownload}
              disabled={busy}
              className="gap-2 bg-green-800 hover:bg-green-700 text-white"
              size="sm"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              Download
            </Button>
            <Button
              onClick={handleShare}
              disabled={busy}
              variant="outline"
              className="gap-2 border-white/20 text-white hover:bg-white/10"
              size="sm"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={handleCopyCaption}
              variant="outline"
              className="gap-2 border-white/20 text-white hover:bg-white/10"
              size="sm"
            >
              <Copy className="h-4 w-4" />
              Copy Caption
            </Button>
          </div>

          {/* Share hint */}
          <p className="text-[10px] text-white/50 text-center">
            Share your {rarity} card on social media! 🌱
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
