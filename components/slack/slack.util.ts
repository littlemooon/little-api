import { validateSlackInput, SlackInputSchema } from './slack.validate'
import fetch from '../../lib/fetch'

export async function sendToSlack(input: SlackInputSchema) {
  const { url, body } = await validateSlackInput(input)
  return fetch(url, { method: 'POST', body })
}
