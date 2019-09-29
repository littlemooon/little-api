<script>
  export let segment
</script>

{#if segment !== undefined}
  <header class="flex items-center pt-4">
    <img alt="moon logo" src="mooon_small.svg" />
    <h1 class="text-4xl ml-2 font-thin">littlemooon</h1>
  </header>
{/if}

<main>
  <slot />
</main>

<footer class="pt-8 pb-2 w-full flex justify-center">
  <p class="text-indigo-800">
    <span class="text-sm">made in 🌏 by</span>
    <a
      class="font-semibold hover:underline"
      href="https://github.com/littlemooon">
      fred wright
    </a>
  </p>
</footer>
