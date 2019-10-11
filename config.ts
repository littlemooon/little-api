export default {
  dev: process.env.NODE_ENV === 'development',
  host: process.env.NOW_URL || `http://localhost:3000`,
  token: process.env.API_TOKEN,
  monitor: {
    slackUrl: process.env.MONITOR_SLACK_URL as string,
    emailTo: process.env.MONITOR_EMAIL_TO as string,
    emailFrom: process.env.MONITOR_EMAIL_FROM as string,
  },
  jsonbin: {
    path: process.env.JSONBIN_PATH,
    key: process.env.JSONBIN_KEY,
  },
  email: {
    host: process.env.EMAIL_HOST as string,
    port: process.env.EMAIL_PORT as string,
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
}
