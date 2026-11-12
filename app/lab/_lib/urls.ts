import { CATALOG_PATHS } from "./catalog";
import { openFields, publishedTerms, termPath } from "./data";

/** sitemap 에 올릴 /lab 주소: 공개된 용어가 있는 분야와 공개된 용어만. */
export function labPaths(): string[] {
  return ["/lab", ...CATALOG_PATHS, "/lab/fonts", ...openFields().map((f) => `/lab/${f.slug}`), ...publishedTerms().map(termPath)];
}
