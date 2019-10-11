import { RequestInfo, RequestInit, Body } from 'node-fetch'
import { NowRequest, NowResponse } from '@now/node'

export type HrTime = [number, number]

export interface FetchResult {
  date: Date
  info: RequestInfo
  opts: RequestInit
  body?: Body
  success: boolean
  time: number
  status?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any
}

export interface Logger {
  info: debug.Debugger
  warn: debug.Debugger
  error: debug.Debugger
  throw: (error: Error, formatter?: any, ...args: any[]) => never
}

export type RequestHandler = (
  req: NowRequest,
  res: NowResponse,
) => Promise<void> | void

export type Middleware = (next: RequestHandler) => RequestHandler

export interface Session {
  id: string
  start: HrTime
}
