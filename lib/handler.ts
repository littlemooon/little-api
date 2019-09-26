import { NowRequest, NowResponse } from '@now/node'
import config from '../config'
import logger from './logger'
import { uuid } from './utils'

type RequestHandler = (
  req: NowRequest,
  res: NowResponse
) => Promise<void> | void

type Middleware = (next: RequestHandler) => RequestHandler

const authenticate: Middleware = next => async (req, res) => {
  const log = logger(__filename, req)

  const headers = req.headers
  if (headers.authorization === `Bearer ${config.token}`) {
    await next(req, res)
  } else {
    log.warn('Failed auth attempt %O', req.headers)
    res.status(401).end()
  }
}

const session: Middleware = next => async (req, res) => {
  req.query = { ...req.query, session: uuid() }
  await next(req, res)
}

const tryCatch: Middleware = next => async (req, res) => {
  try {
    await next(req, res)
  } catch (error) {
    const log = logger(__filename, req)
    log.error(error)
    res.status(500).end(`${error.name}: ${error.message}`)
  }
}

export default function handler(next: RequestHandler): RequestHandler {
  return tryCatch(session(authenticate(next)))
}
