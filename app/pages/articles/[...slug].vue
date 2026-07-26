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
            class="article-body mt-10"
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

<style scoped>
.article-body {
  color: var(--ui-text);
  font-size: 1rem;
  line-height: 1.8;
}

.article-body :deep(h2) {
  margin-block: 2.5rem 1rem;
  border-left: 0.25rem solid var(--ui-primary);
  padding-left: 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
}

.article-body :deep(h3) {
  margin-block: 2rem 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
}

.article-body :deep(p),
.article-body :deep(ul),
.article-body :deep(ol),
.article-body :deep(blockquote),
.article-body :deep(pre) {
  margin-block: 1rem;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.5rem;
}

.article-body :deep(ul) {
  list-style: disc;
}

.article-body :deep(ol) {
  list-style: decimal;
}

.article-body :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.article-body :deep(blockquote) {
  border-left: 0.25rem solid var(--ui-border);
  padding-left: 1rem;
  color: var(--ui-text-muted);
}

.article-body :deep(pre) {
  overflow-x: auto;
  border-radius: var(--ui-radius);
  background: var(--ui-bg-muted);
  padding: 1rem;
}

.article-body :deep(:not(pre) > code) {
  border-radius: calc(var(--ui-radius) / 2);
  background: var(--ui-bg-muted);
  padding: 0.125rem 0.375rem;
  font-size: 0.9em;
}

.article-body :deep(img) {
  max-width: 100%;
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
}
</style>
