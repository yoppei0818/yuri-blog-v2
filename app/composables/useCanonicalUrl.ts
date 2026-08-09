import type { MaybeRefOrGetter } from 'vue'

export const useCanonicalUrl = (path?: MaybeRefOrGetter<string>) => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const canonicalUrl = computed(() => {
    return createAbsoluteUrl(config.public.siteUrl, toValue(path) || route.path)
  })

  useHead({
    link: [
      {
        rel: 'canonical',
        href: canonicalUrl,
      },
    ],
  })

  return canonicalUrl
}
