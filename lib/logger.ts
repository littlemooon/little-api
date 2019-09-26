import debug from 'debug'
import { NowRequest } from '@now/node'

function join(prefix: string, session?: string | string[], name?: string) {
  return [prefix, session && `(${session})`, name].filter(Boolean).join(' ')
}

export default function logger(
  filename: string,
  req?: NowRequest
): {
  info: debug.Debugger
  warn: debug.Debugger
  error: debug.Debugger
  throw: (error: Error, formatter?: any, ...args: any[]) => never
} {
  const session = req && req.query.session
  const name = filename.replace(process.env.PWD || '', '')

  const info = debug(join(' • INFO ', session, name))
  const warn = debug(join(' △ WARN ', session, name))
  const error = debug(join(' ▲ ERROR', session, name))

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
