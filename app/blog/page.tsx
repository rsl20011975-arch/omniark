import Link from "next/link";
import StudioShell from "../components/StudioShell";
import { getPostsByKind } from "../content";

export const metadata = {
  title: "개발 노트 | OMNIARK",
  description: "소프트웨어 스튜디오 옴니아크의 개발 노트입니다. 제품을 만들며 겪은 이야기와 기술적 고민들을 공유합니다.",
};

export default function BlogIndex() {
  const posts = getPostsByKind("blog");

  return (
    <StudioShell current="/blog">
      <main className="journal">
        <div className="index-head">
          <h1>개발 노트</h1>
          <p>
            옴니아크 팀이 소프트웨어를 만들며 겪은 <strong>기술적 고민</strong>과 
            <strong>개발 과정</strong>을 기록합니다.
          </p>
        </div>

        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="post-card">
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
          {posts.length === 0 && <li className="empty-note">아직 작성된 글이 없습니다.</li>}
        </ul>
      </main>
    </StudioShell>
  );
}
