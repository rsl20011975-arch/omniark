import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata = {
  title: "What Is a Search Engine? A Practical Guide",
  description:
    "Learn what search engines do, how web pages are discovered and indexed, and how search results are presented.",
  alternates: {
    canonical: "/web-internet/articles/what-is-a-search-engine",
  },
};

export default function SearchEnginePage() {
  return (
    <ArticleLayout
      articleUrl="/web-internet/articles/what-is-a-search-engine"
      category="Web & Internet"
      categoryHref="/web-internet"
      title="What Is a Search Engine? A Practical Guide"
      description="Learn what search engines do, how web pages are discovered and indexed, and how search results are presented."
    >
      <p>
        A search engine is not a live map of the entire internet. It is a highly complex sorting system that crawls the web, reads pages, stores them in a massive catalog, and attempts to guess exactly what you mean when you type a question.
      </p>

      <h2>How Search Engines Build Their Results</h2>
      <p>
        When you search for something, you are not actually searching the live internet. You are searching the engine's saved copy of the internet. This copy is built in four stages:
      </p>
      <ol>
        <li><strong>Crawling:</strong> Automated programs (called bots or spiders) constantly navigate from <Link href="/web-internet/articles/how-do-websites-work">website</Link> to website by following <Link href="/web-internet/articles/what-is-a-url">URLs</Link> and links, downloading the text and code they find.</li>
        <li><strong>Indexing:</strong> The search engine analyzes the downloaded text, categorizes the topics, and stores it in a massive database known as the Index. If a page is not indexed, it will never show up in search results.</li>
        <li><strong>Query Processing:</strong> When you type a search, the engine analyzes your words, corrects spelling, and determines your "Search Intent"—whether you want to buy a product, find a quick fact, or read a long tutorial.</li>
        <li><strong>Ranking:</strong> The engine instantly sorts millions of indexed pages using a complex algorithm. It looks at keywords, page speed, mobile-friendliness, and how many reputable sites link to the page, attempting to put the most helpful result at the very top.</li>
      </ol>

      <h2>Browser vs. Search Engine</h2>
      <p>
        A <Link href="/web-internet/articles/what-is-a-web-browser">web browser</Link> is the software installed on your computer (like Safari or Chrome) that displays websites. A search engine (like Google or DuckDuckGo) is a specific website you visit <em>using</em> your browser to find other websites. 
      </p>

      <h2>Why Results Are Not Always Instant or True</h2>
      <p>
        Because crawling takes time, a brand new website will not appear in search results the moment it is published. The crawler must first find it and the engine must index it.
      </p>
      <p>
        Furthermore, ranking high on a search engine is a measure of popularity and relevance, not necessarily truth. A highly optimized blog post might rank above an official government document simply because it loads faster and uses better keywords. When researching critical information, always look past the top results to find the official, primary source.
      </p>

      <h2>How to Search More Effectively</h2>
      <p>
        You can drastically improve your results by aligning with how the engine processes text:
      </p>
      <ul>
        <li><strong>Use exact phrases:</strong> Put quotes around your search (e.g., <code>"error code 404"</code>) to force the engine to find that exact wording.</li>
        <li><strong>Search a specific site:</strong> Add <code>site:example.com</code> to your query to only see results from that specific domain.</li>
        <li><strong>Exclude words:</strong> Use a minus sign (e.g., <code>laptop -gaming</code>) to filter out results you don't want.</li>
      </ul>
    </ArticleLayout>
  );
}
