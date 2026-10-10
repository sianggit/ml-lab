import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import ClientLayout from "./client-layout";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-mono",
});

// ─── Site constants (override via env) ───────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ml-lab.edu";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "ML Lab Simulator (Bab 01 - 14)";
const DEFAULT_DESCRIPTION =
    "Portal Simulasi dan Eksperimen Pembelajaran Mesin Interaktif Berbasis Client-Side WebAssembly Pyodide untuk Praktikum Machine Learning.";

// ─── Viewport — must be separate export in Next.js 14+ ───────────────────────
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0B0F19",
};

// ─── Default metadata (child pages can override via their own export) ─────────
export const metadata: Metadata = {
    // Required: tells Next.js the base URL for resolving relative paths in metadata
    metadataBase: new URL(SITE_URL),

    // Title with template — child pages export `title: "Page Name"` → "Page Name | SITE_NAME"
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
        "machine learning",
        "pyodide",
        "scikit-learn",
        "numpy",
        "pandas",
        "data science",
        "interactive ml lab",
        "simulasi machine learning",
    ],
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,

    // Canonical + hreflang (adjust for your actual locales)
    alternates: {
        canonical: "/",
        languages: {
            "id-ID": "/",
        },
    },

    // Open Graph — controls appearance when shared on social media
    openGraph: {
        type: "website",
        locale: "id_ID",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: [
            {
                url: "/og-image.jpg", // place 1200×630 image in /public/og-image.jpg
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
    },

    // Twitter / X Card
    twitter: {
        card: "summary_large_image",
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        images: ["/og-image.jpg"],
        // creator: "@yourtwitter",
    },

    // Crawler instructions
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    // Icons — add the appropriate PNG sizes to /public/
    icons: {
        icon: [
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    // Web app manifest (PWA baseline)
    manifest: "/site.webmanifest",

    // Google Search Console verification (paste your token)
    // verification: { google: "your-token-here" },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    // sameAs: ["https://www.linkedin.com/company/...", "https://www.instagram.com/..."],
    // contactPoint: {
    //     "@type": "ContactPoint",
    //     telephone: "+62-xxx-xxxx-xxxx",
    //     contactType: "customer service",
    //     areaServed: "ID",
    //     availableLanguage: ["Indonesian", "English"],
    // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable} ${inter.className}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
                />
            </head>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}