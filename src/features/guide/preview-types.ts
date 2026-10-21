export const previewIds = ["app", "cards", "icons", "motion", "panels", "board", "state", "details"] as const;
export type PreviewId = typeof previewIds[number];
export function isPreviewId(value: unknown): value is PreviewId {
  return typeof value === "string" && previewIds.includes(value as PreviewId);
}
