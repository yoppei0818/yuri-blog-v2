<template>
  <footer class="shrink-0 py-3">
    <UContainer>
      <div class="flex flex-col items-center justify-between gap-3 text-xs text-muted sm:flex-row">
        <p>© 2026 Yuri's Blog. All rights reserved.</p>
        <nav class="flex items-center gap-4" aria-label="フッターナビゲーション">
          <NuxtLink to="/privacy" class="hover:text-default">
            プライバシーポリシー
          </NuxtLink>
          <NuxtLink to="/sitemap" class="hover:text-default">
            サイトマップ
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </footer>
</template>
