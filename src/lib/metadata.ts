import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://asyst.co.id";
const SITE_NAME = "PT Aero Systems Indonesia (ASYST)";

type BuildMetadataOptions = {
    title: string;
    description: string;
    canonical: string;
    ogImage?: string;
    noIndex?: boolean;
};

/**
 * Build consistent per-page metadata.
 * Usage:
 *   export const metadata = buildPageMetadata({ title: "About Us", description: "...", canonical: "/about" });
 */
export function buildPageMetadata({
    title,
    description,
    canonical,
    ogImage = "/og-image.jpg",
    noIndex = false,
}: BuildMetadataOptions): Metadata {
    const url = `${SITE_URL}${canonical}`;

    return {
        title,
        description,

        alternates: {
            canonical,
        },

        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            url,
            siteName: SITE_NAME,
            locale: "id_ID",
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${title} — ${SITE_NAME}`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: `${title} | ${SITE_NAME}`,
            description,
            images: [ogImage],
        },

        robots: noIndex
            ? { index: false, follow: false }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                  },
              },
    };
}

export { SITE_URL, SITE_NAME };