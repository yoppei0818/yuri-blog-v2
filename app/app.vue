<template>
  <NuxtRouteAnnouncer />
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

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
  twitterCard: 'summary',
  twitterTitle: appConfig.site.name,
  twitterDescription: appConfig.site.description,
})
</script>
