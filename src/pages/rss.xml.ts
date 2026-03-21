import type { APIRoute } from 'astro';
import { getBlogPosts } from '@/repositories/blog.repository';
import { getGardeningJournal } from '@/repositories/gardening.repository';
import { getBackpackingPosts } from '@/repositories/backpacking.repository';

const SITE = 'https://bartkessels.net';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const [blogPosts, gardeningJournal, backpackingPosts] = await Promise.all([
    getBlogPosts(),
    getGardeningJournal(),
    getBackpackingPosts(),
  ]);

  const items: { title: string; link: string; description: string; date: Date }[] = [];

  for (const post of blogPosts) {
    items.push({
      title: post.data.title,
      link: `${SITE}/${post.data.subject}/${post.id}`,
      description: post.data.description,
      date: post.data.date,
    });
  }

  for (const entry of gardeningJournal) {
    const slug = entry.id.split('/').at(-1);
    items.push({
      title: entry.data.title,
      link: `${SITE}/gardening/journal/${slug}`,
      description: entry.data.description ?? entry.data.title,
      date: entry.data.date,
    });
  }

  for (const post of backpackingPosts) {
    items.push({
      title: post.data.title,
      link: `${SITE}/backpacking/posts/${post.id}`,
      description: post.data.description,
      date: post.data.date,
    });
  }

  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <guid>${escapeXml(item.link)}</guid>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Bart Kessels</title>
    <link>${SITE}</link>
    <description>Software Developer &amp; Outdoor Enthusiast</description>
    <language>en</language>${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
