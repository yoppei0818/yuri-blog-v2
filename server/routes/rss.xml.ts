import { queryCollection } from '@nuxt/content/server'
import { SITE_CONFIG } from '#shared/constants/site'

const escapeXml = (value: string) => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    }

    return entities[character] ?? character
  })
}

const toRssDate = (date: string) => {
  return new Date(`${date}T00:00:00+09:00`).toUTCString()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = `${config.public.siteUrl.replace(/\/$/, '')}/`
  const feedUrl = new URL('/rss.xml', siteUrl).toString()
  const articles = await queryCollection(event, 'articles')
    .where('published', '=', true)
    .order('publishDate', 'DESC')
    .all()

  const items = articles.map((article) => {
    const articleUrl = new URL(article.path, siteUrl).toString()
    const categories = article.tags
      .map(tag => `      <category>${escapeXml(tag)}</category>`)
      .join('\n')

    return [
      '    <item>',
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${escapeXml(articleUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
      `      <description>${escapeXml(article.description)}</description>`,
      `      <pubDate>${toRssDate(article.publishDate)}</pubDate>`,
      categories,
      '    </item>',
    ].filter(Boolean).join('\n')
  }).join('\n')

  const lastBuildDate = articles[0]
    ? `    <lastBuildDate>${toRssDate(articles[0].updated ?? articles[0].publishDate)}</lastBuildDate>`
    : ''

  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=UTF-8')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE_CONFIG.name)}</title>`,
    `    <link>${escapeXml(siteUrl)}</link>`,
    `    <description>${escapeXml(SITE_CONFIG.description)}</description>`,
    '    <language>ja</language>',
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    lastBuildDate,
    items,
    '  </channel>',
    '</rss>',
  ].filter(Boolean).join('\n')
})
