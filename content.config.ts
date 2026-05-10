import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.string(),
        updated: z.string().optional(),
        published: z.boolean(),
        tags: z.array(z.string()),
        thumbnail: z.string().optional(),
      }),
    }),
    books: defineCollection({
      type: 'page',
      source: 'books/**/*.md',
      schema: z.object({
        title: z.string(),
        author: z.string(),
        publishDate: z.string(),
        published: z.boolean(),
        tags: z.array(z.string()).optional(),
        cover: z.string(),
        publisher: z.string().optional(),
      }),
    }),
  },
})
