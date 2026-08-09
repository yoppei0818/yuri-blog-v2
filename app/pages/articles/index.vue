<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8">
        <div class="mx-auto max-w-6xl">
          <header class="border-b border-default pb-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <div class="flex items-center gap-3">
                <span class="h-7 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <h1 class="text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
                  記事一覧
                </h1>
              </div>
            </div>
            <p class="mt-4 shrink-0 text-sm text-muted sm:mt-0">
              全 <span class="font-semibold text-highlighted">{{ articles.length }}</span> 件
            </p>
          </header>

          <div
            v-if="articles.length"
            class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <ArticleCard
              v-for="article in paginatedArticles"
              :key="article.path"
              :article="article"
              heading-tag="h2"
              show-description
              :tag-limit="3"
            />
          </div>

          <ContentEmptyState
            v-else
            class="mt-6"
            icon="i-lucide-file-text"
            title="公開中の記事はありません"
            description="新しい記事を準備しています。公開までしばらくお待ちください。"
          />

          <ContentPagination
            v-if="showPagination"
            class="mt-8"
            :page="currentPage"
            :total="articles.length"
            :items-per-page="itemsPerPage"
            :to="pageLink"
          />
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData('articles:index', () => {
  return queryCollection('articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const articles = computed(() => data.value ?? [])
const {
  currentPage,
  itemsPerPage,
  pageLink,
  paginatedItems: paginatedArticles,
  showPagination,
} = useContentPagination(articles)

const pageTitle = computed(() => {
  return currentPage.value === 1
    ? '記事一覧'
    : `記事一覧（${currentPage.value}ページ目）`
})
const canonicalPath = computed(() => currentPage.value === 1
  ? route.path
  : `${route.path}?page=${currentPage.value}`)
const canonicalUrl = useCanonicalUrl(canonicalPath)

useSeoMeta({
  title: pageTitle,
  description: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
  ogTitle: pageTitle,
  ogDescription: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
  ogUrl: canonicalUrl,
  twitterCard: 'summary',
  twitterTitle: pageTitle,
  twitterDescription: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
})
</script>
