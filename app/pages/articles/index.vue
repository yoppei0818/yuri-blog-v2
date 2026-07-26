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
                <span class="h-7 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                  記事一覧
                </h1>
              </div>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                技術や開発を通して学んだこと、試したことをまとめています。
              </p>
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
              v-for="article in articles"
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
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('articles:index', () => {
  return queryCollection('articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const articles = computed(() => data.value ?? [])

const breadcrumbItems = [
  { label: 'ホーム', to: '/' },
  { label: '記事' },
]

useSeoMeta({
  title: '記事一覧',
  description: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
  ogTitle: '記事一覧',
  ogDescription: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
  twitterCard: 'summary',
  twitterTitle: '記事一覧',
  twitterDescription: '技術や開発を通して学んだこと、試したことをまとめた記事一覧です。',
})
</script>
