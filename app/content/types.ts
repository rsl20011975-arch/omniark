import type { ReactNode } from "react";

export type PostKind = "blog" | "guide";

export type RelatedLink = { href: string; label: string };

export type Post = {
  slug: string;
  kind: PostKind;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) of first publication. */
  date: string;
  tags: string[];
  /** Product pages or other posts worth reading next. */
  related?: RelatedLink[];
  html: string;
};
