import handler from '../../lib/handler'
import { sendEmail } from './email.util'

const emailHandler = handler(async (req, res) => {
  const result = await sendEmail(req.body)

  res.status(200).json(result)
})

export default emailHandler
