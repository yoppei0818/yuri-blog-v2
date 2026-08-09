// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
  ],
  nitro: {
    prerender: {
      routes: ['/rss.xml'],
    },
  },
  css: ['~/assets/css/main.css'],
  fonts: {
    providers: {
      google: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      adobe: false,
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
