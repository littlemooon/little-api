import debug from 'debug'
import { NowRequest } from '@now/node'

export interface Logger {
  info: debug.Debugger
  warn: debug.Debugger
  error: debug.Debugger
  throw: (error: Error, formatter?: any, ...args: any[]) => never
}

function join(prefix: string, session?: string | string[], name?: string) {
  return [prefix, session && `(${session})`, name].filter(Boolean).join(' ')
}

export default function logger(filename: string, req?: NowRequest): Logger {
  const session = req ? req.query.session : undefined
  const name = filename.replace(process.env.PWD || '', '').split('.')[0]

  const info = debug(join('•  INFO', session, name))
  const warn = debug(join('△  WARN', session, name))
  const error = debug(join('▲ ERROR', session, name))

  return {
    info,
    warn,
    error,
    throw: (e, ...args) => {
      error(...args)
      throw e
    },
  }
}
