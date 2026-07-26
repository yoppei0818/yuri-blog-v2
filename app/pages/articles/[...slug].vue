<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8 sm:py-12">
        <article class="mx-auto max-w-3xl">
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
              <UBadge
                v-for="tag in article.tags"
                :key="tag"
                color="primary"
                variant="subtle"
              >
                {{ tag }}
              </UBadge>
            </div>

            <h1 class="mt-4 text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
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
        </article>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { formatDate } = useJaDateFormatter()

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
  ogImage: () => article.value?.thumbnail,
})
</script>
