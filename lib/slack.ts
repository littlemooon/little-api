import fetch from 'node-fetch'
import { startTime, diffTime } from '../lib/measure'
import logger from '../lib/logger'
import { NowRequest } from '@now/node'

interface SlackResult {
  success: boolean
  url: string
  payload: string
  time: number
  status?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

export async function sendToSlack(
  req: NowRequest,
  url: string,
  payload: string,
): Promise<SlackResult> {
  const log = logger(__filename, req)
  const fetchStart = startTime()
  try {
    const response = await fetch(url, { method: 'POST', body: payload })
    const time = diffTime(fetchStart)
    if (response.ok) {
      log.info('Success: %d %s %s', response.status, url, time)
      return {
        url,
        payload,
        time,
        success: true,
        status: response.status,
      }
    } else {
      log.error('Failure: %d %s %s %O', response.status, url, time, payload)
      return {
        url,
        payload,
        time,
        success: false,
        status: response.status,
        error: `Response not ok`,
      }
    }
  } catch (error) {
    const time = diffTime(fetchStart)
    log.error(error, 'Failed to fetch %s', url)
    return { url, payload, time, success: false, error }
  }
}
