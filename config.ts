import { splitArray } from './lib/utils'

export default {
  dev: process.env.NODE_ENV === 'development',
  host: process.env.NOW_URL || `http://localhost:3000`,
  token: process.env.API_TOKEN,
  monitor: {
    urls: splitArray(process.env.MONITOR_URLS),
    validStatuses: splitArray(process.env.MONITOR_VALID_STATUSES),
  },
}
