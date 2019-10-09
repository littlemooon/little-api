export default {
  dev: process.env.NODE_ENV === 'development',
  host: process.env.NOW_URL || `http://localhost:3000`,
  token: process.env.API_TOKEN,
  monitor: {
    slackUrl: process.env.MONITOR_SLACK_URL as string,
  },
}
