import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata: Metadata = {
  title: "How Do Websites Work? A Practical Guide",
  description:
    "Learn how browsers, servers, domains, DNS, HTTP, and web technologies work together to deliver websites.",
  alternates: {
    canonical: "/web-internet/articles/how-do-websites-work",
  },
};

export default function HowWebsitesWorkPage() {
  return (
    <main>
      <ArticleLayout
      articleUrl="/web-internet/articles/how-do-websites-work"
        category="Web & Internet"
        categoryHref="/web-internet"
        title="How Do Websites Work? A Practical Guide"
        description="Learn how browsers, servers, domains, DNS, HTTP, and web technologies work together."
      >
        <p>
          A website is a collection of digital resources that can be accessed
          through the internet using a web browser.
        </p>

        <p>
          When someone enters a web address, several different technologies
          work together to locate the requested website and deliver its
          content.
        </p>

        <h2>What Happens When You Visit a Website?</h2>

        <p>
          A typical website visit involves a browser, a domain name, DNS,
          servers, and communication protocols such as HTTP or HTTPS.
        </p>

        <h3>1. The Browser</h3>

        <p>
          A web browser is the application used to access websites. Examples
          include browsers running on computers, smartphones, and other
          connected devices.
        </p>

        <h3>2. The Domain Name</h3>

        <p>
          A domain name is the human-readable address used to identify a
          website.
        </p>

        <h3>3. DNS</h3>

        <p>
          The Domain Name System, or DNS, helps translate domain names into
          network addresses that computers can use to locate the appropriate
          server.
        </p>

        <h3>4. The Server</h3>

        <p>
          A web server stores or generates the resources required to respond to
          requests from browsers.
        </p>

        <h3>5. HTTP and HTTPS</h3>

        <p>
          HTTP is a protocol used for communication between web browsers and
          servers. HTTPS adds encryption to help protect information exchanged
          during the connection.
        </p>

        <h2>How Does the Browser Display a Page?</h2>

        <p>
          After receiving the necessary resources, the browser processes
          technologies such as HTML, CSS, and JavaScript to construct and
          display the page.
        </p>

        <p>
          HTML provides the basic structure, CSS controls presentation, and
          JavaScript can provide interactive behavior.
        </p>

        <h2>Why Do Websites Need Servers?</h2>

        <p>
          Servers provide the infrastructure needed to deliver website
          resources to visitors. Depending on the website, a server may also
          process requests, access databases, authenticate users, or generate
          dynamic content.
        </p>

        <h2>The Basic Picture</h2>

        <p>
          A simplified way to understand a website is to think of it as a
          communication process between a browser and a server.
        </p>

        <p>
          The browser requests information, the server responds, and the
          browser processes the response to display the website to the user.
        </p>

        <div className="article-related">
          <h2>Continue Reading</h2>

          <Link href="/technology/articles/what-is-cloud-computing">
            What Is Cloud Computing? A Practical Guide →
          </Link>
        </div>
      </ArticleLayout>
    </main>
  );
}
