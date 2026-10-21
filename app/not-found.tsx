import type { Metadata } from "next";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { designTokens } from "@/config/theme";

export const metadata: Metadata = {
    title: "404 - Halaman Tidak Ditemukan | ML Lab",
    description: "Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <Box
            component="main"
            sx={{
                minHeight: "75vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "4rem 2rem",
                color: designTokens.text,
            }}
        >
            <Typography
                sx={{
                    fontFamily: designTokens.fontMono,
                    fontSize: "0.85rem",
                    letterSpacing: "0.2em",
                    color: designTokens.acc,
                    textTransform: "uppercase",
                    mb: 1.5,
                }}
            >
                Error 404
            </Typography>
            <Typography
                variant="h3"
                component="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2rem", sm: "3rem" },
                    letterSpacing: "-0.03em",
                    color: designTokens.text,
                    mb: 2,
                }}
            >
                Halaman Tidak Ditemukan
            </Typography>
            <Typography
                sx={{
                    maxWidth: 480,
                    color: designTokens.mute,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    mb: 4,
                }}
            >
                Modul, halaman, atau praktikum yang Anda cari tidak tersedia atau alamat URL telah diperbarui.
            </Typography>
            <Link href="/" style={{ textDecoration: "none" }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: designTokens.acc,
                        color: designTokens.accContrast,
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: designTokens.acc,
                            opacity: 0.9,
                        },
                    }}
                >
                    Kembali ke Beranda
                </Button>
            </Link>
        </Box>
    );
}