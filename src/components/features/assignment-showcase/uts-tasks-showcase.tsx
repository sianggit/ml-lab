"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function UtsTasksShowcase() {
    const item = ML_ASSIGNMENTS.find((a) => a.id === "tugas-uts-pertemuan-1-6");

    if (!item) return null;

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
                                bgcolor: "rgba(255, 184, 77, 0.15)",
                                color: "#FFB84D",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono), monospace",
                            }}
                        >
                            {item.code}
                        </Box>
                        <Box component="span" sx={assignmentStyles.tabBadge("active")}>
                            ⏳ Aktif / Dalam Pengerjaan
                        </Box>
                        <Typography sx={{ fontSize: "0.78rem", color: "#FFB84D", fontWeight: 600 }}>
                            Batas Submit: {item.deadline}
                        </Typography>
                    </Box>
                    <Typography component="h2" sx={assignmentStyles.sectionTitle}>
                        {item.title}
                    </Typography>
                    <Typography sx={assignmentStyles.sectionSubtitle}>
                        {item.subtitle}
                    </Typography>
                </Box>

                {/* PDF Soal Download Button */}
                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <Box
                        component="a"
                        href="/assignments/uts/Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf"
                        download="Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf"
                        sx={assignmentStyles.secondaryBtn}
                    >
                        <span>📄 Unduh Berkas Soal Resmi (187 KB)</span>
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
                <Typography sx={{ fontSize: "0.76rem", fontWeight: 700, color: "#FFB84D", textTransform: "uppercase", letterSpacing: "0.04em", mb: "6px" }}>
                    Ringkasan Penugasan & Kisi-Kisi UTS
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#CBD5E1", lineHeight: 1.5, textAlign: "justify" }}>
                    {item.abstract}
                </Typography>
            </Box>

            {/* ─── 5 Question Cards ─────────────────────────────────── */}
            <Typography sx={{ fontSize: "0.92rem", fontWeight: 750, color: "#F5F7FA", mb: "14px" }}>
                Rincian Analisis & Komputasi 5 Paket Soal
            </Typography>

            {item.questions?.map((q) => (
                <Box key={q.id} sx={assignmentStyles.questionCard}>
                    <Box sx={assignmentStyles.questionBadgeRow}>
                        <Box component="span" sx={assignmentStyles.questionNumber}>
                            {q.number}
                        </Box>
                        <Typography sx={assignmentStyles.questionTopic}>
                            Topik: {q.topic}
                        </Typography>
                    </Box>

                    <Typography sx={assignmentStyles.questionTitle}>
                        {q.title}
                    </Typography>

                    <Typography sx={assignmentStyles.questionDesc}>
                        {q.description}
                    </Typography>

                    {/* Solution Points */}
                    <Box sx={assignmentStyles.solutionBox}>
                        {q.solutionPoints.map((pt, pIdx) => (
                            <Box key={pIdx} sx={{ mb: pIdx === q.solutionPoints.length - 1 ? 0 : "12px" }}>
                                <Typography sx={assignmentStyles.solutionPointTitle}>
                                    {pt.subtitle}
                                </Typography>
                                <ul style={assignmentStyles.solutionList}>
                                    {pt.details.map((d, dIdx) => (
                                        <li key={dIdx} style={{ marginBottom: "3px" }}>
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
