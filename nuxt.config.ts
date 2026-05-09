// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
  ],
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
