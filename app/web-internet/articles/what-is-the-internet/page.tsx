import type { Metadata } from "next";
import Link from "next/link";
import ArticleLayout from "@/app/components/ArticleLayout";

export const metadata: Metadata = {
  title: "What Is the Internet? A Practical Guide",
  description:
    "Learn what the internet is, how devices communicate through networks, and how websites, servers, and online services work together.",
  alternates: {
    canonical: "/web-internet/articles/what-is-the-internet",
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
        The internet is the physical and digital infrastructure that allows computers across the globe to talk to each other. It is not a single entity or a magical cloud; it is millions of miles of physical cables under oceans and underground, connecting local networks together based on a shared set of rules.
      </p>

      <h2>The Internet vs. The Web</h2>
      <p>
        A common misconception is treating the "Internet" and the "World Wide Web" as the same thing. 
      </p>
      <p>
        The <strong>Internet</strong> is the underlying highway system. The <strong>Web</strong> (which consists of <Link href="/web-internet/articles/how-do-websites-work">websites</Link> and web pages accessed via a <Link href="/web-internet/articles/what-is-a-web-browser">web browser</Link>) is just one type of traffic driving on that highway. When you send an email, stream a movie on a smart TV, or play a multiplayer video game, you are using the Internet, but you are not using the Web.
      </p>

      <h2>The Hierarchy of Connection</h2>
      <p>
        To understand how information travels, it helps to view the internet as a chain of connections:
      </p>
      <ul>
        <li><strong>Device (Client):</strong> Your laptop or smartphone.</li>
        <li><strong>Network & Router:</strong> Your device connects wirelessly to your home router. The router acts as a traffic director, managing your local network and plugging it into your Internet Service Provider's (ISP) network.</li>
        <li><strong>The Internet:</strong> Your ISP routes your signal through massive regional hubs and undersea cables to reach the destination country and city.</li>
        <li><strong>Server:</strong> The signal arrives at a high-powered computer (server) that holds the data you want.</li>
        <li><strong>Service:</strong> The server replies with the specific service data—like an email, a <Link href="/web-internet/articles/what-is-a-search-engine">search engine</Link> result, or a video stream.</li>
      </ul>

      <h2>How Data Travels: Packets and IP Addresses</h2>
      <p>
        When you request a file or enter a <Link href="/web-internet/articles/what-is-a-url">URL</Link>, the server does not send the file to you as one giant chunk. Using Internet Protocols (rules for communication), the file is chopped into thousands of tiny pieces called <strong>packets</strong>.
      </p>
      <p>
        Each packet is stamped with an <strong>IP Address</strong> (a numerical address unique to your device). These packets travel across the internet taking completely different routes based on traffic conditions. Once they all arrive at your device, your system reassembles them in the correct order. The Domain Name System (DNS) acts as the phone book, automatically translating human words into the numerical IP addresses the packets need to navigate.
      </p>

      <h2>What Happens When the Internet Goes Down?</h2>
      <p>
        If your internet connection drops, you lose access to the global highway. However, your local network still exists. You might not be able to load a website or send an email, but you could still use your home network to print a document on a wireless printer or cast a downloaded video from your phone to your TV, because those devices are still connected to your local router.
      </p>
    </ArticleLayout>
  );
}
