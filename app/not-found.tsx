import Link from "next/link";

export default function NotFound() {
  return (
    <main className="article-page">
      <article>
        <p>PAGE NOT FOUND</p>

        <h1>We couldn't find that page.</h1>

        <p>
          The page you are looking for may have been moved, removed, or may no
          longer exist.
        </p>

        <p>
          <Link href="/">Return to the OMNIARK home page</Link>
        </p>
      </article>
    </main>
  );
}
