import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";

// ─── SEO ─────────────────────────────────────────────────────────────────────
export const metadata: Metadata = buildPageMetadata({
    title: "Page Title",
    description: "Page description.",
    canonical: "/",
    ogImage: "/og/home.jpg",
});

// ─── JSON-LD: WebSite schema for sitelinks searchbox ─────────────────────────
const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PT Aero Systems Indonesia",
    url: "https://asyst.co.id",
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: "https://asyst.co.id/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
    },
};

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            Home Page
        </>
    );
}