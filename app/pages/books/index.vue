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
                <span class="h-7 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                <h1 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
                  読了本一覧
                </h1>
              </div>
              <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                これまでに読んだ本と、そこから得た学びをまとめています。
              </p>
            </div>
            <p class="mt-4 shrink-0 text-sm text-muted sm:mt-0">
              全 <span class="font-semibold text-highlighted">{{ books.length }}</span> 件
            </p>
          </header>

          <div
            v-if="books.length"
            class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <BookCard
              v-for="book in books"
              :key="book.path"
              :book="book"
              heading-tag="h2"
              :tag-limit="3"
            />
          </div>

          <ContentEmptyState
            v-else
            class="mt-6"
            icon="i-lucide-book-open"
            title="公開中の読了本はありません"
            description="読書記録を準備しています。公開までしばらくお待ちください。"
          />
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData('books:index', () => {
  return queryCollection('books')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const books = computed(() => data.value ?? [])

const breadcrumbItems = [
  { label: 'ホーム', to: '/' },
  { label: '読了本' },
]

useSeoMeta({
  title: '読了本一覧',
  description: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
  ogTitle: '読了本一覧',
  ogDescription: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
  twitterCard: 'summary',
  twitterTitle: '読了本一覧',
  twitterDescription: 'これまでに読んだ本と、そこから得た学びをまとめた読了本一覧です。',
})
</script>
