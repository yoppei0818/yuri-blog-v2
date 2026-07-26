<template>
  <nav
    v-if="links.length"
    aria-labelledby="table-of-contents-title"
    class="rounded-lg border border-default bg-elevated p-4"
  >
    <div class="flex items-center gap-2">
      <UIcon
        name="i-lucide-list"
        class="size-4 text-primary"
        aria-hidden="true"
      />
      <h2
        id="table-of-contents-title"
        class="text-sm font-semibold text-highlighted"
      >
        目次
      </h2>
    </div>
    <ContentTocList
      :links="links"
      class="mt-3"
    />
  </nav>
</template>

<script setup lang="ts">
import type { ContentTocLink } from './ContentTocList.vue'

defineProps<{
  links: ContentTocLink[]
}>()
</script>
