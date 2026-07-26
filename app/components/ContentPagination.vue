<template>
  <nav aria-label="ページネーション" class="flex justify-center">
    <UPagination
      :page="page"
      :total="total"
      :items-per-page="itemsPerPage"
      :to="to"
      :sibling-count="1"
      active-color="neutral"
      active-variant="subtle"
      size="sm"
    />
  </nav>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  itemsPerPage: number
  page: number
  to: (page: number) => RouteLocationRaw
  total: number
}>()
</script>
