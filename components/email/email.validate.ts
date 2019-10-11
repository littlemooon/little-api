import { string, object, array, InferType } from 'yup'
import validate from '../../lib/validate'

export const emailOptionsSchema = object().shape({
  /** The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>' */
  from: string().notRequired(),
  /** An e-mail address that will appear on the Sender: field */
  sender: string().notRequired(),
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the To: field */
  to: array()
    .of(string())
    .notRequired(),
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field */
  cc: array()
    .of(string())
    .notRequired(),
  /** Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field */
  bcc: array()
    .of(string())
    .notRequired(),
  /** The subject of the e-mail */
  subject: string().notRequired(),
  /** The plaintext version of the message */
  text: string().notRequired(),
  /** The HTML version of the message */
  html: string().notRequired(),
})

export type EmailOptionsSchema = InferType<typeof emailOptionsSchema>

export function validateEmailOptions(obj: any) {
  return validate(emailOptionsSchema, obj)
}
