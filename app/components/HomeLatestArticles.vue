<template>
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
        v-for="article in articles"
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
</template>

<script setup lang="ts">
interface ArticleItem {
  id: string
  publishDate: string
  tags: string[]
  thumbnail?: string
  title: string
}

defineProps<{
  articles: ArticleItem[]
}>()

const { formatDate } = useJaDateFormatter()
</script>
