import Link from "next/link";
import StudioShell from "../components/StudioShell";
import { getPostsByKind } from "../content";

export const metadata = {
  title: "활용 가이드 | OMNIARK",
  description: "옴니아크에서 만든 소프트웨어 도구들을 200% 활용하는 방법을 알려드립니다.",
};

export default function GuidesIndex() {
  const posts = getPostsByKind("guide");

  return (
    <StudioShell current="/guides">
      <main className="journal">
        <div className="index-head">
          <h1>활용 가이드</h1>
          <p>
            옴니아크에서 만든 <strong>소프트웨어 도구</strong>들을 
            더욱 효과적으로 <strong>활용하는 방법</strong>을 알려드립니다.
          </p>
        </div>

        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/guides/${post.slug}`} className="post-card">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <div className="post-card-meta">
                  <time dateTime={post.date}>{post.date}</time>
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
          {posts.length === 0 && <li className="empty-note">아직 작성된 가이드가 없습니다.</li>}
        </ul>
      </main>
    </StudioShell>
  );
}
