<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8 sm:py-12">
        <div class="mx-auto max-w-6xl">
          <ContentBreadcrumb :items="breadcrumbItems" />

          <div class="mt-6 grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,48rem)_15rem] lg:items-start lg:justify-center">
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
                <div class="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div class="mx-auto w-32 shrink-0 sm:mx-0 sm:w-40">
                    <div class="aspect-[2/3] overflow-hidden rounded-lg border border-default bg-muted shadow-sm">
                      <img
                        :src="book.cover"
                        :alt="`${book.title}の表紙`"
                        class="h-full w-full object-cover"
                      >
                    </div>
                  </div>

                  <div class="min-w-0 flex-1">
                    <div
                      v-if="book.tags?.length"
                      class="flex flex-wrap gap-2"
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

                    <h1
                      class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl"
                      :class="{ 'mt-4': book.tags?.length }"
                    >
                      {{ book.title }}
                    </h1>

                    <dl class="mt-6 grid gap-3 text-sm">
                      <div class="flex gap-3">
                        <dt class="w-16 shrink-0 text-muted">
                          著者
                        </dt>
                        <dd class="font-medium text-highlighted">
                          {{ book.author }}
                        </dd>
                      </div>

                      <div
                        v-if="book.publisher"
                        class="flex gap-3"
                      >
                        <dt class="w-16 shrink-0 text-muted">
                          出版社
                        </dt>
                        <dd class="text-highlighted">
                          {{ book.publisher }}
                        </dd>
                      </div>

                      <div class="flex gap-3">
                        <dt class="w-16 shrink-0 text-muted">
                          読了日
                        </dt>
                        <dd class="flex items-center gap-2 text-highlighted">
                          <UIcon name="i-lucide-calendar" class="size-4 text-muted" />
                          <time :datetime="book.publishDate">
                            {{ formatDate(book.publishDate) }}
                          </time>
                        </dd>
                      </div>
                    </dl>
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

const breadcrumbItems = computed(() => [
  { label: 'ホーム', to: '/' },
  { label: '読了本', to: '/books' },
  { label: book.value!.title },
])

const tocLinks = computed(() => book.value?.body?.toc?.links ?? [])

const description = computed(() => {
  return `${book.value?.author}『${book.value?.title}』の読書メモです。`
})

useSeoMeta({
  title: () => book.value?.title,
  description,
  ogTitle: () => book.value?.title,
  ogDescription: description,
  ogType: 'article',
  ogImage: () => book.value?.cover,
  ogImageAlt: () => book.value
    ? `${book.value.title}の表紙`
    : undefined,
  articlePublishedTime: () => book.value?.publishDate,
  articleTag: () => book.value?.tags,
  twitterCard: 'summary_large_image',
  twitterTitle: () => book.value?.title,
  twitterDescription: description,
  twitterImage: () => book.value?.cover,
  twitterImageAlt: () => book.value
    ? `${book.value.title}の表紙`
    : undefined,
})
</script>
