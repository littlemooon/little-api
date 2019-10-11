import handler from '../../lib/handler'
import logger from '../../lib/logger'
import { setJsonbin, getJsonbin } from './jsonbin.util'

export default handler(async (req, res) => {
  const log = logger(__filename)

  if (req.method === 'POST') {
    const json = await setJsonbin(req.body)
    log.info(json)
    res.status(200).json(req.body)
  } else {
    const json = await getJsonbin()
    log.info(json)
    res.status(200).json(json)
  }
})
