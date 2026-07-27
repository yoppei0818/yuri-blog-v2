<template>
  <UButton
    icon="i-lucide-search"
    color="neutral"
    variant="ghost"
    aria-label="検索"
    aria-keyshortcuts="Meta+K Control+K"
    class="cursor-pointer"
    @click="isOpen = true"
  />

  <UModal
    v-model:open="isOpen"
    title="サイト内検索"
    description="記事や読了本を検索できます"
  >
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        placeholder="キーワードを入力"
        :groups="searchGroups"
        :fuse="searchOptions"
        close
        autofocus
        @update:model-value="closeSearch"
        @update:open="isOpen = $event"
      >
        <template #empty="{ searchTerm: emptySearchTerm }">
          <div class="flex flex-col items-center px-6 py-10 text-center">
            <div class="flex size-10 items-center justify-center rounded-full bg-muted text-muted">
              <UIcon name="i-lucide-search-x" class="size-5" />
            </div>
            <p class="mt-3 font-medium text-highlighted">
              検索結果が見つかりません
            </p>
            <p class="mt-1 text-sm text-muted">
              「{{ emptySearchTerm }}」に一致する記事や読了本はありません。
            </p>
          </div>
        </template>

        <template #footer>
          <div class="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 px-3 py-2 text-xs text-muted">
            <span class="flex items-center gap-1">
              <UKbd value="arrowup" size="sm" />
              <UKbd value="arrowdown" size="sm" />
              選択
            </span>
            <span class="flex items-center gap-1">
              <UKbd value="enter" size="sm" />
              開く
            </span>
            <span class="flex items-center gap-1">
              <UKbd value="escape" size="sm" />
              閉じる
            </span>
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const searchTerm = ref('')

const [{ data: articles }, { data: books }] = await Promise.all([
  useAsyncData('search:articles', () => {
    return queryCollection('articles')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  }),
  useAsyncData('search:books', () => {
    return queryCollection('books')
      .where('published', '=', true)
      .order('publishDate', 'DESC')
      .all()
  }),
])

const searchGroups = computed(() => [
  {
    id: 'articles',
    label: '記事',
    items: (articles.value ?? []).map(article => ({
      label: article.title,
      suffix: [article.description, ...article.tags].join(' · '),
      icon: 'i-lucide-file-text',
      to: article.path,
    })),
  },
  {
    id: 'books',
    label: '読了本',
    items: (books.value ?? []).map(book => ({
      label: book.title,
      suffix: [book.author, book.publisher, ...(book.tags ?? [])]
        .filter(Boolean)
        .join(' · '),
      icon: 'i-lucide-book-open',
      to: book.path,
    })),
  },
])

const searchOptions = {
  fuseOptions: {
    includeMatches: true,
    threshold: 0.2,
    keys: ['label', 'suffix'],
  },
  resultLimit: 12,
  matchAllWhenSearchEmpty: true,
}

const closeSearch = () => {
  isOpen.value = false
  searchTerm.value = ''
}

watch(isOpen, (open) => {
  if (!open) {
    searchTerm.value = ''
  }
})

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    },
  },
})
</script>
