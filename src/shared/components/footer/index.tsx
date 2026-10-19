"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import IconComponent from "@/shared/components/icon";
import { footerStyles } from "./footer.styles";

export default function Footer() {
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
                            sx={{ fontSize: "0.72rem", color: "#9CA3AF", borderColor: "rgba(255,255,255,0.1)" }}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            label="MUI + Emotion SSR"
                            sx={{ fontSize: "0.72rem", color: "#9CA3AF", borderColor: "rgba(255,255,255,0.1)" }}
                        />
                        <Chip
                            size="small"
                            variant="outlined"
                            label="Pyodide WASM Engine"
                            sx={{ fontSize: "0.72rem", color: "#10B981", borderColor: "rgba(16,185,129,0.3)" }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
