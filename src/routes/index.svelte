<style>
  .hero {
    height: calc(90vh - 64px);
  }
  .social__link img {
    height: 48px;
    width: 48px;
    min-height: 48px;
    min-width: 48px;
  }
  .social__link + .social__link {
    @apply ml-6;
  }
</style>

<figure class="hero flex flex-col md:flex-row items-center py-8 justify-center">
  <img alt="moon logo" src="mooon.svg" />
  <div class="flex flex-col md:ml-6 items-center md:items-start">
    <h1 class="text-4xl sm:text-5xl lg:text-6xl leading-none font-thin">
      littlemooon
    </h1>
    <h2 class="text-2xl font-medium sm:text-2xl md:text-3xl lg:text-4xl">
      design + development
    </h2>
    <div class="social flex mt-2">
      <a
        class="social__link"
        alt="github"
        href="https://github.com/littlemooon">
        <img alt="github logo" src="social_github.svg" />
      </a>
      <a
        class="social__link"
        alt="linkedin"
        href="http://www.linkedin.com/in/fred-wright">
        <img alt="linkedin logo" src="social_linkedin.svg" />
      </a>
      <a
        class="social__link"
        alt="github"
        href="https://twitter.com/littlemooon">
        <img alt="twitter logo" src="social_twitter.svg" />
      </a>
    </div>
  </div>
</figure>
