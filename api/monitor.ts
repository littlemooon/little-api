import fetch, { Response } from 'node-fetch'
import authenticateAndCatch from '../lib/authenticateAndCatch'
import config from '../config'
import { startTime, diffTime } from '../lib/measure'

interface MonitorResult {
  success: boolean
  url: string
  time: number
  status?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

const validStatuses = config.monitor.validStatuses

function isValidResponse(response: Response): boolean {
  if (validStatuses.length) {
    return validStatuses.includes(response.status.toString())
  } else {
    return response.ok
  }
}

export default authenticateAndCatch(__filename, async (req, res) => {
  const date = new Date()
  const start = startTime()

  const results: MonitorResult[] = await Promise.all(
    config.monitor.urls.map(async url => {
      const fetchStart = startTime()
      try {
        const response = await fetch(url)
        const time = diffTime(fetchStart)
        if (isValidResponse(response)) {
          return {
            url,
            time,
            success: true,
            status: response.status,
          }
        } else {
          return {
            url,
            time,
            success: false,
            status: response.status,
          }
        }
      } catch (error) {
        const time = diffTime(fetchStart)
        return { url, time, success: false, error }
      }
    })
  )

  res.status(200).json({
    date,
    time: diffTime(start),
    config: config.monitor,
    results,
  })
})
