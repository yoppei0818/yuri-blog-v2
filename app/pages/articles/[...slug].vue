<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <div class="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,48rem)_15rem] lg:items-start lg:justify-center">
            <article class="min-w-0">
              <UButton
                to="/articles"
                icon="i-lucide-arrow-left"
                label="記事一覧へ戻る"
                color="neutral"
                variant="ghost"
                size="sm"
                class="mb-6"
              />

              <header class="border-b border-default pb-8">
                <div class="flex flex-wrap gap-2">
                  <NuxtLink
                    v-for="tag in article.tags"
                    :key="tag"
                    :to="tagPath(tag)"
                    class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    :aria-label="`${tag}タグのコンテンツを見る`"
                  >
                    <UBadge color="primary" variant="subtle">
                      {{ tag }}
                    </UBadge>
                  </NuxtLink>
                </div>

                <h1 class="mt-4 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl lg:text-4xl">
                  {{ article.title }}
                </h1>
                <p class="mt-4 text-base leading-7 text-muted sm:text-lg">
                  {{ article.description }}
                </p>

                <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-calendar" class="size-4" />
                    <span>公開日</span>
                    <time :datetime="article.publishDate">
                      {{ formatDate(article.publishDate) }}
                    </time>
                  </div>

                  <div
                    v-if="showUpdatedDate"
                    class="flex items-center gap-2"
                  >
                    <UIcon name="i-lucide-refresh-cw" class="size-4" />
                    <span>更新日</span>
                    <time :datetime="article.updated">
                      {{ formatDate(article.updated!) }}
                    </time>
                  </div>
                </div>
              </header>

              <div
                v-if="article.thumbnail"
                class="mt-8 overflow-hidden rounded-lg border border-default bg-muted"
              >
                <img
                  :src="article.thumbnail"
                  :alt="article.title"
                  class="aspect-video w-full object-cover"
                >
              </div>

              <ContentRenderer
                :value="article"
                class="content-body mt-10"
              />

              <section
                v-if="relatedArticles.length"
                class="mt-12 border-t border-default pt-8"
                aria-labelledby="related-articles-title"
              >
                <h2
                  id="related-articles-title"
                  class="text-xl font-semibold text-highlighted"
                >
                  関連記事
                </h2>
                <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <NuxtLink
                    v-for="relatedArticle in relatedArticles"
                    :key="relatedArticle.id"
                    :to="relatedArticle.path"
                    class="group rounded-lg border border-default bg-elevated p-4 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div class="flex flex-wrap gap-1.5">
                      <UBadge
                        v-for="tag in relatedArticle.tags.slice(0, 2)"
                        :key="tag"
                        color="primary"
                        variant="subtle"
                        size="sm"
                      >
                        {{ tag }}
                      </UBadge>
                    </div>
                    <h3 class="mt-3 line-clamp-2 font-semibold text-highlighted group-hover:text-primary">
                      {{ relatedArticle.title }}
                    </h3>
                    <time
                      :datetime="relatedArticle.publishDate"
                      class="mt-3 block text-xs text-muted"
                    >
                      {{ formatDate(relatedArticle.publishDate) }}
                    </time>
                  </NuxtLink>
                </div>
              </section>

              <div class="mt-10 border-t border-default pt-6">
                <UButton
                  to="/articles"
                  icon="i-lucide-arrow-left"
                  label="記事一覧へ戻る"
                  color="neutral"
                  variant="soft"
                />
              </div>
            </article>

            <aside class="order-first lg:order-last lg:sticky lg:top-24">
              <ContentTableOfContents :links="tocLinks" />
            </aside>
          </div>
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { formatDate } = useJaDateFormatter()
const tagPath = (tag: string) => `/tags/${encodeURIComponent(tag)}`

const { data: article } = await useAsyncData(
  `article:${route.path}`,
  () => queryCollection('articles')
    .path(route.path)
    .where('published', '=', true)
    .first(),
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '記事が見つかりません',
  })
}

const { data: articleCandidates } = await useAsyncData(
  `related-articles:${route.path}`,
  () => queryCollection('articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all(),
)

const tocLinks = computed(() => article.value?.body?.toc?.links ?? [])

const relatedArticles = computed(() => {
  const currentArticle = article.value

  if (!currentArticle) {
    return []
  }

  return (articleCandidates.value ?? [])
    .filter((candidate) => {
      return candidate.path !== currentArticle.path
        && candidate.tags.some(tag => currentArticle.tags.includes(tag))
    })
    .slice(0, 3)
})

const showUpdatedDate = computed(() => {
  return Boolean(
    article.value?.updated
    && article.value.updated !== article.value.publishDate,
  )
})

useSeoMeta({
  title: () => article.value?.title,
  description: () => article.value?.description,
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.description,
  ogType: 'article',
  ogImage: () => article.value?.thumbnail,
  ogImageAlt: () => article.value
    ? `${article.value.title}のサムネイル`
    : undefined,
  articlePublishedTime: () => article.value?.publishDate,
  articleModifiedTime: () => article.value?.updated,
  articleTag: () => article.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.title,
  twitterDescription: () => article.value?.description,
  twitterImage: () => article.value?.thumbnail,
  twitterImageAlt: () => article.value
    ? `${article.value.title}のサムネイル`
    : undefined,
})
</script>
