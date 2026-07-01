import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    // Uncomment & adapt for CMS-driven pages:
    // const articles = await fetchAllArticles();
    // const dynamicRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    //     url: `${SITE_URL}/articles/${a.slug}`,
    //     lastModified: new Date(a.updatedAt),
    //     changeFrequency: "weekly",
    //     priority: 0.7,
    // }));

    return [...staticRoutes /*, ...dynamicRoutes */];
}