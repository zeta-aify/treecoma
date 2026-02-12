// Instagram posts to display on the social page.
// Add new post URLs here to show them on the site.
// Format: full Instagram post URL (e.g. "https://www.instagram.com/p/XXXXX/")
//
// To find a post URL: open the post on Instagram → click "..." → "Copy link"

export const instagramPosts: string[] = [
  // Add your Instagram post URLs here, newest first:
  // "https://www.instagram.com/p/EXAMPLE1/",
  // "https://www.instagram.com/p/EXAMPLE2/",
];

export const socialLinks = {
  instagram: {
    handle: "@treecoma_ltd",
    url: "https://www.instagram.com/treecoma_ltd/",
    active: true,
  },
  tiktok: {
    handle: "@treecoma",
    url: "https://www.tiktok.com/@treecoma",
    active: false, // coming soon
  },
  x: {
    handle: "@treecoma",
    url: "https://x.com/treecoma",
    active: false, // coming soon
  },
} as const;
