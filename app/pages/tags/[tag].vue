<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <header class="border-b border-default pb-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-tag" class="size-7 text-primary" />
                <h1 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
                  {{ tag }} のコンテンツ
                </h1>
              </div>
            </div>
            <p class="mt-4 shrink-0 text-sm text-muted sm:mt-0">
              全 <span class="font-semibold text-highlighted">{{ totalCount }}</span> 件
            </p>
          </header>

          <section
            v-if="taggedArticles.length"
            class="mt-8"
            aria-labelledby="tagged-articles-title"
          >
            <div class="flex items-end justify-between gap-4">
              <h2 id="tagged-articles-title" class="text-xl font-semibold text-highlighted">
                記事
              </h2>
              <p class="text-sm text-muted">
                {{ taggedArticles.length }} 件
              </p>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ArticleCard
                v-for="article in taggedArticles"
                :key="article.path"
                :article="article"
                heading-tag="h3"
                show-description
                :tag-limit="3"
              />
            </div>
          </section>

          <section
            v-if="taggedBooks.length"
            class="mt-8 border-t border-default pt-8"
            aria-labelledby="tagged-books-title"
          >
            <div class="flex items-end justify-between gap-4">
              <h2 id="tagged-books-title" class="text-xl font-semibold text-highlighted">
                読了本
              </h2>
              <p class="text-sm text-muted">
                {{ taggedBooks.length }} 件
              </p>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <BookCard
                v-for="book in taggedBooks"
                :key="book.path"
                :book="book"
                heading-tag="h3"
                :tag-limit="3"
              />
            </div>
          </section>
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const routeTag = route.params.tag

if (typeof routeTag !== 'string' || !routeTag) {
  throw createError({
    statusCode: 404,
    message: 'タグが見つかりません',
  })
}

const [{ data: articles }, { data: books }] = await Promise.all([
  useAsyncData('tags:articles', () => {
    return queryCollection('articles')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  }),
  useAsyncData('tags:books', () => {
    return queryCollection('books')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  }),
])

const taggedArticles = computed(() => {
  return (articles.value ?? []).filter(article => article.tags.includes(routeTag))
})
const taggedBooks = computed(() => {
  return (books.value ?? []).filter(book => book.tags?.includes(routeTag))
})
const totalCount = computed(() => taggedArticles.value.length + taggedBooks.value.length)

if (totalCount.value === 0) {
  throw createError({
    statusCode: 404,
    message: 'タグが見つかりません',
  })
}

const tag = computed(() => {
  return taggedArticles.value[0]?.tags.find(item => item === routeTag)
    ?? taggedBooks.value[0]?.tags?.find(item => item === routeTag)
    ?? routeTag
})

const pageTitle = computed(() => `${tag.value} のコンテンツ`)
const pageDescription = computed(() => {
  return `「${tag.value}」タグが付いた記事と読了本の一覧です。`
})

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})
</script>
