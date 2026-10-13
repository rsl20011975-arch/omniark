import type { Metadata } from "next";
import type { Post } from "../content/types";
import { absoluteUrl, SITE_NAME, SITE_URL } from "./site";

export function articlePath(post: Pick<Post, "kind" | "slug">) {
  const section = post.kind === "blog" ? "blog" : "guides";
  return `/${section}/${post.slug}`;
}

export function articleCategory(post: Pick<Post, "kind">) {
  return post.kind === "blog" ? "개발 노트" : "활용 가이드";
}

export function articleMetadata(post: Post): Metadata {
  const path = articlePath(post);
  const image = post.heroImage
    ? {
        url: absoluteUrl(post.heroImage),
        alt: post.heroAlt ?? post.title,
      }
    : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: path,
      siteName: SITE_NAME,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      ...(image && { images: [image] }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      ...(image && { images: [image] }),
    },
  };
}

export function articleStructuredData(post: Post) {
  const path = articlePath(post);
  const url = absoluteUrl(path);
  const category = articleCategory(post);
  const image = post.heroImage ? absoluteUrl(post.heroImage) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": post.kind === "blog" ? "BlogPosting" : "Article",
    headline: post.title,
    description: post.description,
    articleSection: category,
    keywords: post.tags.join(", "),
    inLanguage: "ko-KR",
    datePublished: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(image && { image }),
  };
}

export function breadcrumbStructuredData(post: Post) {
  const category = articleCategory(post);
  const path = articlePath(post);
  const categoryPath = post.kind === "blog" ? "/blog" : "/guides";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: category,
        item: absoluteUrl(categoryPath),
      },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(path) },
    ],
  };
}
