"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconComponent from "@/shared/components/icon";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import { ASSIGNMENT_SIMULATION_PRESETS } from "@/consts/ml-assignment-simulations.const";
import { designTokens } from "@/config/theme";
import { assignmentStyles } from "./assignment-showcase.styles";
import AssignmentNotebookCell from "./assignment-notebook-cell";

const QUESTION_SIM_PRESETS: Record<string, string> = {
    "soal-2": "sim-uts-soal-2-smote",
    "soal-3": "sim-uts-soal-3-chi2",
    "soal-4": "sim-uts-soal-4-tree",
    "soal-5": "sim-uts-soal-5-knn",
};

export default function UtsTasksShowcase() {
    const item = ML_ASSIGNMENTS.find((a) => a.id === "tugas-uts-pertemuan-1-6");

    if (!item) return null;

    return (
        <Box sx={assignmentStyles.cardSection}>
            {/* ─── Header ────────────────────────────────────────────── */}
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Box sx={assignmentStyles.sectionMetaRow}>
                        <Box component="span" sx={assignmentStyles.sectionCode}>
                            {item.code}
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
                        <Box component="span" sx={assignmentStyles.tabBadge("active")}>
                            Aktif / Dalam Pengerjaan
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
                        <Typography sx={assignmentStyles.sectionDate}>
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

                {/* PDF Soal Download Button (Hairline Ghost per DESIGN.md) */}
                <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <Box
                        component="a"
                        href="/assignments/uts/Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf"
                        download="Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf"
                        sx={assignmentStyles.secondaryBtn}
                    >
                        <IconComponent name="file-pdf" size={13} color={designTokens.text} />
                        <span>Unduh Berkas Soal Resmi (187 KB)</span>
                    </Box>
                </Box>
            </Box>

            {/* ─── Abstract Box ──────────────────────────────────────── */}
            <Box sx={assignmentStyles.abstractBox}>
                <Box component="span" sx={assignmentStyles.abstractLabel}>
                    Ringkasan Penugasan &amp; Kisi-Kisi UTS
                </Box>
                <Typography sx={assignmentStyles.abstractText}>
                    {item.abstract}
                </Typography>
            </Box>

            {/* ─── 5 Question Rows with Inline Notebook Cells ────────── */}
            <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                Rincian Analisis &amp; Komputasi 5 Paket Soal
            </Typography>

            <Box sx={assignmentStyles.questionList}>
                {item.questions?.map((q) => {
                    const presetId = QUESTION_SIM_PRESETS[q.id];
                    const simPreset = presetId
                        ? ASSIGNMENT_SIMULATION_PRESETS.find((p) => p.id === presetId)
                        : null;

                    return (
                        <Box key={q.id} sx={assignmentStyles.questionRow}>
                            <Box sx={assignmentStyles.questionHeader}>
                                <Box component="span" sx={assignmentStyles.questionIndex}>
                                    {q.number}
                                </Box>
                                <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
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
                                        <Box component="span" sx={assignmentStyles.solutionPointTitle}>
                                            {pt.subtitle}
                                        </Box>
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

                            {/* Inline Notebook-Style Simulation Cell (if question involves numerical computation) */}
                            {simPreset && (
                                <Box sx={{ mt: "18px" }}>
                                    <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "8px" }}>
                                        Implementasi Komputasi &amp; Notebook Cell (WASM)
                                    </Typography>
                                    <AssignmentNotebookCell
                                        cellNumber={q.number}
                                        title={`${q.id.replace("-", "_")}_simulation.py`}
                                        description={simPreset.description}
                                        code={simPreset.code}
                                        maxCodeHeight="360px"
                                    />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
