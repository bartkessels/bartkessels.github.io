import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { notUnderscored } from '@/utils/content';

export const getStories = (): Promise<CollectionEntry<'stories'>[]> =>
  getCollection('stories', (e) => notUnderscored(e) && !e.data.draft);

export const getStoryBySlug = async (slug: string): Promise<CollectionEntry<'stories'>> => {
  const entry = await getEntry('stories', slug);

  if (entry && !entry.data.draft) {
    return entry;
  }

  throw new Error(`Story '${slug}' not found`);
};

export const getStoryForPost = async (post: string): Promise<CollectionEntry<'stories'> | null> => {
  const stories = await getStories();
  const story = stories.filter(s => s.data.posts.includes(post)).at(0);

  if (story)
  {
    return story;
  }

  return null;
}

export class StoriesRepository {
  public async getStories(): Promise<CollectionEntry<'stories'>[]> {
    return await getCollection('stories', notUnderscored);
  }
}