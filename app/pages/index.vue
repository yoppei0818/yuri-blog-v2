<template>
  <div class="flex min-h-dvh flex-col bg-default text-default lg:h-dvh lg:overflow-hidden">
    <SiteHeader />

    <main class="min-h-0 flex-1 border-b border-default">
      <UContainer class="h-full py-4 sm:py-5">
        <div class="grid gap-6 lg:h-full lg:grid-cols-[minmax(0,1fr)_var(--site-sidebar-width)] lg:items-start">
          <div class="space-y-6">
            <HomeLatestArticles :articles="latestArticles" />
            <HomeLatestBooks :books="latestBooks" />
          </div>

          <HomeSidebar
            :archive-items="archiveItems"
            :tag-items="tagItems"
          />
        </div>
      </UContainer>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const {
  archiveItems,
  latestArticles,
  latestBooks,
  tagItems,
} = await useHomeContent()
</script>
