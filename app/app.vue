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
