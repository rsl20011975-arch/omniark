import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata: Metadata = {
  title: "What Is the Internet? A Practical Guide",
  description:
    "Learn what the internet is, how devices communicate through networks, and how websites, servers, and online services work together.",
  alternates: {
    canonical: "https://omniark.co/web-internet/articles/what-is-the-internet",
  },
};

export default function WhatIsTheInternetPage() {
  return (
    <ArticleLayout
      articleUrl="/web-internet/articles/what-is-the-internet"
      category="Web & Internet"
      categoryHref="/web-internet"
      title="What Is the Internet? A Practical Guide"
      description="A clear introduction to the internet, networks, connected devices, and the systems that make online services possible."
    >
      <p>
        The internet is a worldwide system of interconnected computer networks.
        It allows computers, smartphones, servers, and other devices to
        communicate and exchange information.
      </p>

      <p>
        When you open a website, send a message, watch a video, or use an
        online service, your device communicates with other systems through
        networks that are connected to the internet.
      </p>

      <h2>How Does the Internet Work?</h2>

      <p>
        The internet does not operate as a single computer or a single
        network. Instead, many different networks are connected and
        communicate using shared technical standards.
      </p>

      <p>
        When you request information from an online service, your device sends
        data through a series of network connections until it reaches the
        appropriate server or service.
      </p>

      <p>
        The requested information is then sent back through the network so
        that your device can display or process it.
      </p>

      <h2>What Is a Network?</h2>

      <p>
        A network is a group of connected devices that can communicate with
        one another. A home Wi-Fi network is a simple example.
      </p>

      <p>
        Your phone, computer, printer, and other devices can communicate
        through the local network. The internet connects many such networks
        together on a much larger scale.
      </p>

      <h2>What Is a Server?</h2>

      <p>
        A server is a computer system designed to provide information,
        resources, or services to other computers.
      </p>

      <p>
        Websites are commonly hosted on servers. When you visit a website,
        your browser requests information from the server hosting that
        website.
      </p>

      <h2>How Does a Website Use the Internet?</h2>

      <p>
        A website normally involves several components working together. A
        browser on your device requests a website, the request travels through
        the internet, and a server responds with the resources needed to
        display the page.
      </p>

      <p>
        Those resources can include HTML, CSS, JavaScript, images, and other
        files.
      </p>

      <p>
        The browser processes these resources and turns them into the webpage
        that you see.
      </p>

      <h2>What Is the Difference Between the Internet and the Web?</h2>

      <p>
        The internet and the World Wide Web are related, but they are not the
        same thing.
      </p>

      <p>
        The internet is the underlying global network infrastructure that
        allows connected systems to communicate. The web is one of the major
        services that operates over that infrastructure.
      </p>

      <p>
        Email, online games, file transfers, messaging services, and other
        systems can also use the internet without being the same thing as the
        web.
      </p>

      <h2>Why Does the Internet Need Addresses?</h2>

      <p>
        Connected systems need ways to identify where information should be
        sent. Internet protocols use addressing systems to help devices
        communicate with the correct destination.
      </p>

      <p>
        Websites also use human-readable domain names so that people can
        access online resources more easily.
      </p>

      <h2>What Happens When You Visit a Website?</h2>

      <ol>
        <li>You enter a web address or select a link.</li>
        <li>Your browser determines where the request should go.</li>
        <li>The request travels through connected networks.</li>
        <li>A web server receives the request.</li>
        <li>The server sends the requested resources back.</li>
        <li>Your browser processes the resources and displays the page.</li>
      </ol>

      <h2>Why Is Understanding the Internet Useful?</h2>

      <p>
        Understanding the basic structure of the internet makes many everyday
        digital activities easier to understand.
      </p>

      <p>
        It can help explain why websites sometimes load slowly, why a domain
        name is different from a server, why browsers are different from
        search engines, and how online services communicate with your device.
      </p>

      <h2>Related Guides</h2>

      <div className="article-related">
        <p>
          <Link href="/web-internet/articles/what-is-a-web-browser">
            What Is a Web Browser?
          </Link>
        </p>

        <p>
          <Link href="/web-internet/articles/what-is-a-url">
            What Is a URL?
          </Link>
        </p>

        <p>
          <Link href="/web-internet/articles/how-do-websites-work">
            How Do Websites Work?
          </Link>
        </p>

        <p>
          <Link href="/web-internet/articles/what-is-a-search-engine">
            What Is a Search Engine?
          </Link>
        </p>
      </div>
    </ArticleLayout>
  );
}
