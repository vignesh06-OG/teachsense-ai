import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://teachsense.ai";
  const fixedDate = new Date("2026-10-11T10:00:00.000Z");

  return [
    {
      url: `${baseUrl}/`,
      lastModified: fixedDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: fixedDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quality`,
      lastModified: fixedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/architecture`,
      lastModified: fixedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/challenge-alignment`,
      lastModified: fixedDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
