<script>
  export let status
  export let error

  const dev = process.env.NODE_ENV === 'development'
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1 class="text-6xl m-0">{status}</h1>

<p class="text-4xl text-red-600">{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
