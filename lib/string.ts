export function startsWith(str?: string | null, prefix?: string): boolean {
  return str && prefix ? str.lastIndexOf(prefix, 0) === 0 : false
}

export function startsWithOf(str?: string, prefixes?: string[]): boolean {
  return str && prefixes ? prefixes.some(p => startsWith(str, p)) : false
}

export function endsWith(str?: string, suffix?: string): boolean {
  return str && suffix
    ? str.indexOf(suffix, str.length - suffix.length) !== -1
    : false
}

export function includes(str?: string | string[], substring?: string): boolean {
  return str && substring ? str.indexOf(substring) !== -1 : false
}

export function capitalize(str?: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
