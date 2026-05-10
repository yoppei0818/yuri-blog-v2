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
</script>

<template>
  <main class="min-h-screen">
    <UContainer class="py-10">
      <h1 class="text-2xl font-semibold text-highlighted">
        YURI-TECH
      </h1>
      <p class="mt-3 text-muted">
        技術記事と読了本をまとめる個人ブログです。
      </p>

      <section class="mt-10">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-highlighted">
              最新記事
            </h2>
            <p class="mt-1 text-sm text-muted">
              公開済みの記事を新しい順に表示します。
            </p>
          </div>
          <span class="text-sm text-muted">{{ articleItems.length }} 件</span>
        </div>

        <div class="mt-4 space-y-3">
          <article
            v-for="article in articleItems"
            :key="article.id"
            class="rounded-lg border border-default bg-default p-4"
          >
            <p class="text-xs text-muted">
              {{ article.publishDate }}
            </p>
            <h3 class="mt-1 font-semibold text-highlighted">
              {{ article.title }}
            </h3>
            <p class="mt-2 text-sm text-muted">
              {{ article.description }}
            </p>
          </article>
        </div>
      </section>

      <section class="mt-10">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-highlighted">
              読了本
            </h2>
            <p class="mt-1 text-sm text-muted">
              公開済みの読書メモを新しい順に表示します。
            </p>
          </div>
          <span class="text-sm text-muted">{{ bookItems.length }} 件</span>
        </div>

        <div class="mt-4 space-y-3">
          <article
            v-for="book in bookItems"
            :key="book.id"
            class="rounded-lg border border-default bg-default p-4"
          >
            <p class="text-xs text-muted">
              {{ book.publishDate }}
            </p>
            <h3 class="mt-1 font-semibold text-highlighted">
              {{ book.title }}
            </h3>
            <p class="mt-2 text-sm text-muted">
              {{ book.author }}
            </p>
          </article>
        </div>
      </section>
    </UContainer>
  </main>
</template>
