<template>
  <aside class="space-y-3 lg:sticky lg:top-20">
    <UCard id="profile" :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          プロフィール
        </h2>
      </template>

      <div class="text-center">
        <UAvatar
          text="Y"
          size="3xl"
          color="primary"
          class="mx-auto"
          src="/images/site/profile-image.png"
        />
        <h2 class="mt-3 text-lg font-semibold text-highlighted">
          Yuri
        </h2>
        <p class="mt-1 text-sm font-medium text-primary">
          Web Developer
        </p>
        <p class="mt-3 text-sm leading-6 text-muted">
          Web アプリケーション開発が好きなエンジニアです。<br>個人開発や技術の学びを発信しています。
        </p>

        <div class="mt-4 flex justify-center gap-2">
          <UButton
            v-for="link in socialLinks"
            :key="link.label"
            :to="link.to"
            :icon="link.icon"
            color="neutral"
            variant="ghost"
            :aria-label="link.label"
          />
        </div>
      </div>
    </UCard>

    <UCard :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          このサイトについて
        </h2>
      </template>

      <p class="text-sm leading-6 text-muted">
        本ブログでは、技術的な学びや開発の記録、読んだ本の記録と学びをまとめています。
      </p>
    </UCard>

    <UCard :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          アーカイブ
        </h2>
      </template>

      <div class="space-y-2">
        <UButton
          v-for="archive in archiveItems"
          :key="archive.year"
          :to="`/archives/${archive.year}`"
          color="neutral"
          variant="ghost"
          trailing-icon="i-lucide-chevron-right"
          block
          class="justify-between"
        >
          <span>{{ archive.year }}年</span>
          <span class="text-muted">{{ archive.count }}</span>
        </UButton>
      </div>
    </UCard>
  </aside>
</template>

<script setup lang="ts">
interface ArchiveItem {
  count: number
  year: string
}

defineProps<{
  archiveItems: ArchiveItem[]
}>()

const socialLinks = [
  { label: 'GitHub', icon: 'i-lucide-github', to: 'https://github.com/' },
  { label: 'X', icon: 'i-simple-icons-x', to: 'https://x.com/' },
  { label: 'RSS', icon: 'i-lucide-rss', to: '/rss.xml' },
]
</script>
