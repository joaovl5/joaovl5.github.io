import { getPublishedPosts } from '@/utils/content';
import { extractExcerptFromMarkdown, getPostUrl } from '@/utils/helpers';

export async function GET() {
  const allPosts = await getPublishedPosts();
  const searchablePosts = allPosts.map((post) => ({
    id: post.id,
    title: post.data.title,
    excerpt:
      post.data.description ||
      extractExcerptFromMarkdown(post.body || '') ||
      'No excerpt',
    url: getPostUrl(post.id),
    content: post.body || '',
    description: post.data.description,
    tags: post.data.tags,
  }));

  return new Response(JSON.stringify(searchablePosts), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
