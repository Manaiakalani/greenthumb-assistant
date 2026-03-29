/**
 * QR code generator utility.
 * Uses the qrserver.com API to generate QR code images.
 */

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code";

/**
 * Generate a URL that returns a QR code image for the given data.
 * @param data - The string to encode in the QR code
 * @param size - Width/height in pixels (default 200)
 */
export function generateQRCodeURL(data: string, size = 200): string {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    data,
    format: "svg",
    margin: "8",
  });
  return `${QR_API_BASE}?${params.toString()}`;
}
