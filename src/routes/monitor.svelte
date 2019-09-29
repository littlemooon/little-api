<script>
  import { monitor } from '../stores.js'
  import { onMount } from 'svelte'

  let loading

  onMount(async () => {
    loading = true
    await Promise.all([
      monitor.fetch({ url: 'https://littlebox.littlemooon.now.sh' }),
      monitor.fetch({ url: 'https://unvanity.com' }),
      monitor.fetch({ url: 'https://api.unvanity.com' }),
      monitor.fetch({ url: 'https://dash.unvanity.com' }),
      monitor.fetch({ url: 'https://transform.foundationtraining.now.sh' }),
    ])
    loading = false
  })
</script>

<section>
  <div class="flex items-baseline text-indigo-700 text-xl font-semibold my-4">
    <h2>network monitor</h2>
    {#if loading}
      <p>...</p>
    {/if}
  </div>

  {#if $monitor.state === 'success'}
    <ul>
      {#each $monitor.data.results as result}
        <li class="flex items-center mb-4">
          {#if result.success}
            <div
              class="flex items-center bg-green-500 text-green-100 px-4 py-0
              rounded-full mr-4"
              style="margin-top:3px;">
              {result.status}
            </div>
          {:else}
            <div
              class="flex items-center bg-red-600 text-red-200 px-4 py-0
              rounded-full mr-4"
              style="margin-top:3px;">
              {result.status}
            </div>
          {/if}

          <div class="flex flex-wrap items-baseline">
            <p class="mr-4">{result.url}</p>
            <p class="">{result.time}</p>

            {#if result.error}
              <p class="w-full text-red-600">{result.error}</p>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {:else if $monitor.state === 'error'}
    <ul>
      {#each $monitor.errors as error}
        <li class="flex items-start mb-4">
          <div
            class="flex items-center bg-red-600 text-red-200 px-4 py-0
            rounded-full mr-4"
            style="margin-top:3px;">
            error
          </div>

          <div class="flex flex-wrap items-baseline">
            <p class="mr-4">{error.url}</p>
            <p class="w-full text-red-600">{error.message}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
