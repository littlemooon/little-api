export function splitArray(s?: string | string[]): string[] {
  return s ? (Array.isArray(s) ? s : s.split(',')) : []
}

export function uuid() {
  return 'xxxxxxxx-xxxx'.replace(/[xy]/g, c => {
    /* tslint:disable */
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
    /* tslint:enable */
  })
}
