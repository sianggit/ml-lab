"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import IconComponent from "@/shared/components/icon";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { footerStyles } from "./footer.styles";

export default function Footer() {
    const { themeMode } = useMlLabStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Box component="footer" sx={footerStyles.footer}>
            <Box sx={footerStyles.container}>
                <Box sx={footerStyles.mainGrid}>
                    {/* Brand & Academic Profile */}
                    <Box sx={footerStyles.brandColumn}>
                        <Box sx={footerStyles.brandTitle}>
                            <Box
                                component="img"
                                src="/ap-logo-white.png"
                                alt="Logo AP"
                                sx={{
                                    height: 24,
                                    width: "auto",
                                    maxWidth: 36,
                                    objectFit: "contain",
                                    display: "inline-block",
                                    filter:
                                        isMounted && themeMode === "light"
                                            ? "invert(0.9) drop-shadow(0 2px 6px rgba(2, 132, 199, 0.2))"
                                            : "drop-shadow(0 2px 6px rgba(103, 217, 255, 0.2))",
                                    transition: "filter 0.25s ease",
                                }}
                            />
                            <span>ML Lab Simulator</span>
                        </Box>
                        <Typography sx={footerStyles.brandSubtitle}>
                            Platform interaktif laboratorium <i>Machine Learning</i> untuk menjalankan komputasi Python murni
                            di dalam browser secara client-side menggunakan WebAssembly & Pyodide engine.
                        </Typography>
                    </Box>

                    {/* Kurikulum & Modul */}
                    <Box>
                        <Typography sx={footerStyles.columnTitle}>Modul Utama</Typography>
                        <Box component="ul" sx={footerStyles.linkList}>
                            <li>
                                <Box component={Link} href="/kurikulum" sx={footerStyles.footerLink}>
                                    Kurikulum Bab 01 - 14
                                </Box>
                            </li>
                            <li>
                                <Box component={Link} href="/sandbox" sx={footerStyles.footerLink}>
                                    Monaco Python Sandbox
                                </Box>
                            </li>
                            <li>
                                <Box component={Link} href="/laporan" sx={footerStyles.footerLink}>
                                    Laporan &amp; Portofolio Praktikum
                                </Box>
                            </li>
                            <li>
                                <Box component={Link} href="/ml-lab/01-pengantar-ml-dan-colab" sx={footerStyles.footerLink}>
                                    Mulai di Bab 01
                                </Box>
                            </li>
                        </Box>
                    </Box>

                    {/* Repositori & Lisensi */}
                    <Box>
                        <Typography sx={footerStyles.columnTitle}>Infrastruktur</Typography>
                        <Box component="ul" sx={footerStyles.linkList}>
                            <li>
                                <Box
                                    component="a"
                                    href="https://github.com/pyodide/pyodide"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={footerStyles.footerLink}
                                >
                                    Pyodide WebAssembly
                                </Box>
                            </li>
                            <li>
                                <Box
                                    component="a"
                                    href="https://scikit-learn.org"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={footerStyles.footerLink}
                                >
                                    Scikit-learn v1.5+
                                </Box>
                            </li>
                            <li>
                                <Box
                                    component="a"
                                    href="https://vercel.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={footerStyles.footerLink}
                                >
                                    Vercel Deployment: Live
                                </Box>
                            </li>
                        </Box>
                    </Box>
                </Box>

                {/* Bottom Bar */}
                <Box sx={footerStyles.bottomBar}>
                    <Typography sx={footerStyles.copyrightText}>
                        &copy; {new Date().getFullYear()} Laboratorium Machine Learning • Anggit Pratama. All rights reserved.
                    </Typography>

                    <Box sx={footerStyles.badgeRow}>
                        <Chip
                            size="small"
                            variant="outlined"
                            label="Next.js 16 App Router"
                            sx={{ fontSize: "0.72rem", color: "var(--ml-mute)", borderColor: "var(--ml-line)" }}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            label="MUI + Emotion SSR"
                            sx={{ fontSize: "0.72rem", color: "var(--ml-mute)", borderColor: "var(--ml-line)" }}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            label="Pyodide WASM Engine"
                            sx={{ fontSize: "0.72rem", color: "var(--ml-acc)", borderColor: "rgba(52, 211, 153, 0.3)" }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
