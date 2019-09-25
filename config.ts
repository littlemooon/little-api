function splitArray(s?: string): string[] {
  return s ? s.split(',') : []
}

export default {
  token: process.env.TOKEN,
  monitor: {
    urls: splitArray(process.env.MONITOR_URLS),
    validStatuses: splitArray(process.env.MONITOR_VALID_STATUSES),
  },
}
