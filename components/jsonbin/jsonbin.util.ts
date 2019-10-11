import fetch from '../../lib/fetch'
import config from '../../config'

const url = `https://jsonbin.org${config.jsonbin.path}`

export async function getJsonbin() {
  const result = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `token ${config.jsonbin.key}`,
    },
  })

  return result.body
}

export async function setJsonbin(data: any) {
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      Authorization: `token ${config.jsonbin.key}`,
      'Content-Type': 'application/json',
    },
    validStatus: ['422'],
  })

  return data
}
