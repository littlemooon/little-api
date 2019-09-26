import { writable } from 'svelte/store'

function createQueryString(query) {
  if (query) {
    const esc = encodeURIComponent
    return (
      '?' +
      Object.keys(query)
        .map(k => esc(k) + '=' + esc(query[k]))
        .join('&')
    )
  }
}

function createFetch(baseUrl, updateData = (_, data) => data) {
  const { subscribe, update } = writable({
    state: undefined,
    url: baseUrl,
    data: undefined,
    errors: [],
  })

  return {
    subscribe,
    fetch: query => {
      const url = `${baseUrl}${createQueryString(query)}`

      update(prev => ({ ...prev, state: 'loading' }))
      return fetch(url, {
        query,
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          accepts: 'application/json',
        },
      })
        .then(async r => {
          if (r.ok) {
            const data = await r.json()
            update(prev => ({
              ...prev,
              state: 'success',
              data: prev.data ? updateData(prev.data, data) : data,
            }))
          } else {
            throw new Error(`Invalid status: ${r.status}`)
          }
        })
        .catch(error => {
          update(prev => ({
            ...prev,
            state: 'error',
            errors: [
              ...prev.errors,
              { url: decodeURIComponent(url), message: error.message },
            ],
          }))
        })
    },
  }
}

export const monitor = createFetch('/api/monitor', (prev, data) => {
  return {
    ...data,
    results: prev.results.concat(data.results).sort((a, b) => {
      return a.success === b.success
        ? a.url < b.url
          ? -1
          : 1
        : a.success
        ? 1
        : -1
    }),
  }
})
