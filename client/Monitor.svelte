<script>
  import { monitor } from './stores.js'
  import { onMount } from 'svelte'

  let loading

  onMount(async () => {
    loading = true
    await Promise.all([
      monitor.fetch({ url: 'https://unvanity.com' }),
      monitor.fetch({ url: 'https://api.unvanity.com' }),
      monitor.fetch({ url: 'https://dash.unvanity.com' }),
      monitor.fetch({ url: 'https://transform.foundationtraining.now.sh' }),
      monitor.fetch({ url: 'https://frapier.littlemooon.now.sh' }),
    ])
    loading = false
  })
</script>

<section>
  <div class="flex items-baseline text-yellow-600 text-xl font-semibold my-4">
    <h2>network monitor</h2>
    {#if loading}
      <p>...</p>
    {/if}
  </div>

  {#if $monitor.state === 'success'}
    <ul>
      {#each $monitor.data.results as result}
        <li class="flex items-start mb-4">
          {#if result.success}
            <div
              class="flex items-center bg-green-600 text-green-200 px-4 py-0
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
            <p class="text-yellow-500 text-xl mr-4">{result.url}</p>
            <p class="text-yellow-600">{result.time}</p>

            {#if result.error}
              <p class="w-full text-red-600 font-semibold">{result.error}</p>
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
            <p class="text-yellow-500 text-xl mr-4">{error.url}</p>
            <p class="w-full text-red-600 font-semibold">{error.message}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
