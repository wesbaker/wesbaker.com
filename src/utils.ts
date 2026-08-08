import { getCollection, type CollectionEntry } from "astro:content";

export const postPath = (id: string) => `/posts/${id}/`;
export const projectPath = (id: string) => `/projects/${id}/`;
export const tagPath = (tag: string) => `/tags/${tag}/`;

/**
 * Drafts are hidden on production builds but always visible while developing,
 * so unpublished posts can be previewed the same way `zola serve --drafts` did.
 */
export const includeDrafts =
  import.meta.env.DEV || import.meta.env.INCLUDE_DRAFTS === "true";

/** Published posts, newest first. */
export async function getPosts(): Promise<CollectionEntry<"posts">[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => includeDrafts || !data.draft,
  );
  return posts.sort(
    (a, b) => b.data.date.value.valueOf() - a.data.date.value.valueOf(),
  );
}

/** Every tag in use, with its post count, sorted by name. */
export async function getTags(): Promise<{ name: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const post of await getPosts()) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
