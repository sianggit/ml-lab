"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Global Fatal Error]", error);
    }, [error]);

    return (
        <html lang="id">
            <body
                style={{
                    margin: 0,
                    padding: 0,
                    backgroundColor: "#0B0F19",
                    color: "#f8fafc",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        maxWidth: "480px",
                        backgroundColor: "#111827",
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                >
                    <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "#f8fafc" }}>
                        Sistem Mengalami Kendala
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
                        Terjadi kesalahan fatal pada modul dasar. Silakan muat ulang halaman.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            backgroundColor: "#0284c7",
                            color: "#ffffff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "0.9rem",
                        }}
                    >
                        Muat Ulang
                    </button>
                </div>
            </body>
        </html>
    );
}
