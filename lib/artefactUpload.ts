export const ARTEFACT_MAX_BYTES = 5 * 1024 * 1024;
export const ARTEFACT_MAX_MB = 5;

export function formatArtefactBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}
