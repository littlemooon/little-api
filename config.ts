import { splitArray } from './lib/utils'

export default {
  token: process.env.API_TOKEN,
  monitor: {
    urls: splitArray(process.env.MONITOR_URLS),
    validStatuses: splitArray(process.env.MONITOR_VALID_STATUSES),
  },
}
