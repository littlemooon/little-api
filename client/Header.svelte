<script>
  let moonSize = 60
</script>

<header class="flex items-center">
  <div class="relative mr-6">
    <div
      class="bg-yellow-500 rounded-full"
      style={`width:${moonSize}px;height:${moonSize}px;`} />
    <div
      class="absolute bg-gray-800 rounded-full"
      style={`width:${(7 / 12) * moonSize}px;height:${(7 / 12) * moonSize}px;top:0px;left:${(5 / 12) * moonSize}px;`} />
  </div>
  <h1 class="text-yellow-500 text-5xl my-8 font-bold">frapier</h1>
</header>
