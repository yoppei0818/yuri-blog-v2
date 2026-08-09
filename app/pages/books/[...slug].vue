<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <div class="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,48rem)_15rem] lg:items-start lg:justify-center">
            <article class="min-w-0">
              <UButton
                to="/books"
                icon="i-lucide-arrow-left"
                label="読了本一覧へ戻る"
                color="neutral"
                variant="ghost"
                size="sm"
                class="mb-6"
              />

              <header class="border-b border-default pb-8">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <UBadge color="secondary" variant="subtle">
                      読了
                    </UBadge>
                    <time :datetime="book.publishDate" class="text-sm text-muted">
                      {{ formatDate(book.publishDate) }}
                    </time>
                  </div>

                  <h1 class="mt-4 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl lg:text-4xl">
                    {{ book.title }}
                  </h1>

                  <dl class="mt-5 grid gap-1.5 text-xs">
                    <div class="flex gap-1">
                      <dt class="shrink-0 text-muted">
                        著者名：
                      </dt>
                      <dd class="text-muted">
                        {{ book.author }}
                      </dd>
                    </div>

                    <div
                      v-if="book.publisher"
                      class="flex gap-1"
                    >
                      <dt class="shrink-0 text-muted">
                        出版社：
                      </dt>
                      <dd class="text-muted">
                        {{ book.publisher }}
                      </dd>
                    </div>
                  </dl>

                  <div
                    v-if="book.tags?.length"
                    class="mt-5 flex flex-wrap gap-2"
                  >
                    <NuxtLink
                      v-for="tag in book.tags"
                      :key="tag"
                      :to="tagPath(tag)"
                      class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                      :aria-label="`${tag}タグのコンテンツを見る`"
                    >
                      <UBadge color="secondary" variant="subtle">
                        {{ tag }}
                      </UBadge>
                    </NuxtLink>
                  </div>
                </div>
              </header>

              <ContentRenderer
                :value="book"
                class="content-body content-body-secondary mt-10"
              />

              <div class="mt-10 border-t border-default pt-6">
                <UButton
                  to="/books"
                  icon="i-lucide-arrow-left"
                  label="読了本一覧へ戻る"
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

const { data: book } = await useAsyncData(
  `book:${route.path}`,
  () => queryCollection('books')
    .path(route.path)
    .where('published', '=', true)
    .first(),
)

if (!book.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '読了本が見つかりません',
  })
}

const tocLinks = computed(() => book.value?.body?.toc?.links ?? [])

const description = computed(() => {
  return `${book.value?.author}『${book.value?.title}』の読書メモです。`
})
const canonicalUrl = useCanonicalUrl()

useSeoMeta({
  title: () => book.value?.title,
  description,
  ogTitle: () => book.value?.title,
  ogDescription: description,
  ogType: 'article',
  ogUrl: canonicalUrl,
  articlePublishedTime: () => book.value?.publishDate,
  articleTag: () => book.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => book.value?.title,
  twitterDescription: description,
})
</script>
