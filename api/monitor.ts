import fetch, { Response } from 'node-fetch'
import handler from '../lib/handler'
import config from '../config'
import { startTime, diffTime } from '../lib/measure'
import { splitArray } from '../lib/utils'
import logger from '../lib/logger'
import { sendToSlack } from '../lib/slack'
import { NowRequest } from '@now/node'

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

async function notifySlack(req: NowRequest, results: MonitorResult[]) {
  const sortedResults = results.sort((a, b) => {
    return a.success === b.success
      ? a.time > b.time
        ? -1
        : 1
      : a.success
      ? 1
      : -1
  })

  const failBlocks = sortedResults.reduce<object[]>((acc, r) => {
    if (r.success) {
      acc.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [`*${r.status}* ${r.url} ${r.time}`, r.error]
            .filter(Boolean)
            .join('\n'),
        },
      })
    }
    return acc
  }, [])
  const failCount = failBlocks.length

  await sendToSlack(
    req,
    config.monitor.slackUrl,
    JSON.stringify(
      failCount
        ? {
            text: `:apple: @channel ${failCount} of ${sortedResults.length} urls failed`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:apple: @channel *${failCount}* of ${sortedResults.length} urls failed`,
                },
              },
              { type: 'divider' },
              ...failBlocks,
            ].filter(Boolean),
          }
        : {
            text: `:green_apple: All ${sortedResults.length} monitored urls passed`,
          },
    ),
  )
}

export default handler(async (req, res) => {
  const log = logger(__filename, req)
  const date = new Date()

  const urls = splitArray(req.query.url)
  const validStatuses = splitArray(req.query.status)
  const shouldSlack = Boolean(req.query.slack)

  const start = startTime()
  const results: MonitorResult[] = await Promise.all(
    urls.map(async url => {
      const fetchStart = startTime()
      try {
        const response = await fetch(url)
        const time = diffTime(fetchStart)
        if (isValidResponse(validStatuses, response)) {
          log.info('Pass: %d %s %s', response.status, url, time)
          return {
            url,
            time,
            success: true,
            status: response.status,
          }
        } else {
          log.warn('Fail: %d %s %s', response.status, url, time)
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
    }),
  )

  if (shouldSlack) {
    await notifySlack(req, results)
  }

  res.status(200).json({
    date,
    time: diffTime(start),
    config: { ...config.monitor, urls },
    results,
  })
})
