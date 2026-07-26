<template>
  <div class="flex min-h-dvh flex-col bg-default text-default">
    <SiteHeader />

    <main class="flex-1 border-b border-default">
      <UContainer class="py-8 sm:py-12">
        <div class="mx-auto max-w-6xl">
          <ContentBreadcrumb :items="breadcrumbItems" />

          <header class="mt-6 border-b border-default pb-6 sm:flex sm:items-end sm:justify-between sm:gap-6">
            <div>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-archive" class="size-7 text-primary" />
                <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                  {{ year }}年の記事
                </h1>
              </div>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                {{ year }}年に公開した技術記事をまとめています。
              </p>
            </div>
            <p class="mt-4 shrink-0 text-sm text-muted sm:mt-0">
              全 <span class="font-semibold text-highlighted">{{ archivedArticles.length }}</span> 件
            </p>
          </header>

          <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ArticleCard
              v-for="article in paginatedArticles"
              :key="article.path"
              :article="article"
              heading-tag="h2"
              show-description
              :tag-limit="3"
            />
          </div>

          <ContentPagination
            v-if="showPagination"
            class="mt-8"
            :page="currentPage"
            :total="archivedArticles.length"
            :items-per-page="itemsPerPage"
            :to="pageLink"
          />

          <nav
            v-if="olderArchive || newerArchive"
            class="mt-8 flex items-center justify-between gap-4 border-t border-default pt-6"
            aria-label="前後の年のアーカイブ"
          >
            <UButton
              v-if="olderArchive"
              :to="`/archives/${olderArchive.year}`"
              icon="i-lucide-arrow-left"
              :label="`${olderArchive.year}年の記事`"
              color="neutral"
              variant="ghost"
            />
            <span v-else />
            <UButton
              v-if="newerArchive"
              :to="`/archives/${newerArchive.year}`"
              trailing-icon="i-lucide-arrow-right"
              :label="`${newerArchive.year}年の記事`"
              color="neutral"
              variant="ghost"
            />
          </nav>
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import {
  createArticleArchiveItems,
  filterArticlesByYear,
} from '~/utils/contentNavigation'

definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute()
const routeYear = route.params.year

if (typeof routeYear !== 'string' || !/^\d{4}$/.test(routeYear)) {
  throw createError({
    statusCode: 404,
    message: 'アーカイブが見つかりません',
  })
}

const year = routeYear
const { data } = await useAsyncData(`archives:${year}`, () => {
  return queryCollection('articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const archivedArticles = computed(() => {
  return filterArticlesByYear(data.value ?? [], year)
})
const archiveItems = computed(() => createArticleArchiveItems(data.value ?? []))

if (archivedArticles.value.length === 0) {
  throw createError({
    statusCode: 404,
    message: 'アーカイブが見つかりません',
  })
}

const {
  currentPage,
  itemsPerPage,
  pageLink,
  paginatedItems: paginatedArticles,
  showPagination,
} = useContentPagination(archivedArticles)

const breadcrumbItems = [
  { label: 'ホーム', to: '/' },
  { label: `${year}年の記事` },
]

const currentArchiveIndex = computed(() => {
  return archiveItems.value.findIndex(archive => archive.year === year)
})
const newerArchive = computed(() => {
  return currentArchiveIndex.value > 0
    ? archiveItems.value[currentArchiveIndex.value - 1]
    : undefined
})
const olderArchive = computed(() => {
  return currentArchiveIndex.value < archiveItems.value.length - 1
    ? archiveItems.value[currentArchiveIndex.value + 1]
    : undefined
})

const pageTitle = computed(() => {
  const title = `${year}年の記事`

  return currentPage.value === 1
    ? title
    : `${title}（${currentPage.value}ページ目）`
})
const pageDescription = `${year}年に公開した技術記事の一覧です。`

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
