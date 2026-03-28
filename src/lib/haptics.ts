/**
 * Trigger subtle haptic feedback on supported devices.
 * Falls back silently on devices without vibration API.
 */
export function haptic(pattern: "light" | "medium" | "success" | "error" = "light") {
  if (!("vibrate" in navigator)) return;
  try {
    switch (pattern) {
      case "light":   navigator.vibrate(10); break;
      case "medium":  navigator.vibrate(25); break;
      case "success": navigator.vibrate([15, 50, 15]); break;
      case "error":   navigator.vibrate([30, 30, 30, 30, 60]); break;
    }
  } catch {
    // Vibration blocked or unavailable
  }
}
