"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconComponent from "@/shared/components/icon";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import { ASSIGNMENT_SIMULATION_PRESETS } from "@/consts/ml-assignment-simulations.const";
import { designTokens } from "@/config/theme";
import { assignmentStyles } from "./assignment-showcase.styles";
import AssignmentNotebookCell from "./assignment-notebook-cell";

export default function Bab04Showcase() {
    const item = ML_ASSIGNMENTS.find((a) => a.id === "tugas-bab-04-titanic");
    const bab04Preset = ASSIGNMENT_SIMULATION_PRESETS.find(
        (p) => p.id === "sim-bab04-full-pipeline"
    );

    if (!item) return null;

    const cellCode = bab04Preset?.code || item.sourceCodeSnippet || "";

    return (
        <Box sx={assignmentStyles.cardSection}>
            {/* ─── Header ────────────────────────────────────────────── */}
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Box sx={assignmentStyles.sectionMetaRow}>
                        <Box component="span" sx={assignmentStyles.sectionCode}>
                            {item.code}
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: designTokens.dim }} />
                        <Box component="span" sx={assignmentStyles.tabBadge("completed")}>
                            Laporan Selesai
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: designTokens.dim }} />
                        <Typography sx={assignmentStyles.sectionDate}>
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

                {/* PDF Download Button (White-filled primary button per DESIGN.md) */}
                <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <Box
                        component="a"
                        href="/assignments/bab-04/LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf"
                        download="LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf"
                        sx={assignmentStyles.downloadBtn}
                    >
                        <IconComponent name="download" size={13} color="currentColor" />
                        <span>Unduh Laporan PDF (273 KB)</span>
                    </Box>
                </Box>
            </Box>

            {/* ─── Abstract Box ──────────────────────────────────────── */}
            <Box sx={assignmentStyles.abstractBox}>
                <Box component="span" sx={assignmentStyles.abstractLabel}>
                    Abstrak Eksperimen
                </Box>
                <Typography sx={assignmentStyles.abstractText}>
                    {item.abstract}
                </Typography>
            </Box>

            {/* ─── Executive Metric Cards (Hairlines) ────────────────── */}
            <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                Komparasi Kinerja Model (Test Set N = 179)
            </Typography>
            <Box sx={assignmentStyles.metricGrid}>
                {item.metrics?.map((m, idx) => (
                    <Box key={idx} sx={assignmentStyles.metricCard(idx === 0)}>
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
            <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                Visualisasi Bukti Eksperimen &amp; Asosiasi Statistik
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
                        Gambar 1. Uji Asosiasi Chi-Square Fitur Kategorikal vs Status Survived
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

            {/* ─── Notebook-Style Interactive Simulation Cell ──────────── */}
            <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                Implementasi Source Code Python &amp; Eksekusi Notebook
            </Typography>

            <AssignmentNotebookCell
                cellNumber={1}
                title="titanic_preprocessing_pipeline.py"
                description="ColumnTransformer dengan 3 sub-pipeline: imputasi median & standard scaling numerik, imputasi modus & one-hot encoding nominal (drop first), serta ordinal encoding. Dilengkapi evaluasi komparasi dan visualisasi Confusion Matrix."
                code={cellCode}
                maxCodeHeight="420px"
            />

            {/* ─── Key Highlights List ───────────────────────────────── */}
            <Box sx={assignmentStyles.solutionBox}>
                <Box component="span" sx={assignmentStyles.solutionPointTitle}>
                    Temuan Kritis &amp; Kesimpulan Praktikum
                </Box>
                <ul style={assignmentStyles.solutionList}>
                    {item.keyHighlights.map((point, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>
                            {point}
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    );
}
