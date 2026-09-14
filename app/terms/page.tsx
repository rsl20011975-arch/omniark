import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for the OMNIARK website and its informational content.",
  alternates: {
    canonical: "https://omniark.co/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="article-page">
      <article>
        <p>LEGAL</p>

        <h1>Terms of Use</h1>

        <p>
          These Terms of Use explain the general terms that apply when you
          access and use the OMNIARK website.
        </p>

        <h2>Use of the Website</h2>

        <p>
          You may use the OMNIARK website for lawful personal and informational
          purposes. You agree not to use the website in a way that could
          damage, disable, overburden, or interfere with its operation.
        </p>

        <h2>Informational Content</h2>

        <p>
          OMNIARK publishes general educational and informational content about
          technology, AI and digital tools, productivity, and the web.
        </p>

        <p>
          We make reasonable efforts to provide useful and accurate
          information, but technology and online services can change over time.
          Information on the website should therefore be considered general
          information rather than a guarantee of any particular result.
        </p>

        <h2>External Services and Links</h2>

        <p>
          The website may contain links to third-party websites or services.
          Those websites operate independently and may have their own terms and
          privacy policies.
        </p>

        <h2>Intellectual Property</h2>

        <p>
          Unless otherwise stated, content published on OMNIARK is protected by
          applicable intellectual property laws.
        </p>

        <p>
          You may not reproduce, republish, distribute, or commercially exploit
          website content without appropriate permission.
        </p>

        <h2>Changes to These Terms</h2>

        <p>
          These Terms of Use may be updated when necessary. Changes will be
          reflected on this page.
        </p>

        <h2>Contact</h2>

        <p>
          Questions regarding these Terms of Use may be sent to
          <a href="mailto:soare.bloom@gmail.com">
            {" "}
            soare.bloom@gmail.com
          </a>
          .
        </p>
      </article>
    </main>
  );
}
