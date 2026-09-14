import Link from "next/link";

export const metadata = {
  title: "Productivity",
  description:
    "Practical guides explaining digital task management, note-taking, file organization, calendars, and information management.",
  alternates: {
    canonical: "https://omniark.co/productivity",
  },
};

const articles = [
  {
    title: "What Is Digital Task Management? A Practical Guide",
    description:
      "Learn how digital task management helps organize tasks, priorities, deadlines, and daily work.",
    href: "/productivity/articles/digital-task-management",
  },
  {
    title: "What Is Digital Note-Taking? A Practical Guide",
    description:
      "Learn what digital note-taking is, how it works, and how to organize digital notes.",
    href: "/productivity/articles/what-is-digital-note-taking",
  },
  {
    title: "How to Organize Digital Files: A Practical Guide",
    description:
      "Learn practical ways to organize digital files using folders, file names, categories, and simple maintenance habits.",
    href: "/productivity/articles/how-to-organize-digital-files",
  },
  {
    title: "How Does Digital Calendar Management Work? A Practical Guide",
    description:
      "Learn how digital calendars organize events, schedules, reminders, and time-based information.",
    href: "/productivity/articles/how-does-digital-calendar-management-work",
  },
  {
    title: "What Is Information Overload? A Practical Guide",
    description:
      "Learn why large amounts of digital information can become difficult to manage and how to reduce unnecessary information.",
    href: "/productivity/articles/what-is-information-overload",
  },
];

export default function ProductivityPage() {
  return (
    <main className="container">
      <section className="page-header">
        <p className="eyebrow">Productivity</p>
        <h1>Productivity</h1>
        <p>
          Practical guides for organizing digital work, information, tasks,
          notes, files, and schedules.
        </p>
      </section>

      <section className="article-list">
        {articles.map((article) => (
          <article className="article-card" key={article.href}>
            <h2>
              <Link href={article.href}>{article.title}</Link>
            </h2>
            <p>{article.description}</p>
            <Link href={article.href}>Read guide →</Link>
          </article>
        ))}
      </section>

      <section className="explore-section">
        <h2>Explore Other Topics</h2>

        <div className="explore-links">
          <Link href="/technology">Technology</Link>
          <Link href="/ai-digital-tools">AI &amp; Digital Tools</Link>
          <Link href="/web-internet">Web &amp; Internet</Link>
        </div>
      </section>
    </main>
  );
}