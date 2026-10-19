"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import { ExecutionOutput } from "@/models/ml-lab/chapter.model";
import {
    ASSIGNMENT_SIMULATION_PRESETS,
    AssignmentSimulationPreset,
} from "@/consts/ml-assignment-simulations.const";
import { assignmentStyles } from "./assignment-showcase.styles";

export interface AssignmentSimulationRunnerProps {
    assignmentId: "tugas-bab-04-titanic" | "tugas-uts-pertemuan-1-6";
    initialPresetId?: string;
    onClose?: () => void;
}

export default function AssignmentSimulationRunner({
    assignmentId,
    initialPresetId,
    onClose,
}: AssignmentSimulationRunnerProps) {
    const availablePresets = ASSIGNMENT_SIMULATION_PRESETS.filter(
        (p) => p.assignmentId === assignmentId
    );

    const defaultPreset =
        availablePresets.find((p) => p.id === initialPresetId) ||
        availablePresets[0];

    const [selectedPreset, setSelectedPreset] =
        useState<AssignmentSimulationPreset>(defaultPreset);
    const [code, setCode] = useState<string>(defaultPreset?.code || "");
    const [activeTab, setActiveTab] = useState<"terminal" | "plot" | "code">(
        "terminal"
    );
    const [output, setOutput] = useState<ExecutionOutput | null>(null);
    const [copied, setCopied] = useState(false);

    const {
        status,
        statusMessage,
        isExecuting,
        runCode,
        resetKernel,
    } = usePyodideKernel();

    // Sync when initialPresetId changes from external trigger
    useEffect(() => {
        if (initialPresetId) {
            const found = availablePresets.find((p) => p.id === initialPresetId);
            if (found) {
                setSelectedPreset(found);
                setCode(found.code);
                setOutput(null);
            }
        }
    }, [initialPresetId]);

    const handleSelectPreset = (preset: AssignmentSimulationPreset) => {
        setSelectedPreset(preset);
        setCode(preset.code);
        setOutput(null);
    };

    const handleRunSimulation = async () => {
        if (isExecuting) return;
        setActiveTab("terminal");
        try {
            const result = await runCode(code);
            setOutput(result);
            if (result.plots && result.plots.length > 0) {
                // If plot generated, user can see it in plot tab
            }
        } catch (err) {
            console.error("Simulation run error:", err);
        }
    };

    const handleCopyOutput = () => {
        if (!output?.stdout) return;
        navigator.clipboard.writeText(output.stdout);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleExportPlot = (plotSrc: string, idx: number) => {
        const link = document.createElement("a");
        link.href = plotSrc;
        link.download = `simulation_plot_${selectedPreset.id}_${idx + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasPlots = !!output && output.plots && output.plots.length > 0;

    return (
        <Box sx={assignmentStyles.simRunnerContainer}>
            {/* ─── Header ────────────────────────────────────────────── */}
            <Box sx={assignmentStyles.simHeader}>
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "6px" }}>
                        <Box component="span" sx={assignmentStyles.simBadge}>
                            ⚡ Interactive WASM Simulator
                        </Box>
                        <Box
                            component="span"
                            sx={{
                                px: "6px",
                                py: "2px",
                                borderRadius: "4px",
                                bgcolor: "rgba(67, 217, 163, 0.12)",
                                color: "#43D9A3",
                                fontSize: "0.70rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono), monospace",
                            }}
                        >
                            {selectedPreset.badge}
                        </Box>
                    </Box>
                    <Typography component="h3" sx={assignmentStyles.simTitle}>
                        {selectedPreset.title}
                    </Typography>
                    <Typography sx={assignmentStyles.simDesc}>
                        {selectedPreset.description}
                    </Typography>
                </Box>

                {onClose && (
                    <Button
                        size="small"
                        onClick={onClose}
                        sx={{
                            color: "#8E99A8",
                            fontSize: "0.75rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": { color: "#F5F7FA" },
                        }}
                    >
                        ✕ Tutup Simulator
                    </Button>
                )}
            </Box>

            {/* ─── Preset Switcher (if multiple available) ────────────── */}
            {availablePresets.length > 1 && (
                <Box sx={assignmentStyles.simPresetRow}>
                    <Typography sx={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 650, mr: "4px" }}>
                        Pilih Studi Kasus:
                    </Typography>
                    {availablePresets.map((preset) => (
                        <Box
                            key={preset.id}
                            component="button"
                            onClick={() => handleSelectPreset(preset)}
                            sx={assignmentStyles.simPresetBtn(selectedPreset.id === preset.id)}
                        >
                            {preset.badge}
                        </Box>
                    ))}
                </Box>
            )}

            {/* ─── Controls Bar ──────────────────────────────────────── */}
            <Box sx={assignmentStyles.simControlsBar}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <Box
                        component="button"
                        onClick={handleRunSimulation}
                        disabled={isExecuting}
                        sx={assignmentStyles.simRunBtn(isExecuting)}
                    >
                        {isExecuting ? (
                            <>
                                <CircularProgress size={14} sx={{ color: "#FFFFFF" }} />
                                <span>Menjalankan Engine...</span>
                            </>
                        ) : (
                            <>
                                <span>▶</span>
                                <span>Jalankan Simulasi (WASM)</span>
                            </>
                        )}
                    </Box>

                    <Box
                        component="button"
                        onClick={() => resetKernel()}
                        sx={assignmentStyles.simSecondaryBtn}
                        title="Reset runtime Pyodide kernel"
                    >
                        <span>↺</span>
                        <span>Reset Kernel</span>
                    </Box>
                </Box>

                {/* Status Indicator */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {output && (
                        <Typography
                            sx={{
                                fontSize: "0.74rem",
                                color: output.status === "success" ? "#43D9A3" : "#FF5C5C",
                                fontFamily: "var(--font-mono), monospace",
                                fontWeight: 600,
                            }}
                        >
                            {output.status === "success"
                                ? `✓ Selesai (${(output.executionTime / 1000).toFixed(2)}s)`
                                : "✕ Terjadi Kesalahan"}
                        </Typography>
                    )}

                    <Box sx={assignmentStyles.simStatusIndicator(status)}>
                        <Box
                            component="span"
                            sx={{
                                width: "7px",
                                height: "7px",
                                borderRadius: "50%",
                                bgcolor:
                                    status === "ready"
                                        ? "#43D9A3"
                                        : status === "executing"
                                        ? "#67D9FF"
                                        : status === "error"
                                        ? "#FF5C5C"
                                        : "#64748B",
                                animation: isExecuting ? "pulse 1.2s infinite" : "none",
                            }}
                        />
                        <span>{statusMessage || "Engine Siap"}</span>
                    </Box>
                </Box>
            </Box>

            {/* ─── Tabs Bar ─────────────────────────────────────────── */}
            <Box sx={assignmentStyles.simTabBar}>
                <Box
                    component="button"
                    onClick={() => setActiveTab("terminal")}
                    sx={assignmentStyles.simTabItem(activeTab === "terminal")}
                >
                    <span>$</span>
                    <span>Terminal Output</span>
                </Box>

                <Box
                    component="button"
                    onClick={() => setActiveTab("plot")}
                    sx={assignmentStyles.simTabItem(activeTab === "plot")}
                >
                    <span>📊</span>
                    <span>Visual Plot {hasPlots ? `(${output?.plots.length})` : ""}</span>
                </Box>

                <Box
                    component="button"
                    onClick={() => setActiveTab("code")}
                    sx={assignmentStyles.simTabItem(activeTab === "code")}
                >
                    <span>&lt;/&gt;</span>
                    <span>Source Code Python</span>
                </Box>

                {output?.stdout && activeTab === "terminal" && (
                    <Box sx={{ ml: "auto" }}>
                        <Button
                            size="small"
                            onClick={handleCopyOutput}
                            sx={{
                                color: copied ? "#43D9A3" : "#8E99A8",
                                fontSize: "0.72rem",
                                textTransform: "none",
                                fontFamily: "var(--font-mono), monospace",
                            }}
                        >
                            {copied ? "✓ Tersalin" : "Salin Output"}
                        </Button>
                    </Box>
                )}
            </Box>

            {/* ─── Tab Content ──────────────────────────────────────── */}
            {activeTab === "terminal" && (
                <Box sx={assignmentStyles.simTerminal}>
                    {isExecuting ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", py: "20px" }}>
                            <CircularProgress size={18} sx={{ color: "#67D9FF" }} />
                            <Typography sx={{ fontSize: "0.80rem", color: "#67D9FF", fontFamily: "var(--font-mono), monospace" }}>
                                Menjalankan komputasi numerik Python di WebAssembly...
                            </Typography>
                        </Box>
                    ) : output ? (
                        <>
                            {output.stdout && (
                                <Box component="pre" sx={{ m: 0, fontFamily: "inherit" }}>
                                    {output.stdout}
                                </Box>
                            )}
                            {output.stderr && (
                                <Box
                                    component="pre"
                                    sx={{
                                        m: 0,
                                        mt: output.stdout ? "12px" : 0,
                                        color: "#FF5C5C",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    {output.stderr}
                                </Box>
                            )}
                        </>
                    ) : (
                        <Box sx={{ py: "24px", textAlign: "center", color: "#64748B" }}>
                            <Typography sx={{ fontSize: "0.82rem", fontFamily: "var(--font-mono), monospace" }}>
                                Klik &quot;▶ Jalankan Simulasi (WASM)&quot; untuk mengeksekusi kode Python dan melihat output numerik real-time.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {activeTab === "plot" && (
                <Box sx={assignmentStyles.simPlotCard}>
                    {hasPlots ? (
                        <Box>
                            {output?.plots.map((plotSrc, idx) => (
                                <Box key={idx} sx={{ mb: idx === output.plots.length - 1 ? 0 : "16px" }}>
                                    <Box
                                        component="img"
                                        src={plotSrc}
                                        alt={`Plot Simulasi ${idx + 1}`}
                                        sx={{
                                            maxWidth: "100%",
                                            height: "auto",
                                            borderRadius: "6px",
                                            border: "1px solid rgba(255, 255, 255, 0.10)",
                                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                                        }}
                                    />
                                    <Box sx={{ mt: "10px", display: "flex", justifyContent: "center" }}>
                                        <Button
                                            size="small"
                                            onClick={() => handleExportPlot(plotSrc, idx)}
                                            sx={{
                                                bgcolor: "rgba(103, 217, 255, 0.12)",
                                                color: "#67D9FF",
                                                border: "1px solid rgba(103, 217, 255, 0.25)",
                                                fontSize: "0.72rem",
                                                textTransform: "none",
                                                fontFamily: "var(--font-mono), monospace",
                                                "&:hover": {
                                                    bgcolor: "rgba(103, 217, 255, 0.20)",
                                                },
                                            }}
                                        >
                                            ⬇ Unduh Gambar Plot (PNG)
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ py: "32px", color: "#64748B" }}>
                            <Typography sx={{ fontSize: "0.82rem", fontFamily: "var(--font-mono), monospace" }}>
                                Belum ada plot visual yang dihasilkan. Jalankan simulasi untuk me-render grafik Matplotlib.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {activeTab === "code" && (
                <Box
                    component="pre"
                    sx={{
                        p: "14px",
                        borderRadius: "8px",
                        bgcolor: "#070A0E",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.78rem",
                        color: "#CBD5E1",
                        lineHeight: 1.5,
                        maxHeight: "360px",
                        overflowY: "auto",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                    }}
                >
                    <code>{code}</code>
                </Box>
            )}
        </Box>
    );
}
