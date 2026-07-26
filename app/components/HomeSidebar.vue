<template>
  <aside class="space-y-3 md:grid md:grid-cols-2 md:items-start md:gap-3 md:space-y-0 lg:sticky lg:top-20 lg:block lg:space-y-3">
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
          Tech系の記事や読了本などについて投稿します。
          <br>
          自分の学びを気ままに発信していきたいと思います。
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

    <div class="space-y-3">
      <UCard :ui="{ header: 'p-4 sm:p-4', body: 'p-4 sm:p-4' }">
        <template #header>
          <h2 class="font-semibold text-highlighted">
            タグ一覧
          </h2>
        </template>

        <div v-if="tagItems.length" class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="item in tagItems"
            :key="item.tag"
            :to="tagPath(item.tag)"
            class="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :aria-label="`${item.tag}タグのコンテンツ${item.count}件を見る`"
          >
            <UBadge color="neutral" variant="subtle" size="md">
              {{ item.tag }}
              <span class="ml-1 text-muted">{{ item.count }}</span>
            </UBadge>
          </NuxtLink>
        </div>
        <p v-else class="text-sm text-muted">
          タグはまだありません。
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
    </div>
  </aside>
</template>

<script setup lang="ts">
interface ArchiveItem {
  count: number
  year: string
}

interface TagItem {
  count: number
  tag: string
}

defineProps<{
  archiveItems: ArchiveItem[]
  tagItems: TagItem[]
}>()

const tagPath = (tag: string) => `/tags/${encodeURIComponent(tag)}`

const socialLinks = [
  { label: 'GitHub', icon: 'i-lucide-github', to: 'https://github.com/yoppei0818' },
  { label: 'X', icon: 'i-simple-icons-x', to: 'https://x.com/ydev_0818' },
  { label: 'Wantedly', icon: 'i-simple-icons-wantedly', to: 'https://www.wantedly.com/id/yohei0818' },
  { label: 'RSS', icon: 'i-lucide-rss', to: '/rss.xml' },
]
</script>
