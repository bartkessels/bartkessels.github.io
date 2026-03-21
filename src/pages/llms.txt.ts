import type { APIRoute } from 'astro';
import { getPages } from '@/repositories/pages.repository';
import { getSubjectsForSection } from '@/repositories/subject.repository';
import { getSoftware } from '@/repositories/software.repository';
import { getBlogPosts } from '@/repositories/blog.repository';
import { getStories } from '@/repositories/stories.repository';
import { getGardeningJournal, getGardeningPlants } from '@/repositories/gardening.repository';
import { getBackpackingTrails, getBackpackingPosts, getBackpackingSections } from '@/repositories/backpacking.repository';
import { subjectSlug, sectionSlug } from '@/utils/content';

export const GET: APIRoute = async () => {
  const [pages, blogSubjects, gardeningSubjects, software, stories, blogPosts, gardeningJournal, gardeningPlants, backpackingTrails, backpackingPosts] = await Promise.all([
    getPages(),
    getSubjectsForSection('blog'),
    getSubjectsForSection('gardening'),
    getSoftware(),
    getStories(),
    getBlogPosts(),
    getGardeningJournal(),
    getGardeningPlants(),
    getBackpackingTrails(),
    getBackpackingPosts(),
  ]);

  const trailSections = await Promise.all(
    backpackingTrails.map(async (trail) => ({
      trail,
      sections: await getBackpackingSections(trail),
    }))
  );

  const indexPage = pages.find((p) => p.id === 'index');
  const sectionPages = pages.filter((p) => p.id !== 'index');

  const lines: string[] = [];

  // Header
  if (indexPage) {
    lines.push(`# ${indexPage.data.title} — bartkessels.net`);
    lines.push('');
    lines.push(`> ${indexPage.data.description}`);
    lines.push('');
  }

  // Sections
  lines.push('## Sections');
  lines.push('');
  for (const page of sectionPages) {
    lines.push(`- [${page.data.title}](/${page.id}): ${page.data.description}`);
  }
  lines.push('- [About](/about): Background information about Bart Kessels.');
  lines.push('');

  // Blog Subjects
  if (blogSubjects.length > 0) {
    lines.push('## Blog Subjects');
    lines.push('');
    for (const subject of blogSubjects) {
      const slug = subjectSlug(subject.id);
      const description = subject.body?.trim() ?? subject.data.name;
      lines.push(`- [${subject.data.name}](/${slug}): ${description}`);
    }
    lines.push('');
  }

  // Blog Posts
  if (blogPosts.length > 0) {
    lines.push('## Blog Posts');
    lines.push('');
    for (const post of blogPosts) {
      lines.push(`- [${post.data.title}](/${post.data.subject}/${post.id}): ${post.data.description}`);
    }
    lines.push('');
  }

  // Gardening Subjects
  if (gardeningSubjects.length > 0) {
    lines.push('## Gardening Journals');
    lines.push('');
    for (const subject of gardeningSubjects) {
      const slug = subjectSlug(subject.id);
      const description = subject.body?.trim() ?? subject.data.name;
      lines.push(`- [${subject.data.name}](/gardening/${slug}): ${description}`);
    }
    lines.push('');
  }

  // Gardening Journal Entries
  if (gardeningJournal.length > 0) {
    lines.push('## Gardening Journal Entries');
    lines.push('');
    for (const entry of gardeningJournal) {
      const slug = entry.id.split('/').at(-1);
      const description = entry.data.description ?? entry.data.title;
      lines.push(`- [${entry.data.title}](/gardening/journal/${slug}): ${description}`);
    }
    lines.push('');
  }

  // Gardening Plants
  if (gardeningPlants.length > 0) {
    lines.push('## Gardening Plants');
    lines.push('');
    for (const plant of gardeningPlants) {
      const slug = plant.id.split('/').at(-1);
      lines.push(`- [${plant.data.name}](/gardening/plants/${slug})`);
    }
    lines.push('');
  }

  // Backpacking Trails & Sections
  if (backpackingTrails.length > 0) {
    lines.push('## Backpacking Trails');
    lines.push('');
    for (const { trail, sections } of trailSections) {
      lines.push(`- [${trail.data.title}](/backpacking/${trail.id}): ${trail.data.description}`);
      for (const section of sections) {
        lines.push(`  - [${section.data.title}](/backpacking/${trail.id}/${sectionSlug(section.id)}): ${section.data.description}`);
      }
    }
    lines.push('');
  }

  // Backpacking Posts
  if (backpackingPosts.length > 0) {
    lines.push('## Backpacking Posts');
    lines.push('');
    for (const post of backpackingPosts) {
      lines.push(`- [${post.data.title}](/backpacking/posts/${post.id}): ${post.data.description}`);
    }
    lines.push('');
  }

  // Story Series
  if (stories.length > 0) {
    lines.push('## Story Series');
    lines.push('');
    for (const story of stories) {
      lines.push(`- [${story.data.title}](/stories/${story.id}): ${story.data.description}`);
    }
    lines.push('');
  }

  // Software Projects
  if (software.length > 0) {
    lines.push('## Software Projects');
    lines.push('');
    for (const item of software) {
      lines.push(`- [${item.data.name}](/software/${item.id}): ${item.data.description}`);    }
    lines.push('');
  }

  // Author
  lines.push('## Author');
  lines.push('');
  lines.push('Bart Kessels — Software Developer & Outdoor Enthusiast, Netherlands.');
  lines.push('GitHub: https://github.com/bartkessels');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
