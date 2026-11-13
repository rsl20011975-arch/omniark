import type { MetadataRoute } from "next";
import { getPostsByKind } from "./content";
import { articlePath } from "./seo/article";
import { absoluteUrl } from "./seo/site";
import { LAB_INDEXABLE } from "./lab/_lib/config";
import { labPaths } from "./lab/_lib/urls";

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

  // /lab 은 LAB_INDEXABLE 이 true 일 때만 검색엔진에 알린다.
  const staticEntries = [...staticPaths, ...(LAB_INDEXABLE ? labPaths() : [])].map((path) => ({ url: absoluteUrl(path) }));
  const articleEntries = [...getPostsByKind("blog"), ...getPostsByKind("guide")].map(
    (post) => ({
      url: absoluteUrl(articlePath(post)),
      lastModified: post.updatedAt ?? post.date,
      ...(post.socialImage || post.heroImage
        ? { images: [absoluteUrl(post.socialImage ?? post.heroImage!)] }
        : {}),
    }),
  );

  return [...staticEntries, ...articleEntries];
}
