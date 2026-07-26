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
      <ArticleCard
        v-for="article in articles"
        :key="article.path"
        :article="article"
        heading-tag="h2"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
interface ArticleItem {
  description?: string
  path: string
  publishDate: string
  tags: string[]
  thumbnail?: string
  title: string
}

defineProps<{
  articles: ArticleItem[]
}>()
</script>
