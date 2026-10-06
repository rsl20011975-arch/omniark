import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omniark.co";

  return [
    {
      url: `${baseUrl}/tools/omnipdf`,
    },
    {
      url: `${baseUrl}/tools/omnipdf/releases`,
    },
    {
      url: `${baseUrl}/tools/omnipdf/terms`,
    },
    {
      url: baseUrl,
    },

    {
      url: `${baseUrl}/technology`,
    },
    {
      url: `${baseUrl}/ai-digital-tools`,
    },
    {
      url: `${baseUrl}/productivity`,
    },
    {
      url: `${baseUrl}/web-internet`,
    },

    {
      url: `${baseUrl}/about`,
    },
    {
      url: `${baseUrl}/contact`,
    },
    {
      url: `${baseUrl}/privacy`,
    },
    {
      url: `${baseUrl}/terms`,
    },
    {
      url: `${baseUrl}/cookie-policy`,
    },

    {
      url: `${baseUrl}/technology/articles/what-is-cloud-computing`,
    },
    {
      url: `${baseUrl}/technology/articles/what-is-a-cpu`,
    },
    {
      url: `${baseUrl}/technology/articles/what-is-an-operating-system`,
    },
    {
      url: `${baseUrl}/technology/articles/how-does-computer-memory-work`,
    },

    {
      url: `${baseUrl}/ai-digital-tools/articles/what-is-generative-ai`,
    },
    {
      url: `${baseUrl}/ai-digital-tools/articles/what-is-an-ai-model`,
    },
    {
      url: `${baseUrl}/ai-digital-tools/articles/what-is-a-prompt`,
    },
    {
      url: `${baseUrl}/ai-digital-tools/articles/how-do-ai-assistants-work`,
    },
    {
      url: `${baseUrl}/ai-digital-tools/articles/how-to-evaluate-ai-generated-information`,
    },

    {
      url: `${baseUrl}/productivity/articles/digital-task-management`,
    },
    {
      url: `${baseUrl}/productivity/articles/what-is-digital-note-taking`,
    },
    {
      url: `${baseUrl}/productivity/articles/how-to-organize-digital-files`,
    },
    {
      url: `${baseUrl}/productivity/articles/how-does-digital-calendar-management-work`,
    },
    {
      url: `${baseUrl}/productivity/articles/what-is-information-overload`,
    },

    {
      url: `${baseUrl}/web-internet/articles/what-is-a-web-browser`,
    },
    {
      url: `${baseUrl}/web-internet/articles/what-is-a-url`,
    },
    {
      url: `${baseUrl}/web-internet/articles/how-do-websites-work`,
    },
    {
      url: `${baseUrl}/web-internet/articles/what-is-a-search-engine`,
    },
    {
      url: `${baseUrl}/web-internet/articles/what-is-the-internet`,
    },
  ];
}
