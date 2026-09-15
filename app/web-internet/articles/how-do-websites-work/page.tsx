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
          Visiting a website feels instantaneous, but behind the scenes, a complex relay of requests and translations occurs across the <Link href="/web-internet/articles/what-is-the-internet">internet</Link> every single time you hit Enter.
        </p>

        <h2>The Step-by-Step Journey</h2>
        <p>
          Here is exactly what happens from the moment you type a <Link href="/web-internet/articles/what-is-a-url">URL</Link> until the page appears on your screen:
        </p>
        
        <ol>
          <li><strong>URL Input:</strong> You open your <Link href="/web-internet/articles/what-is-a-web-browser">web browser</Link> and type a web address (like <code>example.com</code>).</li>
          <li><strong>DNS Lookup:</strong> Computers do not understand words like "example.com"; they only understand numerical IP addresses. Your browser asks a Domain Name System (DNS) server to translate the domain into the correct IP address, much like looking up a name in a phone book.</li>
          <li><strong>Server Connection:</strong> Now that the browser knows the exact IP address, it connects to the physical computer (the server) hosting the website, often utilizing <Link href="/technology/articles/what-is-cloud-computing">cloud computing</Link> infrastructure.</li>
          <li><strong>HTTP Request:</strong> The browser sends a specific request asking the server to deliver the webpage files.</li>
          <li><strong>Server Response & Download:</strong> The server accepts the request and sends the files back over the internet in small data packets.</li>
          <li><strong>Browser Processing & Rendering:</strong> The browser receives the raw HTML (for structure), CSS (for styling), and JavaScript (for interactivity). It acts as a translator, instantly drawing the buttons, text, and layout on your screen.</li>
        </ol>

        <h2>Frontend vs. Backend</h2>
        <p>
          Web development is divided into two halves to handle this process:
        </p>
        <ul>
          <li><strong>Frontend:</strong> Everything that happens inside your browser. It is the visual interface you interact with (the buttons, animations, and layouts).</li>
          <li><strong>Backend:</strong> Everything that happens on the server. It involves securely processing your requests, running the business logic, and pulling information from the database before sending it back to you.</li>
        </ul>

        <h2>Static vs. Dynamic Websites</h2>
        <p>
          A <strong>static website</strong> is like a printed brochure. The server simply hands you a pre-written HTML file that looks exactly the same to every visitor. They are incredibly fast but very limited.
        </p>
        <p>
          A <strong>dynamic website</strong> (like a social media feed or a banking portal) relies on a database. When you request the page, the server does not have a pre-written file ready. Instead, it queries the database for your specific account details, stitches the data together into a brand new HTML file on the fly, and sends it to you. This is why you and your friend can visit the same URL but see completely different feeds.
        </p>
      </ArticleLayout>
    </main>
  );
}
