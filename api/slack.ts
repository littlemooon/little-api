import handler from '../lib/handler'
import { startTime, diffTime } from '../lib/measure'
import { sendToSlack } from '../lib/slack'

export default handler(async (req, res) => {
  const date = new Date()

  const { url, payload } = req.body

  const start = startTime()
  const result = await sendToSlack(req, url, payload)

  res.status(200).json({
    date,
    time: diffTime(start),
    result,
  })
})
