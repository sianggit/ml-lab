"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconComponent from "@/shared/components/icon";
import { AssignmentItem } from "@/models/assignment/assignment.model";
import { ASSIGNMENT_SIMULATION_PRESETS } from "@/consts/ml-assignment-simulations.const";
import { designTokens } from "@/config/theme";
import { assignmentStyles } from "./assignment-showcase.styles";
import AssignmentNotebookCell from "./assignment-notebook-cell";

interface ChapterShowcaseViewProps {
    assignment: AssignmentItem;
}

export default function ChapterShowcaseView({ assignment }: ChapterShowcaseViewProps) {
    const preset = ASSIGNMENT_SIMULATION_PRESETS.find((p) => p.id === assignment.id || p.id === `sim-${assignment.code.toLowerCase()}`);
    const cellCode = preset?.code || assignment.sourceCodeSnippet || "";

    const pdfResource = assignment.resources.find((r) => r.type === "pdf");
    const imageResources = assignment.resources.filter((r) => r.type === "image");

    return (
        <Box sx={assignmentStyles.cardSection}>
            {/* ─── Header ────────────────────────────────────────────── */}
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Box sx={assignmentStyles.sectionMetaRow}>
                        <Box component="span" sx={assignmentStyles.sectionCode}>
                            {assignment.code}
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
                        <Box component="span" sx={assignmentStyles.tabBadge(assignment.status === "completed" ? "completed" : "active")}>
                            {assignment.status === "completed" ? "Praktikum Selesai" : "Sedang Dikerjakan"}
                        </Box>
                        <Box component="span" sx={{ width: "3px", height: "3px", borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
                        <Typography sx={assignmentStyles.sectionDate}>
                            Jadwal: {assignment.executionDate || assignment.deadline}
                        </Typography>
                    </Box>
                    <Typography component="h2" sx={assignmentStyles.sectionTitle}>
                        {assignment.title}
                    </Typography>
                    <Typography sx={assignmentStyles.sectionSubtitle}>
                        {assignment.subtitle}
                    </Typography>
                </Box>

                {/* Action Buttons: PDF Download + Link to Lab */}
                <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    {pdfResource && (
                        <Box
                            component="a"
                            href={pdfResource.path}
                            download={pdfResource.title}
                            sx={assignmentStyles.downloadBtn}
                        >
                            <IconComponent name="download" size={13} color="#0B0E12" />
                            <span>Unduh Laporan ({pdfResource.size || "PDF"})</span>
                        </Box>
                    )}
                    {assignment.slug && (
                        <Link
                            href={`/ml-lab/${assignment.slug}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border: `1px solid ${designTokens.line}`,
                                backgroundColor: designTokens.boxSubtleBg,
                                color: designTokens.text,
                                textDecoration: "none",
                                fontFamily: designTokens.fontMono,
                                fontSize: "12px",
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                            }}
                        >
                            <span>Buka Modul di Lab ↗</span>
                        </Link>
                    )}
                </Box>
            </Box>

            {/* ─── Abstract Box ──────────────────────────────────────── */}
            <Box sx={assignmentStyles.abstractBox}>
                <Box component="span" sx={assignmentStyles.abstractLabel}>
                    Abstrak Eksperimen
                </Box>
                <Typography sx={assignmentStyles.abstractText}>
                    {assignment.abstract}
                </Typography>
            </Box>

            {/* ─── Executive Metric Cards (Hairlines) ────────────────── */}
            {assignment.metrics && assignment.metrics.length > 0 && (
                <>
                    <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                        Komparasi Kinerja Evaluasi &amp; Tolok Ukur Model
                    </Typography>
                    <Box sx={assignmentStyles.metricGrid}>
                        {assignment.metrics.map((m, idx) => (
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
                </>
            )}

            {/* ─── Dataset Card & Download Source ─────────────────────── */}
            {assignment.datasetName && (
                <Box
                    sx={{
                        p: "18px 22px",
                        border: `1px solid ${designTokens.boxSubtleBorder}`,
                        borderRadius: "8px",
                        bgcolor: designTokens.boxSubtleBg,
                        mb: "24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "14px",
                    }}
                >
                    <Box>
                        <Box sx={{ fontFamily: designTokens.fontMono, fontSize: "10.5px", letterSpacing: "0.15em", textTransform: "uppercase", color: designTokens.dim, mb: "4px" }}>
                            DATASET RIIL SHOWCASE
                        </Box>
                        <Box sx={{ color: designTokens.text, fontSize: "15px", fontWeight: 600 }}>
                            {assignment.datasetName}
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        {assignment.datasetDownloadUrl && (
                            <Box
                                component="a"
                                href={assignment.datasetDownloadUrl}
                                download
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: `1px solid ${designTokens.line}`,
                                    color: designTokens.text,
                                    textDecoration: "none",
                                    fontFamily: designTokens.fontMono,
                                    fontSize: "11.5px",
                                }}
                            >
                                <IconComponent name="download" size={12} color={designTokens.dim} />
                                <span>Unduh CSV</span>
                            </Box>
                        )}
                        {assignment.datasetKaggleUrl && (
                            <Box
                                component="a"
                                href={assignment.datasetKaggleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(52,211,153,0.3)",
                                    color: designTokens.acc,
                                    textDecoration: "none",
                                    fontFamily: designTokens.fontMono,
                                    fontSize: "11.5px",
                                }}
                            >
                                <span>Kaggle Source ↗</span>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

            {/* ─── Visual Output Charts (if available) ────────────────── */}
            {imageResources.length > 0 && (
                <>
                    <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mb: "14px" }}>
                        Visualisasi Bukti Eksperimen &amp; Asosiasi Statistik
                    </Typography>
                    <Box sx={assignmentStyles.chartsRow}>
                        {imageResources.map((res, i) => (
                            <Box key={i} sx={assignmentStyles.chartCard}>
                                <Box
                                    component="img"
                                    src={res.path}
                                    alt={res.title}
                                    sx={assignmentStyles.chartImage}
                                />
                                <Typography sx={assignmentStyles.chartCaption}>{res.title} - {res.description}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            {/* ─── Key Highlights ────────────────────────────────────── */}
            <Box sx={assignmentStyles.solutionBox}>
                <Box component="span" sx={assignmentStyles.solutionPointTitle}>
                    Poin Temuan Kunci &amp; Analisis Metodologi
                </Box>
                <ul style={assignmentStyles.solutionList}>
                    {assignment.keyHighlights.map((hl, idx) => (
                        <li key={idx} style={{ marginBottom: "6px" }}>
                            {hl}
                        </li>
                    ))}
                </ul>
            </Box>

            {/* ─── Live In-Browser Python Notebook Cell ──────────────── */}
            {cellCode && (
                <>
                    <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: designTokens.mute, mt: "32px", mb: "14px" }}>
                        Simulasi Inferensi Python In-Browser (Pyodide WebAssembly)
                    </Typography>
                    <AssignmentNotebookCell
                        key={assignment.id}
                        cellNumber={`01 · ${assignment.code}`}
                        title={`Pipeline Evaluasi Terverifikasi: ${assignment.title}`}
                        code={cellCode}
                        description="Jalankan skrip Python langsung di peramban tanpa backend server untuk memvalidasi replikabilitas model."
                        maxCodeHeight="420px"
                    />
                </>
            )}
        </Box>
    );
}
