import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata = {
  title: "What Is a URL? A Practical Guide",
  description:
    "Learn what a URL is, what its main parts mean, and how web addresses are used to locate resources online.",
  alternates: {
    canonical: "/web-internet/articles/what-is-a-url",
  },
};

export default function URLPage() {
  return (
    <ArticleLayout
      articleUrl="/web-internet/articles/what-is-a-url"
      category="Web & Internet"
      categoryHref="/web-internet"
      title="What Is a URL? A Practical Guide"
      description="Learn what a URL is, what its main parts mean, and how web addresses are used to locate resources online."
    >
      <p>
        A URL (Uniform Resource Locator) is the exact digital address of a specific file, page, or resource on the <Link href="/web-internet/articles/what-is-the-internet">internet</Link>. Just as a postal address tells the mail carrier exactly which street and apartment to visit, a URL tells your <Link href="/web-internet/articles/what-is-a-web-browser">web browser</Link> exactly where to look for a <Link href="/web-internet/articles/how-do-websites-work">website's</Link> content.
      </p>

      <h2>Deconstructing a URL</h2>
      <p>
        By understanding the anatomy of a URL, you can navigate the web more safely and troubleshoot errors. Consider this realistic example:
      </p>
      <p>
        <code>https://example.com/products?category=shoes#reviews</code>
      </p>
      <p>
        This address is broken down into five distinct parts:
      </p>

      <h3>1. The Scheme: <code>https://</code></h3>
      <p>
        The scheme tells the browser which protocol to use. Today, you will almost exclusively see <strong>HTTP</strong> or <strong>HTTPS</strong>. The "S" stands for Secure, meaning the connection between your computer and the server is encrypted. You should never enter passwords or credit card information on a site that only uses HTTP.
      </p>

      <h3>2. The Domain: <code>example.com</code></h3>
      <p>
        The domain is the main name of the website. It is the human-readable identifier for the server. While the URL is the complete, specific address of a single page, the domain is just the name of the overall building.
      </p>

      <h3>3. The Path: <code>/products</code></h3>
      <p>
        The path directs the browser to a specific folder or page within the domain. Just like opening a folder on your computer to find a specific document, the path tells the server exactly which page to load.
      </p>

      <h3>4. The Query Parameter: <code>?category=shoes</code></h3>
      <p>
        Query parameters begin with a question mark (<code>?</code>) and pass specific variables or instructions to the server. They are heavily used for search results, filtering, or tracking. In this example, it tells the server to only show products in the "shoes" category.
      </p>

      <h3>5. The Fragment: <code>#reviews</code></h3>
      <p>
        The fragment starts with a hash (<code>#</code>) and directs the browser to scroll down to a specific section on that exact page—in this case, jumping straight down to the "reviews" section.
      </p>

      <h2>URL Length and Safety</h2>
      <p>
        A very long URL with dozens of confusing query parameters is not inherently dangerous; it usually just means the website is tracking where you clicked from or applying complex search filters.
      </p>
      <p>
        When evaluating safety, the most critical part is the domain. A link that says <code>https://secure-login.com/example</code> is completely different from <code>https://example.com/secure-login</code>. Always verify that the domain itself (the part immediately before the first single slash) exactly matches the organization you intend to visit.
      </p>
    </ArticleLayout>
  );
}
