<template>
  <NuxtRouteAnnouncer />
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const config = useRuntimeConfig()
const siteOgpImageUrl = createAbsoluteUrl(
  config.public.siteUrl,
  '/images/og/yuris-blog-ogp.png',
)

useHead({
  htmlAttrs: {
    lang: 'ja',
  },
  titleTemplate: title => title
    ? `${title} | ${appConfig.site.name}`
    : appConfig.site.name,
  meta: [
    { name: 'author', content: appConfig.site.author },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/icons/favicon.png',
      sizes: '512x512',
    },
    {
      rel: 'apple-touch-icon',
      href: '/icons/apple-touch-icon.png',
      sizes: '180x180',
    },
  ],
})

useSeoMeta({
  description: appConfig.site.description,
  ogTitle: appConfig.site.name,
  ogDescription: appConfig.site.description,
  ogType: 'website',
  ogSiteName: appConfig.site.name,
  ogLocale: 'ja_JP',
  ogImage: siteOgpImageUrl,
  ogImageAlt: `${appConfig.site.name}のOGP画像`,
  twitterCard: 'summary',
  twitterTitle: appConfig.site.name,
  twitterDescription: appConfig.site.description,
  twitterImage: siteOgpImageUrl,
  twitterImageAlt: `${appConfig.site.name}のOGP画像`,
})
</script>
