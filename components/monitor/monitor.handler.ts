import handler from '../../lib/handler'
import config from '../../config'
import { startTime, diffTime } from '../../lib/measure'
import { splitArray } from '../../lib/utils'
import { notifySlack, notifyEmail } from './monitor.util'
import { FetchResult } from '../../types'
import fetch from '../../lib/fetch'

const monitorHandler = handler(async (req, res) => {
  const urls = splitArray(req.query.url)
  const validStatus = splitArray(req.query.status)
  const shouldSlack = Boolean(req.query.slack)
  const shouldEmail = Boolean(req.query.email)

  const start = startTime()
  const results: FetchResult[] = await Promise.all(
    urls.map(async url => fetch(url, { validStatus })),
  )

  if (shouldSlack) {
    await notifySlack(results)
  }

  if (shouldEmail) {
    await notifyEmail(results)
  }

  res.status(200).json({
    time: diffTime(start),
    config: { ...config.monitor, urls },
    results,
  })
})

export default monitorHandler
