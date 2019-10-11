import nodemailer, { SentMessageInfo } from 'nodemailer'
import logger from '../../lib/logger'
import { startTime, diffTime } from '../../lib/measure'
import config from '../../config'
import { validateEmailOptions, EmailOptionsSchema } from './email.validate'

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
} as any)

export async function sendEmail(
  _opts: EmailOptionsSchema,
): Promise<{
  success: boolean
  error?: any
  info?: SentMessageInfo
  time: number
}> {
  const log = logger('sendEmail')
  const start = startTime()

  try {
    const opts = await validateEmailOptions(_opts)

    const info = await transporter.sendMail(opts)

    log.info(info)
    return { success: true, info, time: diffTime(start) }
  } catch (error) {
    log.error(error)
    return { success: false, error: error.message, time: diffTime(start) }
  }
}
