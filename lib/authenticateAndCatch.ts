import { NowRequest, NowResponse } from '@now/node'
import config from '../config'

type RequestHandler = (req: NowRequest, res: NowResponse) => void

export default function authenticateAndCatch(
  filename: string,
  next: RequestHandler
): RequestHandler {
  return (req: NowRequest, res: NowResponse): void => {
    try {
      const headers = req.headers
      if (headers.authorization === `Bearer ${config.token}`) {
        next(req, res)
      } else {
        console.log('Failed auth', req.headers)
        res.status(401).end()
      }
    } catch (error) {
      console.error('ERROR:', filename, error.message)
      console.error(error)
      res.status(500).end(`${error.name}: ${error.message}`)
    }
  }
}
