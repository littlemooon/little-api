import { writable, derived } from 'svelte/store'

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

function createFetch(url, updateData = (_, data) => data) {
  const { subscribe, update } = writable({
    state: undefined,
    url,
    data: undefined,
    error: undefined,
  })

  return {
    subscribe,
    fetch: query => {
      update(prev => ({ ...prev, state: 'loading' }))
      return fetch(`${url}${createQueryString(query)}`, {
        query,
        headers: {
          Authorization: 'Bearer example-token',
          accepts: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(async r => {
          const data = await r.json()
          update(prev => ({
            ...prev,
            state: 'success',
            data: prev.data ? updateData(prev.data, data) : data,
          }))
        })
        .catch(error => update(prev => ({ ...prev, state: 'error', error })))
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
