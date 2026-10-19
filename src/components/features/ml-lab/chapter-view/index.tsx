"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { Chapter } from "@/models/ml-lab/chapter.model";
import { getChapterByNumber } from "@/consts/ml-chapters.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import CodeCell from "@/components/features/ml-lab/code-cell";
import CellOutput from "@/components/features/ml-lab/cell-output";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import MathFormula from "@/shared/components/math-formula";
import { designTokens } from "@/config/theme";
import { chapterViewStyles } from "./chapter-view.styles";

export interface ChapterViewProps {
    chapter: Chapter;
}

const SAMPLE_FEATURE_DATA = [15, 32, 60, 110, 220, 480];

export default function ChapterView({ chapter }: ChapterViewProps) {
    const [activeTab, setActiveTab] = useState<"sandbox" | "notebook">("notebook");
    const [scalingMode, setScalingMode] = useState<"raw" | "mm" | "z">("raw");
    const [multiplier, setMultiplier] = useState<number>(1.5);
    const [selectedVariantId, setSelectedVariantId] = useState<"original" | "alternatif">("original");
    const [showCsvPreview, setShowCsvPreview] = useState<boolean>(false);

    const { chapterProgress, toggleChapterCompleted, recordChapterStage, recordChapterExecution } = useMlLabStore();
    const { runCode, isExecuting, lastOutput, resetKernel } = usePyodideKernel();

    const handleRunCode = async (code: string) => {
        const output = await runCode(code);
        if (output) {
            recordChapterExecution(chapter.slug, code, output, 100);
        }
        return output;
    };

    const savedProgress = chapterProgress[chapter.slug];
    const isDone = !!savedProgress?.isCompleted;

    const activeVariant = useMemo(() => {
        if (!chapter.variants || chapter.variants.length === 0) return null;
        return chapter.variants.find((v) => v.id === selectedVariantId) || chapter.variants[0];
    }, [chapter.variants, selectedVariantId]);

    const codeToRun = activeVariant ? activeVariant.code : (savedProgress?.executedCode || chapter.initialCode);

    const padNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    // Split title for editorial gray gradient on the last word
    const titleWords = chapter.title.split(" ");
    const lastTitleWord = titleWords.pop() || "";
    const mainTitleText = titleWords.join(" ");

    const prevChapter = getChapterByNumber(chapter.number - 1);
    const nextChapter = getChapterByNumber(chapter.number + 1);

    const handleToggleComplete = () => {
        const nextState = toggleChapterCompleted(chapter.slug, 100);
        if (nextState) {
            import("canvas-confetti").then(({ default: confetti }) => {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#34D399", "#F3F5F7", "#8B93A1"],
                });
            });
        }
    };

    const handleScaleModeChange = (mode: "raw" | "mm" | "z") => {
        setScalingMode(mode);
        recordChapterStage(chapter.slug, "sandbox");
    };

    // Scaled data calculations for feature scaling interactive visual twin
    const chartData = useMemo(() => {
        const v = SAMPLE_FEATURE_DATA.map((x) => x * multiplier);
        const mean = v.reduce((a, b) => a + b, 0) / v.length;
        const sd = Math.sqrt(
            v.reduce((a, b) => a + (b - mean) * (b - mean), 0) / v.length
        );
        const mn = Math.min(...v);
        const mx = Math.max(...v);

        let o: number[] = [];
        if (scalingMode === "raw") {
            o = v;
        } else if (scalingMode === "mm") {
            o = v.map((x) => (x - mn) / (mx - mn));
        } else {
            o = v.map((x) => (x - mean) / sd);
        }

        const outMin = Math.min(...o);
        const outMax = Math.max(...o);
        const lo = Math.min(0, outMin);
        const hi = Math.max(0, outMax);

        const getY = (y: number) => {
            if (hi === lo) return 110;
            return 220 - ((y - lo) / (hi - lo)) * 180;
        };

        return {
            values: o,
            min: outMin.toFixed(2),
            max: outMax.toFixed(2),
            modeLabel:
                scalingMode === "raw" ? "RAW" : scalingMode === "mm" ? "MINMAX" : "Z-SCORE",
            zeroY: getY(0),
            bars: o.map((y, i) => {
                const a = getY(Math.max(y, 0));
                const b = getY(Math.min(y, 0));
                return {
                    x: 60 + i * 88,
                    y: a,
                    height: Math.max(2, b - a),
                    val: y.toFixed(2),
                    label: `X_${i + 1}`,
                    isNegative: y < 0,
                    textY: y < 0 ? b + 14 : a - 8,
                };
            }),
        };
    }, [multiplier, scalingMode]);

    return (
        <Box sx={chapterViewStyles.wrap}>
            {/* ─── Chapter Head (DESIGN.md Eyebrow + Display H1) ─────────────── */}
            <Box sx={chapterViewStyles.head}>
                <Box sx={chapterViewStyles.eyebrow}>
                    <Box component="span" sx={chapterViewStyles.eyebrowLine} />
                    <Box component="span" sx={chapterViewStyles.eyebrowLabel}>
                        LABORATORIUM PRAKTIKUM
                    </Box>
                    <Box component="span" sx={chapterViewStyles.eyebrowDot} />
                    <Box component="span" sx={chapterViewStyles.eyebrowSubject}>
                        BAB {padNumber(chapter.number)} · MODUL {padNumber(chapter.number)} / 14
                    </Box>
                </Box>

                <Box component="h1" sx={chapterViewStyles.title}>
                    {mainTitleText ? `${mainTitleText} ` : ""}
                    <Box component="span" sx={chapterViewStyles.titleGradient}>
                        {lastTitleWord}
                    </Box>
                </Box>

                <Box component="p" sx={chapterViewStyles.lead}>
                    {chapter.summary}
                </Box>
            </Box>

            {/* ─── Hairline Metadata Plate (DESIGN.md) ───────────────────────── */}
            <Box sx={chapterViewStyles.plate}>
                <Box sx={chapterViewStyles.plateCell(false)}>
                    <Box component="span" sx={chapterViewStyles.plateLabel}>01 / MODUL</Box>
                    <Box component="span" sx={chapterViewStyles.plateValue}>
                        Bab {padNumber(chapter.number)} ({chapter.category})
                    </Box>
                </Box>
                <Box sx={chapterViewStyles.plateCell(false)}>
                    <Box component="span" sx={chapterViewStyles.plateLabel}>02 / ESTIMASI</Box>
                    <Box component="span" sx={chapterViewStyles.plateValue}>
                        {chapter.estimatedMinutes} Menit Komputasi
                    </Box>
                </Box>
                <Box sx={chapterViewStyles.plateCell(false)}>
                    <Box component="span" sx={chapterViewStyles.plateLabel}>03 / LINGKUNGAN</Box>
                    <Box component="span" sx={chapterViewStyles.plateValueAccent}>
                        Pyodide WebAssembly (Client)
                    </Box>
                </Box>
                <Box sx={chapterViewStyles.plateCell(true)}>
                    <Box component="span" sx={chapterViewStyles.plateLabel}>04 / STATUS</Box>
                    <Box component="span" sx={chapterViewStyles.plateValue}>
                        {isDone ? "100% Selesai Terverifikasi" : "Siap Dijalankan"}
                    </Box>
                </Box>
            </Box>

            {/* ─── Open Tabs Navigation (DESIGN.md) ──────────────────────────── */}
            <Box sx={chapterViewStyles.tabs} role="tablist" aria-label="Tab modul praktikum">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "notebook"}
                    onClick={() => setActiveTab("notebook")}
                    style={chapterViewStyles.tabButton(activeTab === "notebook")}
                >
                    <sup>01</sup>
                    <span>Interactive Notebook &amp; Python</span>
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "sandbox"}
                    onClick={() => setActiveTab("sandbox")}
                    style={chapterViewStyles.tabButton(activeTab === "sandbox")}
                >
                    <sup>02</sup>
                    <span>Visual Sandbox (Interactive Twin)</span>
                </button>
            </Box>

            {/* ─── Tab Content: Notebook & Python ─────────────────────────────── */}
            {activeTab === "notebook" && (
                <Box>
                    {/* Theory Summary Hairline Panel */}
                    <Box sx={chapterViewStyles.panel}>
                        <Box sx={chapterViewStyles.theory}>
                            <Box>
                                <h2>Rangkuman Teori &amp; Konsep Utama</h2>
                                <p style={{ color: designTokens.text, fontWeight: 500, margin: "0 0 8px", fontSize: "15px" }}>
                                    {chapter.title}
                                </p>
                                <p style={{ color: designTokens.mute, fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                                    {chapter.summary}
                                </p>
                            </Box>
                            <Box>
                                <b style={{ color: designTokens.text, fontSize: "14px" }}>Fokus Kompetensi Praktikum:</b>
                                <ul style={{ margin: "8px 0", color: designTokens.mute, fontSize: "13.5px" }}>
                                    <li>Kategori: <b>{chapter.category}</b> (Tingkat: {chapter.difficulty})</li>
                                    <li>Estimasi Eksekusi: <b>{chapter.estimatedMinutes} Menit</b></li>
                                    <li>Runtime: <b>Pyodide WebAssembly (In-Browser Client-Side)</b></li>
                                </ul>
                                {chapter.keyFormulas && chapter.keyFormulas.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        {chapter.keyFormulas.map((fm, idx) => (
                                            <Box key={idx} sx={chapterViewStyles.fm}>
                                                <MathFormula formula={fm} />
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Dual-Variant Selector (Hairline Segmented Control) */}
                    {chapter.variants && chapter.variants.length > 0 && (
                        <Box sx={chapterViewStyles.variantBar}>
                            <Box sx={chapterViewStyles.variantHeaderRow}>
                                <Box component="span" sx={chapterViewStyles.variantLabel}>
                                    PILIHAN VARIAN IMPLEMENTASI
                                </Box>
                                <Box sx={chapterViewStyles.variantPills}>
                                    {chapter.variants.map((v, i) => (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedVariantId(v.id);
                                                setShowCsvPreview(false);
                                            }}
                                            style={chapterViewStyles.variantBtn(selectedVariantId === v.id)}
                                        >
                                            <span className="num">0{i + 1}</span>
                                            <span>{v.label}</span>
                                        </button>
                                    ))}
                                </Box>
                            </Box>
                            {activeVariant && (
                                <Box sx={chapterViewStyles.variantDesc}>
                                    {activeVariant.description}
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Dataset Info Card & Monospace CSV Preview */}
                    {activeVariant?.datasetInfo && (
                        <Box sx={chapterViewStyles.datasetCard}>
                            <Box sx={chapterViewStyles.datasetHeader}>
                                <Box>
                                    <Box component="span" sx={chapterViewStyles.variantLabel}>
                                        DATASET SHOWCASE &amp; REFERENSI
                                    </Box>
                                    <Box sx={chapterViewStyles.datasetTitle}>
                                        {activeVariant.datasetInfo.name}
                                    </Box>
                                    <Box sx={chapterViewStyles.datasetMeta}>
                                        {activeVariant.datasetInfo.totalRows} baris / {activeVariant.datasetInfo.columns.length} kolom / {activeVariant.datasetInfo.sizeKb} KB
                                    </Box>
                                </Box>
                                <Box sx={chapterViewStyles.datasetActions}>
                                    {activeVariant.datasetInfo.downloadUrl && (
                                        <a
                                            href={activeVariant.datasetInfo.downloadUrl}
                                            download
                                            style={chapterViewStyles.actionLink}
                                        >
                                            <span>Unduh CSV</span>
                                            <span>↓</span>
                                        </a>
                                    )}
                                    {activeVariant.datasetInfo.kaggleUrl && (
                                        <a
                                            href={activeVariant.datasetInfo.kaggleUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={chapterViewStyles.actionLinkAcc}
                                        >
                                            <span>Kaggle Source ↗</span>
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowCsvPreview(!showCsvPreview)}
                                        style={showCsvPreview ? chapterViewStyles.actionLinkAcc : chapterViewStyles.actionLink}
                                    >
                                        <span>{showCsvPreview ? "Tutup Tabel" : "Pratinjau Data (5 Baris)"}</span>
                                    </button>
                                </Box>
                            </Box>

                            {showCsvPreview && (
                                <Box sx={chapterViewStyles.previewTableWrapper}>
                                    <table style={chapterViewStyles.previewTable}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "36px" }}>#</th>
                                                {activeVariant.datasetInfo.columns.map((col, idx) => (
                                                    <th key={idx}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeVariant.datasetInfo.previewRows.map((row, rIdx) => (
                                                <tr key={rIdx}>
                                                    <td style={{ color: designTokens.acc }}>{rIdx + 1}</td>
                                                    {row.map((cell, cIdx) => (
                                                        <td key={cIdx}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Monaco Code Editor & Pyodide Cell */}
                    <Box sx={{ mt: 2 }}>
                        <CodeCell
                            key={`${chapter.slug}-${selectedVariantId}`}
                            initialCode={codeToRun}
                            onRun={handleRunCode}
                            isRunning={isExecuting}
                            onResetKernel={resetKernel}
                        />
                        {(lastOutput || isExecuting) && (
                            <CellOutput output={lastOutput} isRunning={isExecuting} />
                        )}
                    </Box>
                </Box>
            )}

            {/* ─── Tab Content: Visual Sandbox ───────────────────────────────── */}
            {activeTab === "sandbox" && (
                <Box sx={chapterViewStyles.panel}>
                    <h2 style={chapterViewStyles.panelTitle}>
                        Visual Twin: Feature Scaling &amp; Normalisasi
                    </h2>
                    <p style={chapterViewStyles.panelDesc}>
                        Bandingkan Min-Max dan Z-Score StandardScaler pada sebaran fitur dalam ruang dimensi kontinu Euclidean.
                    </p>

                    {/* Controls Strip */}
                    <Box sx={chapterViewStyles.ctl}>
                        <Box sx={chapterViewStyles.seg} role="group" aria-label="Metode penskalaan">
                            <button
                                type="button"
                                onClick={() => handleScaleModeChange("raw")}
                                aria-pressed={scalingMode === "raw"}
                                style={chapterViewStyles.segBtn(scalingMode === "raw")}
                            >
                                Raw
                            </button>
                            <button
                                type="button"
                                onClick={() => handleScaleModeChange("mm")}
                                aria-pressed={scalingMode === "mm"}
                                style={chapterViewStyles.segBtn(scalingMode === "mm")}
                            >
                                MinMax [0, 1]
                            </button>
                            <button
                                type="button"
                                onClick={() => handleScaleModeChange("z")}
                                aria-pressed={scalingMode === "z"}
                                style={chapterViewStyles.segBtn(scalingMode === "z")}
                            >
                                Z-Score
                            </button>
                        </Box>

                        <label
                            style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                                color: designTokens.mute,
                                fontSize: "13px",
                                fontFamily: designTokens.fontMono,
                            }}
                        >
                            <span>Pengali: {multiplier.toFixed(2)}x</span>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={multiplier}
                                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                                aria-label="Pengali fitur"
                                style={{ accentColor: designTokens.acc, width: "160px" }}
                            />
                        </label>
                    </Box>

                    {/* Interactive SVG Bar Chart */}
                    <svg
                        viewBox="0 0 600 260"
                        style={{ width: "100%", height: "auto", maxHeight: "320px", display: "block" }}
                        role="img"
                        aria-label="Diagram batang visual twin feature scaling"
                    >
                        <line
                            x1="30"
                            x2="580"
                            y1={chartData.zeroY}
                            y2={chartData.zeroY}
                            stroke="rgba(255, 255, 255, 0.12)"
                            strokeWidth="1"
                        />
                        {chartData.bars.map((bar, idx) => (
                            <g key={idx}>
                                <rect
                                    x={bar.x}
                                    y={bar.y}
                                    width="44"
                                    height={bar.height}
                                    rx="2"
                                    fill={bar.isNegative ? "#7C8696" : designTokens.acc}
                                    fillOpacity="0.85"
                                />
                                <text
                                    x={bar.x + 22}
                                    y={bar.textY}
                                    fill={designTokens.mute}
                                    fontSize="11"
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                >
                                    {bar.val}
                                </text>
                                <text
                                    x={bar.x + 22}
                                    y="248"
                                    fill={designTokens.dim}
                                    fontSize="11"
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                >
                                    {bar.label}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Stats Strip */}
                    <Box sx={chapterViewStyles.stats}>
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Nilai Minimum</span>
                            <b>{chartData.min}</b>
                        </Box>
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Nilai Maksimum</span>
                            <b>{chartData.max}</b>
                        </Box>
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Modus Skala</span>
                            <b style={{ color: designTokens.acc }}>{chartData.modeLabel}</b>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* ─── Bottom Actions (Primary White Button & Hairline Ghost Button) ── */}
            <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", mt: "36px" }}>
                <button
                    type="button"
                    onClick={handleToggleComplete}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: isDone ? `1px solid ${designTokens.line}` : "0",
                        backgroundColor: isDone ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
                        color: isDone ? designTokens.text : "#090B0E",
                        fontFamily: designTokens.fontSans,
                        fontSize: "13.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: isDone ? "none" : "0 2px 8px rgba(255, 255, 255, 0.15)",
                        transition: "all 0.2s ease",
                    }}
                >
                    {isDone ? "Tandai Belum Selesai" : "Tandai Bab Selesai (+100 XP)"}
                </button>
                <Link
                    href="/sandbox"
                    style={{
                        padding: "9px 18px",
                        borderRadius: "8px",
                        border: `1px solid ${designTokens.line}`,
                        backgroundColor: "transparent",
                        color: designTokens.text,
                        fontFamily: designTokens.fontSans,
                        fontSize: "13.5px",
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                    }}
                >
                    Buka Python Sandbox ↗
                </Link>
            </Box>

            {/* ─── Hairline Prev / Next Chapter Split Navigator ─────────────── */}
            <Box sx={chapterViewStyles.pn}>
                {prevChapter ? (
                    <Link href={`/ml-lab/${prevChapter.slug}`} style={chapterViewStyles.pnCell("left")}>
                        <span className="pn-label" style={chapterViewStyles.pnLabel}>← 01 / BAB PREV</span>
                        <span className="pn-title" style={chapterViewStyles.pnTitle}>Bab {padNumber(prevChapter.number)}: {prevChapter.title}</span>
                    </Link>
                ) : (
                    <Box sx={chapterViewStyles.pnCell("left")} />
                )}

                <Link href="/kurikulum" style={chapterViewStyles.pnCenter}>
                    <span>ARSIP KURIKULUM ↗</span>
                </Link>

                {nextChapter ? (
                    <Link href={`/ml-lab/${nextChapter.slug}`} style={chapterViewStyles.pnCell("right")}>
                        <span className="pn-label" style={chapterViewStyles.pnLabel}>02 / BAB NEXT →</span>
                        <span className="pn-title" style={chapterViewStyles.pnTitle}>Bab {padNumber(nextChapter.number)}: {nextChapter.title}</span>
                    </Link>
                ) : (
                    <Box sx={chapterViewStyles.pnCell("right")} />
                )}
            </Box>
        </Box>
    );
}
