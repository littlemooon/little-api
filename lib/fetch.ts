import nodeFetch, { RequestInit, RequestInfo, Response } from 'node-fetch'
import { startTime, diffTime } from '../lib/measure'
import { FetchResult } from '../types'
import logger from './logger'
import { startsWith } from './string'

export interface FetchOptions extends RequestInit {
  validStatus?: string[]
}

async function getBody(r: Response) {
  try {
    if (r.headers.get('Content-Type') === 'application/json') {
      const json = await r.json()
      return json
    } else if (startsWith(r.headers.get('Content-Type'), 'text/')) {
      const text = await r.text()
      return text
    }
  } catch (error) {
    logger('getBody').error('Failed to parse json', error)
  }
  return r.body
}

export default async function fetch(
  info: RequestInfo,
  _opts: FetchOptions,
): Promise<FetchResult> {
  const date = new Date()
  const log = logger('fetch')
  const { validStatus, ...opts } = _opts
  const start = startTime()

  try {
    const r = await nodeFetch(info, opts)
    const time = diffTime(start)
    const body = await getBody(r)

    if (
      validStatus && validStatus.length
        ? validStatus.includes(r.status.toString())
        : r.ok
    ) {
      log.info('%d %s %s', r.status, info, time)
      return {
        date,
        info,
        opts,
        body,
        time,
        success: true,
        status: r.status,
      }
    } else {
      const time = diffTime(start)

      log.error('%d %s %s %O', r.status, info, time, opts.body || '')
      return {
        date,
        info,
        opts,
        body,
        time,
        success: false,
        status: r.status,
        error:
          validStatus && validStatus.length
            ? `Response status not one of ${validStatus}`
            : `Response not ok`,
      }
    }
  } catch (error) {
    log.error(error, '%s', info)
    return {
      date,
      info,
      opts,
      time: diffTime(start),
      success: false,
      error,
    }
  }
}
