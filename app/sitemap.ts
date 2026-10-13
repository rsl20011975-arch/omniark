import type { MetadataRoute } from "next";
import { getPostsByKind } from "./content";
import { articlePath } from "./seo/article";
import { absoluteUrl } from "./seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const staticEntries = staticPaths.map((path) => ({ url: absoluteUrl(path) }));
  const articleEntries = [...getPostsByKind("blog"), ...getPostsByKind("guide")].map(
    (post) => ({
      url: absoluteUrl(articlePath(post)),
      lastModified: post.date,
      ...(post.heroImage && { images: [absoluteUrl(post.heroImage)] }),
    }),
  );

  return [...staticEntries, ...articleEntries];
}
