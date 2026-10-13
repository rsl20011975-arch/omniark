import type { Post } from "../content/types";
import {
  articleStructuredData,
  breadcrumbStructuredData,
} from "../seo/article";

function serializeJsonLd(value: object) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

function JsonLd({ value }: { value: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }}
    />
  );
}

export default function ArticleSearchData({ post }: { post: Post }) {
  return (
    <>
      <JsonLd value={articleStructuredData(post)} />
      <JsonLd value={breadcrumbStructuredData(post)} />
    </>
  );
}
