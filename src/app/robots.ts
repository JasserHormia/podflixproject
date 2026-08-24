import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

/**
 * Only the production domain may be indexed. Vercel preview and development
 * deployments serve identical content on *.vercel.app, which would otherwise
 * be crawled as duplicates of podflixpodcast.ae.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
