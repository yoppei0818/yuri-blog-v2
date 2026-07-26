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
            class="w-full max-w-none object-contain dark:hidden"
          >
          <img
            src="/images/site/yuris-blog-logo-dark.png"
            alt="Yuri's Blog"
            class="hidden w-full max-w-none object-contain dark:block"
          >
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :variant="isNavItemActive(item) ? 'soft' : 'ghost'"
            color="neutral"
            size="sm"
            :aria-current="isNavItemActive(item) ? 'page' : undefined"
          >
            {{ item.label }}
          </UButton>
        </nav>

        <div class="flex items-center gap-2">
          <UColorModeButton
            color="neutral"
            variant="ghost"
          />
          <SiteSearch />
          <UDropdownMenu
            :items="mobileNavItems"
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
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
interface NavItem {
  label: string
  matchPrefixes?: string[]
  to: string
}

const route = useRoute()

const navItems = [
  { label: 'ホーム', to: '/' },
  { label: '記事', to: '/articles', matchPrefixes: ['/articles', '/archives'] },
  { label: '読了本', to: '/books' },
  { label: 'プロフィール', to: '/profile' },
] satisfies NavItem[]

const isNavItemActive = (item: NavItem) => {
  if (item.to === '/') {
    return route.path === '/'
  }

  const prefixes = item.matchPrefixes ?? [item.to]

  return prefixes.some((prefix) => {
    return route.path === prefix || route.path.startsWith(`${prefix}/`)
  })
}

const mobileNavItems = computed(() => {
  return navItems.map(item => ({
    ...item,
    active: isNavItemActive(item),
  }))
})
</script>
