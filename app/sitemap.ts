import type { MetadataRoute } from "next";
import { getPostsByKind } from "./content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omniark.co";

  const staticPaths = [
    "",
    "/products",
    "/tools/omniplayer",
    "/tools/omniplayer/releases",
    "/tools/omniplayer/terms",
    "/tools/omnizip",
    "/tools/omnizip/releases",
    "/tools/omnizip/terms",
    "/tools/omnipdf",
    "/tools/omnipdf/releases",
    "/tools/omnipdf/terms",
    "/korean/sseugi",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookie-policy",
    "/blog",
    "/guides",
  ];

  const blogPosts = getPostsByKind("blog").map((post) => `/blog/${post.slug}`);
  const guidePosts = getPostsByKind("guide").map((post) => `/guides/${post.slug}`);

  const paths = [...staticPaths, ...blogPosts, ...guidePosts];

  return paths.map((path) => ({ url: `${baseUrl}${path}` }));
}
