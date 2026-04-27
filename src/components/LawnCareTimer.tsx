import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Timer from "lucide-react/dist/esm/icons/timer";
import Play from "lucide-react/dist/esm/icons/play";
import Pause from "lucide-react/dist/esm/icons/pause";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw";

interface Preset {
  label: string;
  minutes: number;
}

const PRESETS: Preset[] = [
  { label: "Quick Water", minutes: 15 },
  { label: "Deep Soak", minutes: 30 },
  { label: "Fertilizer Wait", minutes: 1440 }, // 24 hours
];

const CIRCLE_RADIUS = 54;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

/** Play a simple beep using Web Audio API */
function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as never)["webkitAudioContext"])();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    // Play a second beep after a short pause
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.value = 1100;
    gain2.gain.value = 0.3;
    osc2.start(ctx.currentTime + 0.4);
    osc2.stop(ctx.currentTime + 0.7);
  } catch {
    // Web Audio not supported — fail silently
  }
}

function triggerVibration() {
  try {
    navigator?.vibrate?.([200, 100, 200]);
  } catch {
    // Vibration not supported
  }
}

function formatTime(totalSeconds: number): { hours: string; minutes: string; seconds: string } {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    seconds: String(s).padStart(2, "0"),
  };
}

export const LawnCareTimer = React.memo(function LawnCareTimer() {
  const [totalSeconds, setTotalSeconds] = useState(15 * 60);
  const [remaining, setRemaining] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const [activePreset, setActivePreset] = useState<number | "custom">(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(remaining);

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onComplete = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    setIsComplete(true);
    setRemaining(0);
    playBeep();
    triggerVibration();
  }, [stopInterval]);

  const startTimer = useCallback(() => {
    if (remainingRef.current <= 0) return;
    setIsRunning(true);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      const next = remainingRef.current - 1;
      if (next <= 0) {
        onComplete();
      } else {
        setRemaining(next);
      }
    }, 1000);
  }, [onComplete]);

  const pauseTimer = useCallback(() => {
    stopInterval();
    setIsRunning(false);
  }, [stopInterval]);

  const resetTimer = useCallback(() => {
    stopInterval();
    setIsRunning(false);
    setIsComplete(false);
    setRemaining(totalSeconds);
  }, [stopInterval, totalSeconds]);

  const selectPreset = useCallback(
    (index: number) => {
      stopInterval();
      setIsRunning(false);
      setIsComplete(false);
      setActivePreset(index);
      const secs = PRESETS[index].minutes * 60;
      setTotalSeconds(secs);
      setRemaining(secs);
    },
    [stopInterval],
  );

  const applyCustom = useCallback(() => {
    const mins = Math.max(1, Math.min(9999, parseInt(customMinutes, 10) || 1));
    stopInterval();
    setIsRunning(false);
    setIsComplete(false);
    setActivePreset("custom");
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
  }, [customMinutes, stopInterval]);

  const elapsed = totalSeconds - remaining;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
  const time = formatTime(remaining);
  const showHours = totalSeconds >= 3600;

  return (
    <section
      className="rounded-xl border border-primary/15 bg-card p-5 shadow-card"
      aria-label="Lawn care timer"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Timer aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-lg font-semibold text-foreground [text-wrap:balance]">
          Lawn Care Timer
        </h2>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5 mb-5" role="group" aria-label="Timer presets">
        {PRESETS.map((preset, i) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => selectPreset(i)}
            disabled={isRunning}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px]",
              activePreset === i
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
              isRunning && "opacity-50 cursor-not-allowed",
            )}
          >
            {preset.label}{" "}
            <span className="text-[10px] opacity-75">
              ({preset.minutes >= 60 ? `${preset.minutes / 60}hr` : `${preset.minutes}m`})
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActivePreset("custom")}
          disabled={isRunning}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px]",
            activePreset === "custom"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
            isRunning && "opacity-50 cursor-not-allowed",
          )}
        >
          Custom
        </button>
      </div>

      {/* Custom input */}
      {activePreset === "custom" && !isRunning && (
        <div className="flex items-center gap-2 mb-5">
          <input
            type="number"
            min={1}
            max={9999}
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Minutes"
            aria-label="Custom duration in minutes"
            name="custom-duration"
            className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground tabular-nums placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={applyCustom}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px]"
          >
            Set
          </button>
        </div>
      )}

      {/* Circular countdown display */}
      <div className="flex justify-center mb-5">
        <div className="relative inline-flex items-center justify-center">
          <svg
            width="140"
            height="140"
            viewBox="0 0 120 120"
            className="transform -rotate-90"
            aria-hidden="true"
          >
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted"
            />
            {/* Progress ring */}
            <circle
              cx="60"
              cy="60"
              r={CIRCLE_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className={cn(
                "transition-[stroke-dashoffset] duration-1000 ease-linear",
                isComplete ? "text-lawn-healthy" : "text-primary",
              )}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                "font-display tabular-nums leading-none",
                showHours ? "text-2xl" : "text-3xl",
                isComplete ? "text-lawn-healthy" : "text-foreground",
              )}
              aria-live="polite"
              aria-atomic="true"
            >
              {showHours && <>{time.hours}:</>}
              {time.minutes}:{time.seconds}
            </span>
            {isComplete && (
              <span className="mt-1 text-xs font-medium text-lawn-healthy">
                Complete!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRunning && !isComplete && (
          <button
            type="button"
            onClick={startTimer}
            disabled={remaining <= 0}
            aria-label="Start timer"
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 min-h-[44px] min-w-[44px]",
              remaining <= 0 && "opacity-50 cursor-not-allowed",
            )}
          >
            <Play aria-hidden="true" className="h-4 w-4" />
            Start
          </button>
        )}

        {isRunning && (
          <button
            type="button"
            onClick={pauseTimer}
            aria-label="Pause timer"
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80 min-h-[44px] min-w-[44px]"
          >
            <Pause aria-hidden="true" className="h-4 w-4" />
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={resetTimer}
          aria-label="Reset timer"
          className="flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted min-h-[44px] min-w-[44px]"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Reset
        </button>
      </div>
    </section>
  );
});
