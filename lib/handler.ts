import { NowRequest, NowResponse } from '@now/node'
import cors from 'cors'
import config from '../config'
import logger from './logger'
import { uuid } from './utils'
import { startTime, diffTime } from './measure'

type RequestHandler = (
  req: NowRequest,
  res: NowResponse,
) => Promise<void> | void

type Middleware = (next: RequestHandler) => RequestHandler

function validToken(req: NowRequest) {
  const { query, headers, cookies } = req
  return (
    query.token === config.token ||
    headers.authorization === `Bearer ${config.token}` ||
    cookies.token === config.token
  )
}

const authenticate: Middleware = next => async (req, res) => {
  if (req.method === 'OPTIONS' || validToken(req)) {
    await next(req, res)
  } else {
    logger('auth', req).warn('Failed auth attempt %O', req.headers)
    res.status(401).end('Unauthorized')
  }
}

const session: Middleware = next => async (req, res) => {
  const session = uuid()
  req.query = { ...req.query, session }

  logger('---->', req).info('%s %s %O', req.method, req.url, {
    query: req.query,
    userAgent: req.headers['user-agent'],
  })

  await next(req, res)
}

const crossOrigin: Middleware = next => async (req, res) => {
  return cors()(req as any, res as any, () => next(req, res))
}

const tryCatch: Middleware = next => async (req, res) => {
  const start = startTime()

  try {
    await next(req, res)
  } catch (error) {
    logger(error.name || 'Error', req).error(error)
    res.status(500).end(error.message || 'Unknown Server Error')
  }

  logger('<----', req).info(
    '%s %s %s',
    res.statusCode,
    req.url,
    diffTime(start),
  )
}

export function handlerNoAuth(next: RequestHandler): RequestHandler {
  return tryCatch(crossOrigin(session(next)))
}

export default function handler(next: RequestHandler): RequestHandler {
  return handlerNoAuth(authenticate(next))
}
