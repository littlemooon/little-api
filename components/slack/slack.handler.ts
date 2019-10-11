import handler from '../../lib/handler'
import { sendToSlack } from './slack.util'

const slackHandler = handler(async (req, res) => {
  const result = await sendToSlack(req.body)

  res.status(200).json(result)
})

export default slackHandler
