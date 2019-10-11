import config from '../../config'
import { sendToSlack } from '../slack/slack.util'
import { FetchResult } from '../../types'
import { sendEmail } from '../email/email.util'
import { splitArray } from '../../lib/utils'

function sortResults(results: FetchResult[]) {
  return results.sort((a, b) => {
    return a.success === b.success
      ? a.time > b.time
        ? -1
        : 1
      : a.success
      ? 1
      : -1
  })
}

export async function notifySlack(results: FetchResult[]) {
  const sortedResults = sortResults(results)

  const failBlocks = sortedResults.reduce<object[]>((acc, r) => {
    if (!r.success) {
      acc.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: [`*${r.status}* ${r.info} ${r.time}`, r.error]
            .filter(Boolean)
            .join('\n'),
        },
      })
    }
    return acc
  }, [])
  const failCount = failBlocks.length

  await sendToSlack({
    url: config.monitor.slackUrl,
    body: JSON.stringify(
      failCount
        ? {
            text: `:apple: @channel ${failCount} of ${sortedResults.length} urls failed`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `:apple: @channel *${failCount}* of ${sortedResults.length} urls failed`,
                },
              },
              { type: 'divider' },
              ...failBlocks,
            ].filter(Boolean),
          }
        : {
            text: `:green_apple: All ${sortedResults.length} monitored urls passed`,
          },
    ),
  })
}

export async function notifyEmail(results: FetchResult[]) {
  const sortedResults = sortResults(results)

  const failCount = sortedResults.filter(r => !r.success).length

  const resultText = sortedResults
    .map(r =>
      [`${r.status} ${r.info} ${r.time}`, r.error].filter(Boolean).join('\n'),
    )
    .join('\n\n')

  await sendEmail({
    from: config.monitor.emailFrom,
    to: splitArray(config.monitor.emailTo),
    subject: failCount
      ? `:apple: ${failCount} of ${sortedResults.length} urls failed`
      : `:green_apple: All ${sortedResults.length} monitored urls passed`,
    text: resultText,
  })
}
