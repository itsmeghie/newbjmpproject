export function downloadBase64Image(base64String: string, filename: string) {
  // Check if it already has data URL format
  const hasDataPrefix = base64String.startsWith("data:image");

  const href = hasDataPrefix
    ? base64String
    : `data:image/png;base64,${base64String}`; // default assume PNG

  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
