<template>
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
          <UDropdownMenu
            :items="navItems"
            :content="{ align: 'end' }"
          >
            <UButton
              icon="i-lucide-menu"
              color="neutral"
              variant="ghost"
              aria-label="メニューを開く"
              class="md:hidden"
            />
          </UDropdownMenu>
          <SiteSearch />
          <UColorModeButton
            color="neutral"
            variant="ghost"
          />
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'ホーム', to: '/' },
  { label: '記事', to: '/articles' },
  { label: '読了本', to: '/books' },
  { label: 'アバウト', to: '/about' },
  { label: 'お問い合わせ', to: '/contact' },
]
</script>
