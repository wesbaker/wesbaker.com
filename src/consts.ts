export const SITE = {
  title: "Wes Baker",
  url: "https://wesbaker.com",
  lang: "en",
  copyright: "&copy; 2010&ndash;%YEAR% Wes Baker",
  fediverseCreator: "@wesbaker@hachyderm.io",
  plausibleDomain: "wesbaker.com",
} as const;

/** Posts shown per page on /posts/. */
export const POSTS_PER_PAGE = 10;

/** Recent posts shown on the homepage. */
export const HOMEPAGE_POSTS = 10;

export const MENU = [
  { name: "/posts", url: "/posts/" },
  { name: "/projects", url: "/projects/" },
  { name: "/now", url: "/now/" },
  { name: "/uses", url: "/uses/" },
  { name: "/tags", url: "/tags/" },
] as const;

export const SOCIALS = [
  {
    name: "bluesky",
    url: "https://bsky.app/profile/wesbaker.com",
    icon: "bluesky",
  },
  { name: "mastodon", url: "https://hachyderm.io/@wesbaker", icon: "mastodon" },
  { name: "github", url: "https://github.com/wesbaker/", icon: "github" },
  { name: "rss", url: "https://wesbaker.com/rss.xml", icon: "rss" },
] as const;

/**
 * Author metadata published in the Atom/RSS feeds via the Byline spec.
 * @see https://bylinespec.org/1.0
 */
export const BYLINE = {
  id: "wes",
  name: "Wes Baker",
  context:
    "Software Engineering Manager sharing notes on development, leadership, and productivity.",
  url: "https://wesbaker.com",
  profiles: [
    { rel: "mastodon", href: "https://hachyderm.io/@wesbaker" },
    { rel: "bluesky", href: "https://bsky.app/profile/wesbaker.com" },
    { rel: "github", href: "https://github.com/wesbaker" },
  ],
  now: "https://wesbaker.com/now",
  uses: "https://wesbaker.com/uses",
  perspective: "personal",
} as const;
