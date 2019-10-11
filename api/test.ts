import handler from '../lib/handler'
import logger from '../lib/logger'

export default handler((req, res) => {
  const log = logger(__filename)
  log.info('ʕノ•ᴥ•ʔノ %O', { body: req.body, headers: req.headers })
  res.status(200).json(req.body)
})
