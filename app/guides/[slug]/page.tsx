import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import StudioShell from "../../components/StudioShell";
import ArticleSearchData from "../../components/ArticleSearchData";
import { getPostBySlug, getPostsByKind } from "../../content";
import { articleMetadata } from "../../seo/article";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.kind !== "guide") {
    return { title: "페이지를 찾을 수 없습니다", robots: { index: false } };
  }

  return articleMetadata(post);
}

export async function generateStaticParams() {
  const posts = getPostsByKind("guide");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function GuidePostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.kind !== "guide") {
    notFound();
  }

  return (
    <StudioShell current="/guides">
      <article className="journal">
        <ArticleSearchData post={post} />
        <div className="post-head">
          <div className="crumbs">
            <Link href="/guides">활용 가이드</Link>
            <span>›</span>
            <span>{post.title}</span>
          </div>
          <p className="post-kind">GUIDE</p>
          <h1>{post.title}</h1>
          <p className="post-lead">{post.description}</p>
          <p className="post-meta">
            <time dateTime={post.date}>{post.date}</time>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        </div>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.related && post.related.length > 0 && (
          <footer className="post-after">
            <h2>연관 서비스</h2>
            <ul>
              {post.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </StudioShell>
  );
}
