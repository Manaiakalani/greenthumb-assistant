import { useCallback, useMemo, useRef, useState } from "react";
import { QrCode, Download, Share2, User, MapPin, Sprout, Ruler } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { generateQRCodeURL } from "@/lib/qrcode";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

function encodeProfileData(profile: {
  name: string;
  zone: string;
  region: string;
  grassType: string;
  lawnSize: string;
}): string {
  const compact = {
    n: profile.name,
    z: profile.zone,
    r: profile.region,
    g: profile.grassType,
    s: profile.lawnSize,
  };
  return btoa(JSON.stringify(compact));
}

export default function QRProfileShare() {
  const { profile } = useProfile();
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const base64Data = useMemo(() => encodeProfileData(profile), [profile]);
  const profileURL = `https://grasswise.app/profile?data=${base64Data}`;
  const qrCodeURL = useMemo(() => generateQRCodeURL(profileURL, 200), [profileURL]);

  const handleDownload = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;

    try {
      const canvas = document.createElement("canvas");
      const size = 400;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Draw the QR image onto canvas
      const tempImg = new Image();
      tempImg.crossOrigin = "anonymous";
      tempImg.src = generateQRCodeURL(profileURL, 400);

      await new Promise<void>((resolve, reject) => {
        tempImg.onload = () => resolve();
        tempImg.onerror = () => reject(new Error("Failed to load QR image"));
      });

      ctx.drawImage(tempImg, 0, 0, size, size);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `grasswise-profile-${profile.name || "qr"}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("QR code downloaded!");
      }, "image/png");
    } catch {
      toast.error("Could not download QR code");
    }
  }, [profileURL, profile.name]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${profile.name || "My"} Lawn Profile — Grasswise`,
      text: `Check out my lawn profile on Grasswise! Zone ${profile.zone}, ${profile.grassType}`,
      url: profileURL,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(profileURL);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(profileURL);
          toast.success("Link copied to clipboard!");
        } catch {
          toast.error("Could not share or copy link");
        }
      }
    }
  }, [profile.name, profile.zone, profile.grassType, profileURL]);

  const infoItems = [
    { icon: User, label: "Name", value: profile.name || "Not set" },
    { icon: MapPin, label: "Zone / Region", value: `${profile.zone} · ${profile.region}` },
    { icon: Sprout, label: "Grass Type", value: profile.grassType },
    { icon: Ruler, label: "Lawn Size", value: profile.lawnSize },
  ];

  return (
    <div className="bg-card rounded-xl shadow-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <QrCode className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold">Share Your Profile</h3>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "bg-white rounded-lg p-3 inline-block transition-opacity",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            ref={imgRef}
            src={qrCodeURL}
            alt={`QR code for ${profile.name || "lawn"} profile`}
            width={200}
            height={200}
            onLoad={() => setImgLoaded(true)}
            className="block"
          />
        </div>

        {!imgLoaded && (
          <div className="w-[224px] h-[224px] bg-muted rounded-lg animate-pulse" />
        )}

        <p className="text-sm text-muted-foreground text-center">
          Scan to view this lawn profile
        </p>
      </div>

      {/* Profile summary */}
      <div className="grid gap-2">
        {infoItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span className="text-muted-foreground">{label}:</span>
            <span className="font-medium truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleDownload}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Download QR
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Share
        </Button>
      </div>
    </div>
  );
}
