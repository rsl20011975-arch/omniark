import { notFound } from "next/navigation";
import Link from "next/link";
import StudioShell from "../../components/StudioShell";
import { getPostBySlug, getPostsByKind } from "../../content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "페이지를 찾을 수 없습니다" };

  return {
    title: `${post.title} | 개발 노트 | OMNIARK`,
    description: post.description,
  };
}

export async function generateStaticParams() {
  const posts = getPostsByKind("blog");
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.kind !== "blog") {
    notFound();
  }

  return (
    <StudioShell current="/blog">
      <article className="journal">
        <div className="post-head">
          <div className="crumbs">
            <Link href="/blog">개발 노트</Link>
            <span>›</span>
            <span>{post.title}</span>
          </div>
          <p className="post-kind">DEV NOTE</p>
          <h1>{post.title}</h1>
          <p className="post-lead">{post.description}</p>
          <p className="post-meta">
            <span>{post.date}</span>
            {post.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        </div>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.related && post.related.length > 0 && (
          <footer className="post-after">
            <h2>함께 읽으면 좋은 글</h2>
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
