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
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: ['@nuxt/content@v3:urls'],
  },
  robots: {
    sitemap: ['/sitemap.xml'],
  },
  nitro: {
    prerender: {
      routes: ['/rss.xml', '/sitemap.xml', '/robots.txt'],
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
