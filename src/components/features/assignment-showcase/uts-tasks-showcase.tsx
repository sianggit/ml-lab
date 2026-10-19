"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import { assignmentStyles } from "./assignment-showcase.styles";
import AssignmentSimulationRunner from "./assignment-simulation-runner";

const QUESTION_SIM_PRESETS: Record<string, string> = {
    "soal-2": "sim-uts-soal-2-smote",
    "soal-3": "sim-uts-soal-3-chi2",
    "soal-4": "sim-uts-soal-4-tree",
    "soal-5": "sim-uts-soal-5-knn",
};

export default function UtsTasksShowcase() {
    const item = ML_ASSIGNMENTS.find((a) => a.id === "tugas-uts-pertemuan-1-6");
    const [activeSimulationPreset, setActiveSimulationPreset] = useState<string | null>(null);

    if (!item) return null;

    const handleToggleSimulation = (presetId: string) => {
        if (activeSimulationPreset === presetId) {
            setActiveSimulationPreset(null);
        } else {
            setActiveSimulationPreset(presetId);
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

            {/* ─── Interactive WASM Simulation Action Bar ────────────── */}
            <Box
                sx={{
                    p: "14px 16px",
                    borderRadius: "10px",
                    bgcolor: "rgba(103, 217, 255, 0.05)",
                    border: "1px solid rgba(103, 217, 255, 0.20)",
                    mb: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Box
                        component="span"
                        sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            bgcolor: "#67D9FF",
                            boxShadow: "0 0 8px #67D9FF",
                        }}
                    />
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#F5F7FA" }}>
                        Simulasi Interaktif Komputasi UTS (Pyodide WASM Engine)
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <Button
                        size="small"
                        onClick={() => handleToggleSimulation("sim-uts-soal-5-knn")}
                        sx={{
                            bgcolor: activeSimulationPreset === "sim-uts-soal-5-knn" ? "rgba(103, 217, 255, 0.25)" : "rgba(255, 255, 255, 0.05)",
                            color: activeSimulationPreset === "sim-uts-soal-5-knn" ? "#67D9FF" : "#CBD5E1",
                            border: "1px solid rgba(103, 217, 255, 0.25)",
                            fontSize: "0.74rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": { bgcolor: "rgba(103, 217, 255, 0.20)" },
                        }}
                    >
                        ▶ Soal 5: KNN (q=3,5)
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handleToggleSimulation("sim-uts-soal-4-tree")}
                        sx={{
                            bgcolor: activeSimulationPreset === "sim-uts-soal-4-tree" ? "rgba(103, 217, 255, 0.25)" : "rgba(255, 255, 255, 0.05)",
                            color: activeSimulationPreset === "sim-uts-soal-4-tree" ? "#67D9FF" : "#CBD5E1",
                            border: "1px solid rgba(103, 217, 255, 0.25)",
                            fontSize: "0.74rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": { bgcolor: "rgba(103, 217, 255, 0.20)" },
                        }}
                    >
                        ▶ Soal 4: Decision Tree
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handleToggleSimulation("sim-uts-soal-3-chi2")}
                        sx={{
                            bgcolor: activeSimulationPreset === "sim-uts-soal-3-chi2" ? "rgba(103, 217, 255, 0.25)" : "rgba(255, 255, 255, 0.05)",
                            color: activeSimulationPreset === "sim-uts-soal-3-chi2" ? "#67D9FF" : "#CBD5E1",
                            border: "1px solid rgba(103, 217, 255, 0.25)",
                            fontSize: "0.74rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": { bgcolor: "rgba(103, 217, 255, 0.20)" },
                        }}
                    >
                        ▶ Soal 3: Chi-Square
                    </Button>
                    <Button
                        size="small"
                        onClick={() => handleToggleSimulation("sim-uts-soal-2-smote")}
                        sx={{
                            bgcolor: activeSimulationPreset === "sim-uts-soal-2-smote" ? "rgba(103, 217, 255, 0.25)" : "rgba(255, 255, 255, 0.05)",
                            color: activeSimulationPreset === "sim-uts-soal-2-smote" ? "#67D9FF" : "#CBD5E1",
                            border: "1px solid rgba(103, 217, 255, 0.25)",
                            fontSize: "0.74rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": { bgcolor: "rgba(103, 217, 255, 0.20)" },
                        }}
                    >
                        ▶ Soal 2: SMOTE
                    </Button>
                </Box>
            </Box>

            {/* ─── Active Simulation Runner View ─────────────────────── */}
            {activeSimulationPreset && (
                <AssignmentSimulationRunner
                    assignmentId="tugas-uts-pertemuan-1-6"
                    initialPresetId={activeSimulationPreset}
                    onClose={() => setActiveSimulationPreset(null)}
                />
            )}

            {/* ─── 5 Question Cards ─────────────────────────────────── */}
            <Typography sx={{ fontSize: "0.92rem", fontWeight: 750, color: "#F5F7FA", mb: "14px" }}>
                Rincian Analisis & Komputasi 5 Paket Soal
            </Typography>

            {item.questions?.map((q) => {
                const simPreset = QUESTION_SIM_PRESETS[q.id];
                const isThisSimActive = activeSimulationPreset === simPreset;

                return (
                    <Box key={q.id} sx={assignmentStyles.questionCard}>
                        <Box sx={assignmentStyles.questionBadgeRow}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Box component="span" sx={assignmentStyles.questionNumber}>
                                    {q.number}
                                </Box>
                                <Typography sx={assignmentStyles.questionTopic}>
                                    Topik: {q.topic}
                                </Typography>
                            </Box>

                            {simPreset && (
                                <Button
                                    size="small"
                                    onClick={() => handleToggleSimulation(simPreset)}
                                    sx={{
                                        color: isThisSimActive ? "#67D9FF" : "#43D9A3",
                                        bgcolor: isThisSimActive ? "rgba(103, 217, 255, 0.14)" : "rgba(67, 217, 163, 0.12)",
                                        border: isThisSimActive ? "1px solid rgba(103, 217, 255, 0.35)" : "1px solid rgba(67, 217, 163, 0.30)",
                                        fontSize: "0.72rem",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        fontFamily: "var(--font-mono), monospace",
                                        px: "8px",
                                        py: "2px",
                                        "&:hover": {
                                            bgcolor: isThisSimActive ? "rgba(103, 217, 255, 0.22)" : "rgba(67, 217, 163, 0.20)",
                                        },
                                    }}
                                >
                                    {isThisSimActive ? "▼ Tutup Simulasi" : "▶ Run Simulasi Soal"}
                                </Button>
                            )}
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
                );
            })}
        </Box>
    );
}

