import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    robots: { index: false, follow: false }, // never index 404 pages
};

export default function NotFound() {
    return (
        <main style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <h1>404 — Page Not Found</h1>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <Link href="/">Return Home</Link>
        </main>
    );
}