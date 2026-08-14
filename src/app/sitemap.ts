import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://podflix.ae", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://podflix.ae/studio", lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://podflix.ae/pricing", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://podflix.ae/booking", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://podflix.ae/about", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://podflix.ae/faq", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
