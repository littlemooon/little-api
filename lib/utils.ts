export function splitArray(s?: string | string[]): string[] {
  return s ? (Array.isArray(s) ? s : s.split(',')) : []
}
