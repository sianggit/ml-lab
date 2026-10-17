"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function Bab04Showcase() {
    const item = ML_ASSIGNMENTS.find((a) => a.id === "tugas-bab-04-titanic");
    const [copied, setCopied] = useState(false);

    if (!item) return null;

    const handleCopyCode = () => {
        if (item.sourceCodeSnippet) {
            navigator.clipboard.writeText(item.sourceCodeSnippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Box sx={assignmentStyles.cardSection}>
            {/* ─── Header ────────────────────────────────────────────── */}
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "6px" }}>
                        <Box
                            component="span"
                            sx={{
                                px: "8px",
                                py: "2px",
                                borderRadius: "4px",
                                bgcolor: "rgba(103, 217, 255, 0.15)",
                                color: "#67D9FF",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono), monospace",
                            }}
                        >
                            {item.code}
                        </Box>
                        <Box component="span" sx={assignmentStyles.tabBadge("completed")}>
                            ✓ Selesai & Teruji
                        </Box>
                        <Typography sx={{ fontSize: "0.78rem", color: "#8E99A8" }}>
                            Pelaksanaan: {item.executionDate}
                        </Typography>
                    </Box>
                    <Typography component="h2" sx={assignmentStyles.sectionTitle}>
                        {item.title}
                    </Typography>
                    <Typography sx={assignmentStyles.sectionSubtitle}>
                        {item.subtitle}
                    </Typography>
                </Box>

                {/* PDF Download Button */}
                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Box
                        component="a"
                        href="/assignments/bab-04/LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf"
                        download="LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf"
                        sx={assignmentStyles.downloadBtn}
                    >
                        <span>⬇ Unduh Laporan PDF (273 KB)</span>
                    </Box>
                </Box>
            </Box>

            {/* ─── Abstract Box ──────────────────────────────────────── */}
            <Box
                sx={{
                    p: "16px",
                    borderRadius: "8px",
                    bgcolor: "rgba(0, 0, 0, 0.25)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    mb: "20px",
                }}
            >
                <Typography sx={{ fontSize: "0.76rem", fontWeight: 700, color: "#67D9FF", textTransform: "uppercase", letterSpacing: "0.04em", mb: "6px" }}>
                    Abstrak Eksperimen
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.5, textAlign: "justify" }}>
                    {item.abstract}
                </Typography>
            </Box>

            {/* ─── Executive Metric Cards ────────────────────────────── */}
            <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#F5F7FA", mb: "10px" }}>
                Komparasi Kinerja Model (Test Set N = 179)
            </Typography>
            <Box sx={assignmentStyles.metricGrid}>
                {item.metrics?.map((m, idx) => (
                    <Box key={idx} sx={assignmentStyles.metricCard(m.highlight)}>
                        <Typography sx={assignmentStyles.metricLabel}>{m.label}</Typography>
                        <Box sx={assignmentStyles.metricValueRow}>
                            <Typography sx={assignmentStyles.metricValue}>{m.enhanced}</Typography>
                            {m.delta && (
                                <Box component="span" sx={assignmentStyles.metricDelta}>
                                    {m.delta}
                                </Box>
                            )}
                        </Box>
                        <Typography sx={assignmentStyles.metricBaseline}>
                            Baseline: {m.baseline}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* ─── Visual Output Charts ──────────────────────────────── */}
            <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#F5F7FA", mb: "10px" }}>
                Visualisasi Bukti Eksperimen & Asosiasi Statistik
            </Typography>
            <Box sx={assignmentStyles.chartsRow}>
                <Box sx={assignmentStyles.chartCard}>
                    <Box
                        component="img"
                        src="/assignments/bab-04/chi_square_features.png"
                        alt="Uji Chi-Square Fitur Titanic"
                        sx={assignmentStyles.chartImage}
                    />
                    <Typography sx={assignmentStyles.chartCaption}>
                        Gambar 1. Uji Asosiasi Chi-Square (χ²) Fitur Kategorikal vs Status Survived
                    </Typography>
                </Box>

                <Box sx={assignmentStyles.chartCard}>
                    <Box
                        component="img"
                        src="/assignments/bab-04/confusion_matrix_comparison.png"
                        alt="Matriks Konfusi Komparasi"
                        sx={assignmentStyles.chartImage}
                    />
                    <Typography sx={assignmentStyles.chartCaption}>
                        Gambar 2. Komparasi Confusion Matrix Logistic Regression vs Random Forest
                    </Typography>
                </Box>
            </Box>

            {/* ─── Source Code Snippet ───────────────────────────────── */}
            <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#F5F7FA", mb: "10px" }}>
                Implementasi Source Code Python (ColumnTransformer & Pipeline)
            </Typography>
            <Box sx={assignmentStyles.codeContainer}>
                <Box sx={assignmentStyles.codeHeader}>
                    <Typography sx={assignmentStyles.codeTitle}>titanic_preprocessing_pipeline.py</Typography>
                    <Button
                        size="small"
                        onClick={handleCopyCode}
                        sx={{
                            color: copied ? "#43D9A3" : "#8E99A8",
                            fontSize: "0.72rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                        }}
                    >
                        {copied ? "✓ Tersalin" : "Salin Kode"}
                    </Button>
                </Box>
                <Box component="pre" sx={assignmentStyles.codePre}>
                    <code>{item.sourceCodeSnippet}</code>
                </Box>
            </Box>

            {/* ─── Key Highlights List ───────────────────────────────── */}
            <Box
                sx={{
                    p: "16px",
                    borderRadius: "8px",
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
            >
                <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#43D9A3", textTransform: "uppercase", letterSpacing: "0.04em", mb: "8px" }}>
                    Temuan Kritis & Kesimpulan Praktikum
                </Typography>
                <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.84rem", color: "#CBD5E1", lineHeight: 1.55 }}>
                    {item.keyHighlights.map((point, idx) => (
                        <li key={idx} style={{ marginBottom: "4px" }}>
                            {point}
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
}
