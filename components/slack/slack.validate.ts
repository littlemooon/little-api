import { string, object, InferType } from 'yup'
import validate from '../../lib/validate'

export const slackInputSchema = object().shape({
  url: string().required(),
  body: string().required(),
})

export type SlackInputSchema = InferType<typeof slackInputSchema>

export function validateSlackInput(input: any) {
  return validate(slackInputSchema, input)
}
