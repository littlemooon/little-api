import debug from 'debug'
import { Logger, Session } from '../types'
import storage from './storage'

function join(prefix: string, session?: Session, name?: string) {
  return [prefix, session && `(${session.id})`, name].filter(Boolean).join(' ')
}

export default function logger(_name = ''): Logger {
  const session = storage.get('session')
  const name = _name.replace(process.env.PWD || '', '').split('.')[0]

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
