import Image from "next/image";
import Link from "next/link";
import type { Post } from "../content/types";

type EditorialHeroPost = Pick<
  Post,
  | "title"
  | "description"
  | "date"
  | "eventDate"
  | "tags"
  | "heroImage"
  | "heroAlt"
>;

export default function EditorialHero({ post }: { post: EditorialHeroPost }) {
  if (!post.heroImage) return null;

  const format = post.tags.find((tag) => tag !== "개발자 노트");

  return (
    <header className="editorial-hero">
      <Image
        className="editorial-hero-image"
        src={post.heroImage}
        alt={post.heroAlt ?? ""}
        fill
        priority
        sizes="(max-width: 760px) 100vw, min(1180px, calc(100vw - 48px))"
      />
      <div className="editorial-hero-copy">
        <div className="editorial-hero-crumbs">
          <Link href="/blog">개발 노트</Link>
          <span aria-hidden="true">/</span>
          <span>FIELD GUIDE</span>
        </div>
        <p className="editorial-hero-kicker">OMNIARK / DEVELOPER NOTES</p>
        <h1>{post.title}</h1>
        <p className="editorial-hero-lead">{post.description}</p>
        <p className="editorial-hero-meta">
          <time dateTime={post.date}>최초 공개 {post.date}</time>
          {post.eventDate && <span>{post.eventDate}의 개발 기록</span>}
          {format && <span>{format}</span>}
        </p>
      </div>
    </header>
  );
}
