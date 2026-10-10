"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Chapter } from "@/models/ml-lab/chapter.model";
import { getChapterByNumber } from "@/consts/ml-chapters.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import CodeCell from "@/components/features/ml-lab/code-cell";
import CellOutput from "@/components/features/ml-lab/cell-output";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import IconComponent from "@/shared/components/icon";
import MathFormula from "@/shared/components/math-formula";
import { chapterViewStyles } from "./chapter-view.styles";

export interface ChapterViewProps {
    chapter: Chapter;
}

const SAMPLE_FEATURE_DATA = [15, 32, 60, 110, 220, 480];

export default function ChapterView({ chapter }: ChapterViewProps) {
    const [activeTab, setActiveTab] = useState<"sandbox" | "notebook">("sandbox");
    const [scalingMode, setScalingMode] = useState<"raw" | "mm" | "z">("raw");
    const [multiplier, setMultiplier] = useState<number>(1.5);

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
    const initialCode = savedProgress?.executedCode || chapter.initialCode;

    const padNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    // Mastery calculation
    const masteryPercent = savedProgress?.masteryPercent || (isDone ? 100 : 25);
    const tasksDone = Math.max(1, Math.round((masteryPercent / 100) * 4));

    // SVG Ring circumference: 2 * PI * 15 = 94.2
    const ringDash = ((tasksDone * 25) / 100) * 94.2;

    const prevChapter = getChapterByNumber(chapter.number - 1);
    const nextChapter = getChapterByNumber(chapter.number + 1);

    const handleToggleComplete = () => {
        const nextState = toggleChapterCompleted(chapter.slug, 100);
        if (nextState) {
            import("canvas-confetti").then(({ default: confetti }) => {
                confetti({
                    particleCount: 100,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ["#43D9A3", "#67D9FF", "#F5B84B", "#F5F7FA"],
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
        <Box sx={chapterViewStyles.wrap} className="wrap">
            {/* ─── Chapter Head ──────────────────────────────────────────────── */}
            <Box sx={chapterViewStyles.head} className="head">
                <Box>
                    <Box sx={chapterViewStyles.chipGroup}>
                        <Box component="span" sx={chapterViewStyles.chip} className="chip">
                            BAB {padNumber(chapter.number)}
                        </Box>
                        <Box component="span" sx={chapterViewStyles.chip} className="chip">
                            {chapter.category}
                        </Box>
                        <Box component="span" sx={chapterViewStyles.chip} className="chip">
                            {chapter.estimatedMinutes} menit
                        </Box>
                    </Box>

                    <Box component="h1" sx={chapterViewStyles.title}>
                        {chapter.title}
                    </Box>

                    <Box component="p" sx={chapterViewStyles.lead} className="lead">
                        {chapter.summary}
                    </Box>
                </Box>

                {/* Circular Mastery Ring */}
                <Box sx={chapterViewStyles.ring} className="ring">
                    <svg viewBox="0 0 36 36" aria-hidden="true" style={{ width: 46, height: 46 }}>
                        <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#171D24"
                            strokeWidth="4"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="15"
                            fill="none"
                            stroke="#43D9A3"
                            strokeWidth="4"
                            strokeDasharray={`${ringDash.toFixed(1)} 94.2`}
                            transform="rotate(-90 18 18)"
                            style={{ transition: "stroke-dasharray 0.4s ease" }}
                        />
                    </svg>
                    <Box>
                        <Box component="b">Penguasaan {tasksDone * 25}%</Box>
                        <Box component="small">{tasksDone}/4 tugas</Box>
                    </Box>
                </Box>
            </Box>

            {/* ─── Tabs ──────────────────────────────────────────────────────── */}
            <Box sx={chapterViewStyles.tabs} className="tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "sandbox"}
                    onClick={() => setActiveTab("sandbox")}
                    style={chapterViewStyles.tabButton(activeTab === "sandbox")}
                >
                    Visual sandbox
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "notebook"}
                    onClick={() => setActiveTab("notebook")}
                    style={chapterViewStyles.tabButton(activeTab === "notebook")}
                >
                    Notebook &amp; Python
                </button>
            </Box>

            {/* ─── Tab Content ────────────────────────────────────────────────── */}
            {activeTab === "sandbox" && (
                <Box sx={chapterViewStyles.panel} className="panel">
                    <h2 style={{ fontSize: "1.35rem", margin: "0 0 6px", color: "#F5F7FA" }}>
                        Visual twin: feature scaling
                    </h2>
                    <p style={{ color: "#A3ADB9", margin: "0 0 16px", fontSize: "0.95rem" }}>
                        Bandingkan Min-Max dan Standard Scaler pada sebaran fitur dalam ruang Euclidean.
                    </p>

                    {/* Controls Strip */}
                    <Box sx={chapterViewStyles.ctl} className="ctl">
                        <Box sx={chapterViewStyles.seg} className="seg" role="group" aria-label="Metode penskalaan">
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
                                color: "#A3ADB9",
                                fontSize: "0.85rem",
                            }}
                        >
                            <span>Pengali fitur</span>
                            <span style={chapterViewStyles.k2} className="k2">
                                {multiplier.toFixed(2)}x
                            </span>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.1"
                                value={multiplier}
                                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                                aria-label="Pengali fitur"
                                style={{ accentColor: "#43D9A3", width: "min(320px, 100%)" }}
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
                            stroke="rgba(255, 255, 255, 0.18)"
                            strokeWidth="1"
                        />
                        {chartData.bars.map((bar, idx) => (
                            <g key={idx}>
                                <rect
                                    x={bar.x}
                                    y={bar.y}
                                    width="44"
                                    height={bar.height}
                                    rx="3"
                                    fill={bar.isNegative ? "#F5B84B" : "#67D9FF"}
                                    fillOpacity="0.85"
                                />
                                <text
                                    x={bar.x + 22}
                                    y={bar.textY}
                                    fill="#A3ADB9"
                                    fontSize="12"
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                >
                                    {bar.val}
                                </text>
                                <text
                                    x={bar.x + 22}
                                    y="248"
                                    fill="#8592A1"
                                    fontSize="12"
                                    textAnchor="middle"
                                    fontFamily="monospace"
                                >
                                    {bar.label}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Stats Strip */}
                    <Box sx={chapterViewStyles.stats} className="stats">
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Min</span>
                            <b>{chartData.min}</b>
                        </Box>
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Maks</span>
                            <b>{chartData.max}</b>
                        </Box>
                        <Box sx={chapterViewStyles.statCard}>
                            <span>Mode</span>
                            <b style={{ color: "#67D9FF" }}>{chartData.modeLabel}</b>
                        </Box>
                    </Box>
                </Box>
            )}

            {activeTab === "notebook" && (
                <Box>
                    {/* Theory Panel */}
                    <Box sx={chapterViewStyles.panel} className="panel">
                        <Box sx={chapterViewStyles.theory} className="theory">
                            <Box>
                                <h2>Rangkuman teori</h2>
                                <b>Ekosistem Python &amp; Scikit-Learn:</b>
                                <ul>
                                    <li><b>NumPy</b>: Komputasi matriks array N-dimensi.</li>
                                    <li><b>Pandas</b>: Struktur data DataFrame tabular.</li>
                                    <li><b>Matplotlib &amp; Seaborn</b>: Visualisasi analitik data.</li>
                                    <li><b>Scikit-Learn</b>: Toolkit algoritma pembelajaran mesin standar industri.</li>
                                </ul>
                            </Box>
                            <Box>
                                <b>Siklus Supervised Learning:</b>
                                <ol>
                                    <li>Muat dataset benchmark (Iris, N = 150).</li>
                                    <li>Bagi partisi data latih 80% dan uji 20%.</li>
                                    <li>Latih estimator K-Nearest Neighbors (k = 3).</li>
                                    <li>Prediksi dan ukur metrik evaluasi akurasi.</li>
                                </ol>
                                {chapter.keyFormulas && chapter.keyFormulas.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        {chapter.keyFormulas.map((fm, idx) => (
                                            <Box key={idx} sx={chapterViewStyles.fm} className="fm">
                                                <MathFormula formula={fm} />
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Code Execution Cell */}
                    <Box sx={{ mt: 3 }}>
                        <CodeCell
                            initialCode={initialCode}
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

            {/* ─── Actions Strip ──────────────────────────────────────────────── */}
            <Box sx={chapterViewStyles.acts} className="acts">
                <Button
                    onClick={handleToggleComplete}
                    sx={{
                        ...chapterViewStyles.btn,
                        ...(isDone ? {} : chapterViewStyles.btnGreen),
                    }}
                    className={`btn ${isDone ? "" : "btn-g"}`}
                >
                    {isDone ? (
                        <>
                            <IconComponent name="check" size={16} />
                            <span>Batalkan Selesai</span>
                        </>
                    ) : (
                        <span>Tandai Bab Selesai (+100 XP)</span>
                    )}
                </Button>
                <Button
                    component={Link}
                    href="/sandbox"
                    sx={chapterViewStyles.btn}
                    className="btn"
                >
                    Buka Sandbox
                </Button>
            </Box>

            {/* ─── Bottom Previous / Next Chapter Navigation ──────────────────── */}
            <Box sx={chapterViewStyles.pn} className="pn">
                {prevChapter ? (
                    <Button
                        component={Link}
                        href={`/ml-lab/${prevChapter.slug}`}
                        sx={chapterViewStyles.btn}
                        className="btn"
                    >
                        <IconComponent name="arrow-left" size={15} />
                        <span>Bab {padNumber(prevChapter.number)}: {prevChapter.title.slice(0, 24)}…</span>
                    </Button>
                ) : (
                    <span />
                )}

                {nextChapter && (
                    <Button
                        component={Link}
                        href={`/ml-lab/${nextChapter.slug}`}
                        sx={chapterViewStyles.btn}
                        className="btn"
                    >
                        <span>Bab {padNumber(nextChapter.number)}: {nextChapter.title.slice(0, 28)}…</span>
                        <IconComponent name="arrow-right" size={15} />
                    </Button>
                )}
            </Box>
        </Box>
    );
}
