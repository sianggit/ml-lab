"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconComponent from "@/shared/components/icon";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import { ExecutionOutput } from "@/models/ml-lab/chapter.model";

export interface AssignmentNotebookCellProps {
    cellNumber?: number | string;
    title: string;
    code: string;
    description?: string;
    maxCodeHeight?: string;
    onReset?: () => void;
}

export default function AssignmentNotebookCell({
    cellNumber = 1,
    title,
    code: initialCode,
    description,
    maxCodeHeight = "360px",
    onReset,
}: AssignmentNotebookCellProps) {
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<ExecutionOutput | null>(null);
    const [activeTab, setActiveTab] = useState<"terminal" | "plot">("terminal");
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);
    const [executionCount, setExecutionCount] = useState<number | null>(null);

    const { status, isExecuting, runCode, resetKernel } = usePyodideKernel();

    const handleRun = async () => {
        if (isExecuting) return;
        try {
            const res = await runCode(code);
            setOutput(res);
            setExecutionCount((prev) => (prev ? prev + 1 : 1));
            if (res.plots && res.plots.length > 0) {
                setActiveTab("plot");
            } else {
                setActiveTab("terminal");
            }
        } catch (err) {
            console.error("Cell execution error:", err);
        }
    };

    const handleReset = async () => {
        setOutput(null);
        setCode(initialCode);
        setExecutionCount(null);
        if (onReset) onReset();
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const handleCopyOutput = () => {
        if (!output?.stdout) return;
        navigator.clipboard.writeText(output.stdout);
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
    };

    const handleDownloadPlot = (src: string, index = 0) => {
        const a = document.createElement("a");
        a.href = src;
        a.download = `${title.replace(/[^a-zA-Z0-9_-]/g, "_")}_plot_${index + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const hasPlots = !!output?.plots && output.plots.length > 0;
    const lines = code.trim().split("\n");

    const renderPromptTag = () => {
        if (isExecuting) {
            return (
                <Box
                    component="span"
                    sx={{
                        color: "#67D9FF",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.80rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    In [*]:
                </Box>
            );
        }
        if (executionCount !== null) {
            return (
                <Box
                    component="span"
                    sx={{
                        color: "#43D9A3",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.80rem",
                    }}
                >
                    In [{executionCount}]:
                </Box>
            );
        }
        return (
            <Box
                component="span"
                sx={{
                    color: "#64748B",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.80rem",
                }}
            >
                In [ ]:
            </Box>
        );
    };

    return (
        <Box
            sx={{
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                bgcolor: "#0B0F15",
                overflow: "hidden",
                mb: "20px",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
            }}
        >
            {/* ─── Cell Header Toolbar ─────────────────────────────────── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    px: "14px",
                    py: "8px",
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                }}
            >
                {/* Left: Prompt & Title & Badge */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    {renderPromptTag()}

                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IconComponent name="code" size={13} color="#67D9FF" />
                        <Typography
                            sx={{
                                fontSize: "0.78rem",
                                fontWeight: 650,
                                color: "#E2E8F0",
                                fontFamily: "var(--font-mono), monospace",
                            }}
                        >
                            {title}
                        </Typography>
                    </Box>

                    <Box
                        component="span"
                        sx={{
                            px: "6px",
                            py: "1px",
                            borderRadius: "4px",
                            bgcolor: "rgba(103, 217, 255, 0.10)",
                            color: "#67D9FF",
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            fontFamily: "var(--font-mono), monospace",
                            border: "1px solid rgba(103, 217, 255, 0.20)",
                        }}
                    >
                        Python 3.12 (Pyodide WASM)
                    </Box>
                </Box>

                {/* Right: Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Button
                        size="small"
                        onClick={handleRun}
                        disabled={isExecuting}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            px: "10px",
                            py: "3px",
                            borderRadius: "5px",
                            bgcolor: isExecuting ? "rgba(103, 217, 255, 0.10)" : "rgba(67, 217, 163, 0.15)",
                            color: isExecuting ? "#67D9FF" : "#43D9A3",
                            border: isExecuting ? "1px solid rgba(103, 217, 255, 0.30)" : "1px solid rgba(67, 217, 163, 0.35)",
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            cursor: isExecuting ? "not-allowed" : "pointer",
                            "&:hover": {
                                bgcolor: isExecuting ? "rgba(103, 217, 255, 0.10)" : "rgba(67, 217, 163, 0.25)",
                            },
                        }}
                    >
                        {isExecuting ? (
                            <>
                                <CircularProgress size={11} sx={{ color: "#67D9FF" }} />
                                <span>Menjalankan...</span>
                            </>
                        ) : (
                            <>
                                <IconComponent name="play" size={11} color="#43D9A3" />
                                <span>{executionCount !== null ? "Re-run Cell" : "Run Cell"}</span>
                            </>
                        )}
                    </Button>

                    <Button
                        size="small"
                        onClick={handleReset}
                        disabled={isExecuting || (!output && executionCount === null)}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            px: "8px",
                            py: "3px",
                            borderRadius: "5px",
                            bgcolor: "rgba(255, 255, 255, 0.03)",
                            color: "#94A3B8",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            fontSize: "0.72rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.08)",
                                color: "#E2E8F0",
                            },
                            "&:disabled": {
                                opacity: 0.4,
                                cursor: "not-allowed",
                            },
                        }}
                    >
                        <IconComponent name="rotate-ccw" size={11} />
                        <span>Reset</span>
                    </Button>

                    <Button
                        size="small"
                        onClick={handleCopyCode}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            px: "8px",
                            py: "3px",
                            borderRadius: "5px",
                            bgcolor: "rgba(255, 255, 255, 0.03)",
                            color: copiedCode ? "#43D9A3" : "#94A3B8",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            fontSize: "0.72rem",
                            textTransform: "none",
                            fontFamily: "var(--font-mono), monospace",
                            "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.08)",
                                color: "#E2E8F0",
                            },
                        }}
                    >
                        {copiedCode ? <IconComponent name="check" size={11} color="#43D9A3" /> : null}
                        <span>{copiedCode ? "Tersalin" : "Salin Kode"}</span>
                    </Button>
                </Box>
            </Box>

            {/* Optional Description */}
            {description && (
                <Box
                    sx={{
                        px: "14px",
                        py: "6px",
                        bgcolor: "rgba(103, 217, 255, 0.03)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                >
                    <Typography sx={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.45 }}>
                        {description}
                    </Typography>
                </Box>
            )}

            {/* ─── Code Body (Monospace Cell with Line Numbers) ────────── */}
            <Box
                sx={{
                    display: "flex",
                    bgcolor: "#070A0F",
                    maxHeight: maxCodeHeight,
                    overflowY: "auto",
                    overflowX: "auto",
                }}
            >
                {/* Line Numbers Column */}
                <Box
                    sx={{
                        userSelect: "none",
                        px: "10px",
                        py: "14px",
                        bgcolor: "rgba(0, 0, 0, 0.25)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.75rem",
                        lineHeight: 1.5,
                        color: "#475569",
                        textAlign: "right",
                        minWidth: "36px",
                    }}
                >
                    {lines.map((_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </Box>

                {/* Code Text Content */}
                <Box
                    component="pre"
                    sx={{
                        m: 0,
                        p: "14px 16px",
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "0.76rem",
                        lineHeight: 1.5,
                        color: "#CBD5E1",
                        overflowX: "auto",
                        flex: 1,
                    }}
                >
                    <code>{code}</code>
                </Box>
            </Box>

            {/* ─── Output Section (Out [n]: Directly Inline) ───────────── */}
            {output ? (
                <Box
                    sx={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        bgcolor: "#080B10",
                    }}
                >
                    {/* Output Header Bar */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "8px",
                            px: "14px",
                            py: "6px",
                            bgcolor: "rgba(0, 0, 0, 0.35)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Box
                                component="span"
                                sx={{
                                    color: output.status === "success" ? "#43D9A3" : "#FF5C5C",
                                    fontWeight: 700,
                                    fontFamily: "var(--font-mono), monospace",
                                    fontSize: "0.78rem",
                                }}
                            >
                                Out [{executionCount || 1}]:
                            </Box>

                            <Box
                                component="span"
                                sx={{
                                    px: "6px",
                                    py: "1px",
                                    borderRadius: "4px",
                                    fontSize: "0.68rem",
                                    fontWeight: 650,
                                    fontFamily: "var(--font-mono), monospace",
                                    bgcolor: output.status === "success" ? "rgba(67, 217, 163, 0.12)" : "rgba(255, 92, 92, 0.12)",
                                    color: output.status === "success" ? "#43D9A3" : "#FF5C5C",
                                    border: output.status === "success" ? "1px solid rgba(67, 217, 163, 0.25)" : "1px solid rgba(255, 92, 92, 0.25)",
                                }}
                            >
                                {output.status === "success"
                                    ? `Selesai (${(output.executionTime / 1000).toFixed(2)}s)`
                                    : "Terjadi Kesalahan"}
                            </Box>

                            {/* Tabs if plots exist */}
                            {hasPlots && (
                                <Box sx={{ display: "flex", gap: "4px", ml: "6px" }}>
                                    <Button
                                        size="small"
                                        onClick={() => setActiveTab("plot")}
                                        sx={{
                                            px: "8px",
                                            py: "2px",
                                            borderRadius: "4px",
                                            fontSize: "0.70rem",
                                            fontWeight: 650,
                                            fontFamily: "var(--font-mono), monospace",
                                            textTransform: "none",
                                            bgcolor: activeTab === "plot" ? "rgba(103, 217, 255, 0.16)" : "transparent",
                                            color: activeTab === "plot" ? "#67D9FF" : "#94A3B8",
                                            border: activeTab === "plot" ? "1px solid rgba(103, 217, 255, 0.30)" : "1px solid transparent",
                                        }}
                                    >
                                        Plot Visualisasi ({output.plots!.length})
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => setActiveTab("terminal")}
                                        sx={{
                                            px: "8px",
                                            py: "2px",
                                            borderRadius: "4px",
                                            fontSize: "0.70rem",
                                            fontWeight: 650,
                                            fontFamily: "var(--font-mono), monospace",
                                            textTransform: "none",
                                            bgcolor: activeTab === "terminal" ? "rgba(103, 217, 255, 0.16)" : "transparent",
                                            color: activeTab === "terminal" ? "#67D9FF" : "#94A3B8",
                                            border: activeTab === "terminal" ? "1px solid rgba(103, 217, 255, 0.30)" : "1px solid transparent",
                                        }}
                                    >
                                        Terminal Stdout
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {activeTab === "terminal" && output.stdout && (
                                <Button
                                    size="small"
                                    onClick={handleCopyOutput}
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        px: "7px",
                                        py: "2px",
                                        borderRadius: "4px",
                                        bgcolor: "rgba(255, 255, 255, 0.03)",
                                        color: copiedOutput ? "#43D9A3" : "#8E99A8",
                                        border: "1px solid rgba(255, 255, 255, 0.06)",
                                        fontSize: "0.70rem",
                                        textTransform: "none",
                                        fontFamily: "var(--font-mono), monospace",
                                    }}
                                >
                                    {copiedOutput ? <IconComponent name="check" size={10} color="#43D9A3" /> : null}
                                    <span>{copiedOutput ? "Tersalin" : "Salin Output"}</span>
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Output Body */}
                    {activeTab === "plot" && hasPlots ? (
                        <Box sx={{ p: "16px", textAlign: "center", bgcolor: "#06090D" }}>
                            {output.plots!.map((plotSrc, idx) => (
                                <Box key={idx} sx={{ mb: idx === output.plots!.length - 1 ? 0 : "16px" }}>
                                    <Box
                                        component="img"
                                        src={plotSrc}
                                        alt={`Plot Output ${idx + 1}`}
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: "440px",
                                            borderRadius: "6px",
                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                                        }}
                                    />
                                    <Box sx={{ mt: "10px", display: "flex", justifyContent: "center" }}>
                                        <Button
                                            size="small"
                                            onClick={() => handleDownloadPlot(plotSrc, idx)}
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                px: "10px",
                                                py: "4px",
                                                borderRadius: "5px",
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
                                            <IconComponent name="download" size={12} />
                                            <span>Unduh Gambar Plot (PNG)</span>
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            component="pre"
                            sx={{
                                m: 0,
                                p: "14px 16px",
                                fontFamily: "var(--font-mono), monospace",
                                fontSize: "0.78rem",
                                lineHeight: 1.55,
                                color: output.status === "error" ? "#FF8080" : "#E2E8F0",
                                bgcolor: "#05070B",
                                maxHeight: "320px",
                                overflowY: "auto",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {output.status === "error"
                                ? output.stderr || output.errorDetails || "Terjadi kesalahan saat mengeksekusi skrip Python."
                                : output.stdout || "(Skrip selesai dieksekusi tanpa keluaran teks stdout)"}
                        </Box>
                    )}
                </Box>
            ) : (
                /* Sleek Initial Prompt Strip */
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: "14px",
                        py: "8px",
                        bgcolor: "rgba(0, 0, 0, 0.25)",
                        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Box
                            component="span"
                            sx={{
                                color: "#475569",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono), monospace",
                                fontSize: "0.78rem",
                            }}
                        >
                            Out [ ]:
                        </Box>
                        <Typography sx={{ fontSize: "0.74rem", color: "#64748B", fontFamily: "var(--font-mono), monospace" }}>
                            Klik &quot;Run Cell&quot; di atas untuk mengeksekusi komputasi Python secara langsung via WASM engine.
                        </Typography>
                    </Box>

                    <Button
                        size="small"
                        onClick={handleRun}
                        disabled={isExecuting}
                        sx={{
                            color: "#67D9FF",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-mono), monospace",
                            textTransform: "none",
                            px: "8px",
                            py: "1px",
                            "&:hover": { bgcolor: "rgba(103, 217, 255, 0.08)" },
                        }}
                    >
                        Jalankan Sekarang
                    </Button>
                </Box>
            )}
        </Box>
    );
}
