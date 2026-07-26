<template>
  <UButton
    icon="i-lucide-search"
    color="neutral"
    variant="ghost"
    aria-label="検索"
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
      />
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

defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value
    },
  },
})
</script>
