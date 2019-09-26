import fetch, { Response } from 'node-fetch'
import handler from '../lib/handler'
import config from '../config'
import { startTime, diffTime } from '../lib/measure'
import { splitArray } from '../lib/utils'
import logger from '../lib/logger'

interface MonitorResult {
  success: boolean
  url: string
  time: number
  status?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

function isValidResponse(validStatuses: string[], response: Response): boolean {
  if (validStatuses.length) {
    return validStatuses.includes(response.status.toString())
  } else {
    return response.ok
  }
}

export default handler(async (req, res) => {
  const log = logger(__filename, req)
  const date = new Date()

  const queryUrls = splitArray(req.query.url)
  const urls = queryUrls.length ? queryUrls : config.monitor.urls

  const queryValidStatuses = splitArray(req.query.validStatuses)
  const validStatuses = queryValidStatuses.length
    ? queryValidStatuses
    : config.monitor.validStatuses

  const start = startTime()
  const results: MonitorResult[] = await Promise.all(
    urls.map(async url => {
      const fetchStart = startTime()
      try {
        const response = await fetch(url)
        const time = diffTime(fetchStart)
        if (isValidResponse(validStatuses, response)) {
          log.info('Success: %s %d  %s', time, response.status, url)
          return {
            url,
            time,
            success: true,
            status: response.status,
          }
        } else {
          log.warn('Failure: %s %d  %s', time, response.status, url)
          return {
            url,
            time,
            success: false,
            status: response.status,
            error: `${
              response.status
            } not one of ${validStatuses.toString().replace(',', ', ')}`,
          }
        }
      } catch (error) {
        const time = diffTime(fetchStart)
        log.error(error, 'Failed to fetch %s', url)
        return { url, time, success: false, error }
      }
    })
  )

  res.status(200).json({
    date,
    time: diffTime(start),
    config: { ...config.monitor, urls },
    results,
  })
})
