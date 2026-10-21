"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import IconComponent from "@/shared/components/icon";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log error for client observability
        console.error("[App ErrorBoundary Caught Exception]", {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 8,
                textAlign: "center",
                background: "radial-gradient(ellipse at top, var(--ml-panel-alt, #1e1b4b) 0%, var(--ml-bg, #0B0F19) 70%)",
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "20px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 0 30px rgba(239, 68, 68, 0.2)",
                }}
            >
                <IconComponent name="alert-triangle" size={36} color="#ef4444" />
            </Box>

            <Typography
                variant="h4"
                component="h1"
                sx={{
                    fontWeight: 700,
                    color: "var(--ml-text, #f8fafc)",
                    fontSize: { xs: "1.5rem", sm: "1.85rem" },
                    mb: 1.5,
                }}
            >
                Terjadi Kendala pada Sesi Laboratorium
            </Typography>

            <Typography
                sx={{
                    color: "var(--ml-mute, #94a3b8)",
                    maxWidth: 540,
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    mb: 4,
                }}
            >
                Sistem mengalami anomali saat memproses tampilan atau runtime simulasi.
                Data progres Anda yang telah tersimpan di browser tetap aman.
            </Typography>

            {error.digest && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "var(--ml-dim, #64748b)",
                        fontFamily: "var(--font-mono)",
                        background: "var(--ml-box-subtle-bg, rgba(15, 23, 42, 0.6))",
                        border: "1px solid var(--ml-line, rgba(255, 255, 255, 0.08))",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "6px",
                        mb: 4,
                    }}
                >
                    ID Insiden: {error.digest}
                </Typography>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={reset}
                    variant="contained"
                    sx={{
                        background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                        color: "#ffffff",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                        py: 1.2,
                        borderRadius: "10px",
                        boxShadow: "0 4px 14px rgba(2, 132, 199, 0.35)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #0369a1 0%, #075985 100%)",
                        },
                    }}
                >
                    Muat Ulang Komponen
                </Button>

                <Button
                    component={Link}
                    href="/"
                    variant="outlined"
                    sx={{
                        borderColor: "var(--ml-line, rgba(255, 255, 255, 0.15))",
                        color: "var(--ml-text, #e2e8f0)",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                        py: 1.2,
                        borderRadius: "10px",
                        "&:hover": {
                            borderColor: "var(--ml-line, rgba(255, 255, 255, 0.3))",
                            background: "var(--ml-box-subtle-bg, rgba(255, 255, 255, 0.04))",
                        },
                    }}
                >
                    Kembali ke Beranda
                </Button>
            </Box>
        </Box>
    );
}
