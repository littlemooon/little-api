import { NowRequest } from '@now/node'
import cors from 'cors'
import config from '../config'
import logger from './logger'
import { uuid } from './utils'
import { startTime, diffTime } from './measure'
import { Middleware, RequestHandler, Session } from '../types'
import storage from './storage'

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
    logger('auth').warn('Failed auth attempt %O', req.headers)
    res.status(401).end('Unauthorized')
  }
}

const session: Middleware = next => async (req, res) => {
  const start = startTime()
  const session: Session = { id: uuid(), start }

  storage.run(async () => {
    storage.set('session', session)
    const log = logger()
    const url = req.url ? req.url.split('?')[0] : ''

    log.info('---> %s %s %O', req.method, url, {
      query: req.query,
      userAgent: req.headers['user-agent'],
    })

    await next(req, res)
    log.info('<--- %s %s %s', res.statusCode, url, diffTime(start))
  })
}

const crossOrigin: Middleware = next => async (req, res) => {
  return cors()(req as any, res as any, () => next(req, res))
}

const tryCatch: Middleware = next => async (req, res) => {
  try {
    await next(req, res)
  } catch (error) {
    logger(error.name || 'Error').error(error)
    res.status(500).end(error.message || 'Unknown Server Error')
  }
}

export function handlerNoAuth(next: RequestHandler): RequestHandler {
  return tryCatch(crossOrigin(session(next)))
}

export default function handler(next: RequestHandler): RequestHandler {
  return handlerNoAuth(authenticate(next))
}
