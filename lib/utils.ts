import config from '../config'

export function splitArray(s?: string | string[]): string[] {
  return s ? (Array.isArray(s) ? s : s.split(',')) : []
}

export function uuid() {
  const s = config.dev ? 'xxx' : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return s.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
