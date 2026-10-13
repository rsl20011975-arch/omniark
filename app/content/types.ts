import type { ReactNode } from "react";

export type PostKind = "blog" | "guide";

export type RelatedLink = { href: string; label: string };

/** Controlled visual treatments for evidence-led Developer Notes. */
export type PostPresentation =
  | "incident-lab"
  | "origin-story"
  | "editorial-essay";

export type Post = {
  slug: string;
  kind: PostKind;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD) of first publication. */
  date: string;
  /** ISO date (YYYY-MM-DD) of the latest public revision, when applicable. */
  updatedAt?: string;
  tags: string[];
  /** Original incident period when it differs from the first publication date. */
  eventDate?: string;
  /** Optional image treatment used by the editorial-essay presentation. */
  heroImage?: string;
  heroAlt?: string;
  /** Optional 1.91:1 editorial social image when it differs from the on-page cover. */
  socialImage?: string;
  socialAlt?: string;
  /** Product pages or other posts worth reading next. */
  related?: RelatedLink[];
  presentation?: PostPresentation;
  html: string;
};
