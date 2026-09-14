import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for the OMNIARK website and information about cookies and similar technologies.",
  alternates: {
    canonical: "https://omniark.co/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="article-page">
      <article>
        <p>LEGAL</p>

        <h1>Cookie Policy</h1>

        <p>
          This Cookie Policy explains how cookies and similar technologies may
          be used on the OMNIARK website.
        </p>

        <h2>What Are Cookies?</h2>

        <p>
          Cookies are small pieces of information that a website may store on a
          visitor&apos;s device. They can be used to remember settings,
          understand website usage, support security, or provide other website
          functionality.
        </p>

        <h2>How OMNIARK May Use Cookies</h2>

        <p>
          Depending on the features and services used by the website, cookies
          may be used for purposes such as website functionality, analytics,
          security, performance measurement, or advertising.
        </p>

        <h2>Third-Party Services</h2>

        <p>
          Third-party services used on the website may use their own cookies or
          similar technologies. Their practices are governed by their own
          policies.
        </p>

        <h2>Advertising Cookies</h2>

        <p>
          If advertising services are used on OMNIARK, advertising providers
          may use cookies or similar technologies to support advertising
          delivery, measurement, or personalization as permitted by applicable
          policies and user settings.
        </p>

        <h2>Managing Cookies</h2>

        <p>
          Most modern web browsers allow users to manage, block, or delete
          cookies through browser settings. Restricting cookies may affect some
          website functionality.
        </p>

        <h2>Changes to This Policy</h2>

        <p>
          This Cookie Policy may be updated when the website&apos;s technology,
          features, or third-party services change.
        </p>

        <h2>Contact</h2>

        <p>
          Questions about this Cookie Policy may be sent to{" "}
          <a href="mailto:soare.bloom@gmail.com">
            soare.bloom@gmail.com
          </a>
          .
        </p>
      </article>
    </main>
  );
}
