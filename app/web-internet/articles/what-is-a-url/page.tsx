import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata = {
  title: "What Is a URL? A Practical Guide",
  description:
    "Learn what a URL is, what its main parts mean, and how web addresses are used to locate resources online.",
  alternates: {
    canonical: "https://omniark.co/web-internet/articles/what-is-a-url",
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
        A URL, or Uniform Resource Locator, is an address used to identify the
        location of a resource on the internet.
      </p>

      <h2>What Does a URL Do?</h2>

      <p>
        A URL gives software information about where a particular web resource
        can be requested. Web pages, images, files, and other resources can
        have their own URLs.
      </p>

      <h2>Main Parts of a URL</h2>

      <p>
        A URL can contain several components. A simple example is:
      </p>

      <p>
        <strong>https://example.com/articles/example</strong>
      </p>

      <p>
        In this example, <strong>https</strong> is the scheme,
        <strong> example.com</strong> is the domain name, and the remaining
        portion identifies a particular path on that website.
      </p>

      <h2>What Is HTTPS?</h2>

      <p>
        HTTPS is the secure version of HTTP commonly used for communication
        between a browser and a website.
      </p>

      <p>
        HTTPS helps protect information while it is being transmitted between
        the browser and the server by using encryption.
      </p>

      <h2>What Is a Domain Name?</h2>

      <p>
        A domain name is a human-readable name used to identify an internet
        location. It is easier for people to remember than a numerical IP
        address.
      </p>

      <h2>What Is a URL Path?</h2>

      <p>
        The path identifies a particular location or resource within a
        website. For example, a website may use different paths for articles,
        categories, products, or other resources.
      </p>

      <h2>URLs Can Contain Additional Information</h2>

      <p>
        Some URLs contain query parameters or fragments. These can provide
        additional information to a website or identify a particular location
        within a page.
      </p>

      <p>
        Not every URL uses these additional components.
      </p>

      <h2>Why Are URLs Important?</h2>

      <p>
        URLs allow users and software to identify and access specific web
        resources. They are fundamental to navigation across the web.
      </p>

      <div className="article-related">
        <h2>Related Guides</h2>

        <ul>
          <li>
            <Link href="/web-internet/articles/what-is-a-web-browser">
              What Is a Web Browser?
            </Link>
          </li>

          <li>
            <Link href="/web-internet/articles/how-do-websites-work">
              How Do Websites Work?
            </Link>
          </li>
        </ul>
      </div>
    </ArticleLayout>
  );
}
