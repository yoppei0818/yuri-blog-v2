<template>
  <div class="flex min-h-dvh flex-col bg-default text-default lg:h-dvh lg:overflow-hidden">
    <header class="sticky top-0 z-20 border-b border-default bg-default/90 backdrop-blur">
      <UContainer>
        <div class="flex h-14 items-center justify-between gap-4 sm:h-16">
          <NuxtLink
            to="/"
            class="flex h-10 w-36 shrink-0 items-center overflow-hidden sm:h-11 sm:w-44"
            aria-label="Yuri's Blog ホーム"
          >
            <img
              src="/images/site/yuris-blog-logo.png"
              alt="Yuri's Blog"
              class="w-full max-w-none object-contain"
            >
          </NuxtLink>

          <nav class="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
            <UButton
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :variant="item.to === '/' ? 'soft' : 'ghost'"
              color="neutral"
              size="sm"
            >
              {{ item.label }}
            </UButton>
          </nav>

          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-search"
              color="neutral"
              variant="ghost"
              aria-label="検索"
            />
            <UButton
              icon="i-lucide-moon"
              color="neutral"
              variant="ghost"
              aria-label="テーマ切替"
            />
          </div>
        </div>
      </UContainer>
    </header>

    <main class="min-h-0 flex-1 border-b border-default">
      <UContainer class="h-full py-4 sm:py-5">
        <div class="grid gap-6 lg:h-full lg:grid-cols-[minmax(0,1fr)_var(--site-sidebar-width)] lg:items-start">
          <div class="space-y-6">
            <section id="articles" aria-labelledby="articles-title" class="scroll-mt-24">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="h-5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    <h1 id="articles-title" class="text-xl font-semibold text-highlighted">
                      最新記事一覧
                    </h1>
                  </div>
                  <p class="mt-1.5 text-sm text-muted">
                    技術や開発に関する新しい記事をまとめています。
                  </p>
                </div>
                <UButton
                  to="/articles"
                  variant="ghost"
                  color="neutral"
                  trailing-icon="i-lucide-arrow-right"
                  size="sm"
                >
                  全ての記事を見る
                </UButton>
              </div>

              <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <UCard
                  v-for="article in latestArticles"
                  :key="article.id"
                  :ui="{ body: 'p-0 sm:p-0' }"
                  class="overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <article class="flex h-full flex-col">
                    <div class="h-24 overflow-hidden border-b border-default bg-muted sm:h-28">
                      <img
                        v-if="article.thumbnail"
                        :src="article.thumbnail"
                        :alt="article.title"
                        class="h-full w-full object-cover"
                      >
                      <div
                        v-else
                        class="flex h-full items-center justify-center text-muted"
                      >
                        <UIcon name="i-lucide-file-text" class="size-8" />
                      </div>
                    </div>

                    <div class="flex flex-1 flex-col p-3">
                      <div class="flex flex-wrap gap-2">
                        <UBadge
                          v-for="tag in article.tags.slice(0, 2)"
                          :key="tag"
                          color="primary"
                          variant="subtle"
                          size="sm"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                      <h2 class="mt-2 line-clamp-2 text-base font-semibold leading-6 text-highlighted">
                        {{ article.title }}
                      </h2>
                      <div class="mt-3 flex items-center gap-2 text-xs text-muted">
                        <UIcon name="i-lucide-calendar" class="size-4" />
                        <time :datetime="article.publishDate">
                          {{ formatDate(article.publishDate) }}
                        </time>
                      </div>
                    </div>
                  </article>
                </UCard>
              </div>
            </section>

            <section id="books" aria-labelledby="books-title" class="scroll-mt-24 border-t border-default pt-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div class="flex items-center gap-3">
                    <span class="h-5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
                    <h2 id="books-title" class="text-xl font-semibold text-highlighted">
                      最新の読了本
                    </h2>
                  </div>
                  <p class="mt-1.5 text-sm text-muted">
                    これまでに読んだ本の記録と学びをまとめています。
                  </p>
                </div>
                <UButton
                  to="/books"
                  variant="ghost"
                  color="neutral"
                  trailing-icon="i-lucide-arrow-right"
                  size="sm"
                >
                  全ての読了本を見る
                </UButton>
              </div>

              <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <UCard
                  v-for="book in latestBooks"
                  :key="book.id"
                  :ui="{ body: 'p-3 sm:p-3' }"
                >
                  <article class="flex gap-4">
                    <div class="h-24 w-16 shrink-0 overflow-hidden rounded-md border border-default bg-muted">
                      <img
                        v-if="book.cover"
                        :src="book.cover"
                        :alt="book.title"
                        class="h-full w-full object-cover"
                      >
                      <div
                        v-else
                        class="flex h-full items-center justify-center text-muted"
                      >
                        <UIcon name="i-lucide-book-open" class="size-6" />
                      </div>
                    </div>

                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-medium text-muted">
                        {{ formatDate(book.publishDate) }}
                      </p>
                      <h3 class="mt-1 line-clamp-2 font-semibold text-highlighted">
                        {{ book.title }}
                      </h3>
                      <p class="mt-1.5 text-sm text-muted">
                        {{ book.author }}
                      </p>
                      <p v-if="book.publisher" class="mt-1 text-xs text-muted">
                        {{ book.publisher }}
                      </p>
                      <div v-if="book.tags?.length" class="mt-2 flex flex-wrap gap-2">
                        <UBadge
                          v-for="tag in book.tags.slice(0, 2)"
                          :key="tag"
                          color="secondary"
                          variant="subtle"
                          size="sm"
                        >
                          {{ tag }}
                        </UBadge>
                      </div>
                    </div>
                  </article>
                </UCard>
              </div>
            </section>
          </div>

          <aside class="space-y-3 lg:sticky lg:top-20">
            <UCard id="profile" :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
              <template #header>
                <h2 class="font-semibold text-highlighted">
                  プロフィール
                </h2>
              </template>

              <div class="text-center">
                <UAvatar
                  text="Y"
                  size="3xl"
                  color="primary"
                  class="mx-auto"
                  src="/images/site/profile-image.png"
                />
                <h2 class="mt-3 text-lg font-semibold text-highlighted">
                  Yuri
                </h2>
                <p class="mt-1 text-sm font-medium text-primary">
                  Web Developer
                </p>
                <p class="mt-3 text-sm leading-6 text-muted">
                  Web アプリケーション開発が好きなエンジニアです。<br>個人開発や技術の学びを発信しています。
                </p>

                <div class="mt-4 flex justify-center gap-2">
                  <UButton
                    v-for="link in socialLinks"
                    :key="link.label"
                    :to="link.to"
                    :icon="link.icon"
                    color="neutral"
                    variant="ghost"
                    :aria-label="link.label"
                  />
                </div>
              </div>
            </UCard>

            <UCard :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
              <template #header>
                <h2 class="font-semibold text-highlighted">
                  このサイトについて
                </h2>
              </template>

              <p class="text-sm leading-6 text-muted">
                本ブログでは、技術的な学びや開発の記録、読んだ本の記録と学びをまとめています。
              </p>
            </UCard>

            <UCard :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
              <template #header>
                <h2 class="font-semibold text-highlighted">
                  アーカイブ
                </h2>
              </template>

              <div class="space-y-2">
                <UButton
                  v-for="archive in archiveItems"
                  :key="archive.year"
                  :to="`/archives/${archive.year}`"
                  color="neutral"
                  variant="ghost"
                  trailing-icon="i-lucide-chevron-right"
                  block
                  class="justify-between"
                >
                  <span>{{ archive.year }}年</span>
                  <span class="text-muted">{{ archive.count }}</span>
                </UButton>
              </div>
            </UCard>
          </aside>
        </div>
      </UContainer>
    </main>

    <footer class="shrink-0 py-3">
      <UContainer>
        <div class="flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
          <p>© 2026 Yuri's Blog. All rights reserved.</p>
          <nav class="flex items-center gap-4" aria-label="フッターナビゲーション">
            <NuxtLink to="/privacy" class="hover:text-default">
              プライバシーポリシー
            </NuxtLink>
            <NuxtLink to="/contact" class="hover:text-default">
              お問い合わせ
            </NuxtLink>
            <NuxtLink to="/sitemap" class="hover:text-default">
              サイトマップ
            </NuxtLink>
          </nav>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('home:articles', () => {
  return queryCollection('articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const { data: books } = await useAsyncData('home:books', () => {
  return queryCollection('books')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()
})

const articleItems = computed(() => articles.value ?? [])
const bookItems = computed(() => books.value ?? [])

const topPageItemLimit = 3

const latestArticles = computed(() => articleItems.value.slice(0, topPageItemLimit))
const latestBooks = computed(() => bookItems.value.slice(0, topPageItemLimit))

const archiveItems = computed(() => {
  const yearCounts = articleItems.value.reduce<Record<string, number>>((counts, article) => {
    const year = article.publishDate.slice(0, 4)
    counts[year] = (counts[year] ?? 0) + 1

    return counts
  }, {})

  return Object.entries(yearCounts)
    .map(([year, count]) => ({ year, count }))
    .sort((current, next) => next.year.localeCompare(current.year))
})

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

const navItems = [
  { label: 'ホーム', to: '/' },
  { label: '記事', to: '/articles' },
  { label: '読了本', to: '/books' },
  { label: 'アバウト', to: '/about' },
  { label: 'お問い合わせ', to: '/contact' },
]

const socialLinks = [
  { label: 'GitHub', icon: 'i-lucide-github', to: 'https://github.com/' },
  { label: 'X', icon: 'i-simple-icons-x', to: 'https://x.com/' },
  { label: 'RSS', icon: 'i-lucide-rss', to: '/rss.xml' },
]
</script>
