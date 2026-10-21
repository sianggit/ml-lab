"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import IconComponent from "@/shared/components/icon";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { ExecutionOutput } from "@/models/ml-lab/chapter.model";
import { designTokens } from "@/config/theme";

// Dynamically import Monaco Editor to avoid SSR hydration mismatches
const Editor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => null,
});

export interface AssignmentNotebookCellProps {
    cellNumber?: number | string;
    title: string;
    code: string;
    description?: string;
    maxCodeHeight?: string;
    onReset?: () => void;
}

type OutputViewMode = "stacked" | "plot" | "terminal";

export default function AssignmentNotebookCell({
    title,
    code: initialCode,
    description,
    maxCodeHeight = "380px",
    onReset,
}: AssignmentNotebookCellProps) {
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<ExecutionOutput | null>(null);
    const [outputView, setOutputView] = useState<OutputViewMode>("stacked");
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);
    const [executionCount, setExecutionCount] = useState<number | null>(null);
    const [zoomPlotSrc, setZoomPlotSrc] = useState<string | null>(null);
    const [isEditorMounted, setIsEditorMounted] = useState(false);

    useEffect(() => {
        setCode(initialCode);
        setOutput(null);
        setOutputView("stacked");
    }, [initialCode]);

    useEffect(() => {
        setIsEditorMounted(true);
    }, []);

    const { themeMode } = useMlLabStore();
    const { isExecuting, runCode } = usePyodideKernel();

    const handleRun = async () => {
        if (isExecuting) return;
        try {
            const res = await runCode(code);
            setOutput(res);
            setExecutionCount((prev) => (prev ? prev + 1 : 1));
            if (res.plots && res.plots.length > 0) {
                setOutputView("stacked");
            } else {
                setOutputView("terminal");
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
    const lines = useMemo(() => code.trim().split("\n"), [code]);
    const calculatedEditorHeight = useMemo(() => {
        const lineCount = lines.length;
        const target = Math.min(Math.max(lineCount * 21 + 24, 220), 400);
        return `${target}px`;
    }, [lines]);

    const renderPromptTag = () => {
        if (isExecuting) {
            return (
                <Box
                    component="span"
                    sx={{
                        color: designTokens.acc,
                        fontWeight: 600,
                        fontFamily: designTokens.fontMono,
                        fontSize: "12px",
                        letterSpacing: "0.06em",
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
                        color: designTokens.acc,
                        fontWeight: 600,
                        fontFamily: designTokens.fontMono,
                        fontSize: "12px",
                        letterSpacing: "0.06em",
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
                    color: designTokens.dim,
                    fontWeight: 500,
                    fontFamily: designTokens.fontMono,
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                }}
            >
                In [ ]:
            </Box>
        );
    };

    // Render formatted stdout text with distinct semantic colors for ML outputs
    const renderFormattedStdout = (rawText: string) => {
        const textLines = rawText.split("\n");
        return textLines.map((line, idx) => {
            if (!line.trim()) {
                return <div key={idx} style={{ height: "8px" }} />;
            }
            if (line.startsWith("===") || line.startsWith("---")) {
                return (
                    <Box
                        key={idx}
                        sx={{
                            color: designTokens.dim,
                            py: "2px",
                            fontFamily: designTokens.fontMono,
                            fontSize: "11px",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {line}
                    </Box>
                );
            }
            if (line.includes("[OK]") || line.includes("[Selesai]")) {
                return (
                    <Box
                        key={idx}
                        sx={{
                            color: designTokens.acc,
                            fontWeight: 600,
                            my: "2px",
                            fontFamily: designTokens.fontMono,
                        }}
                    >
                        {line}
                    </Box>
                );
            }
            if (line.startsWith("[") && line.endsWith("]")) {
                return (
                    <Box
                        key={idx}
                        sx={{
                            color: "#FFFFFF",
                            fontWeight: 600,
                            mt: "6px",
                            mb: "3px",
                            fontFamily: designTokens.fontMono,
                        }}
                    >
                        {line}
                    </Box>
                );
            }
            return (
                <div key={idx} style={{ minHeight: "18px" }}>
                    {line}
                </div>
            );
        });
    };

    return (
        <Box
            sx={{
                borderRadius: "4px",
                border: `1px solid ${designTokens.line}`,
                bgcolor: designTokens.panel,
                overflow: "hidden",
                mb: "24px",
            }}
        >
            {/* ─── Cell Header Toolbar ─────────────────────────────────── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                    px: "16px",
                    py: "10px",
                    bgcolor: designTokens.panelAlt,
                    borderBottom: `1px solid ${designTokens.line}`,
                }}
            >
                {/* Left: Prompt, Filename & Title */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    {renderPromptTag()}

                    <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <IconComponent name="code" size={13} color={designTokens.acc} />
                        <Typography
                            sx={{
                                fontSize: "12.5px",
                                fontWeight: 600,
                                color: designTokens.text,
                                fontFamily: designTokens.fontMono,
                            }}
                        >
                            main.py
                        </Typography>
                    </Box>

                    <Box
                        component="span"
                        sx={{
                            color: designTokens.dim,
                            fontSize: "12px",
                            fontFamily: designTokens.fontMono,
                        }}
                    >
                        ·
                    </Box>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: designTokens.mute,
                            fontFamily: designTokens.fontSans,
                            fontWeight: 500,
                        }}
                    >
                        {title}
                    </Typography>

                    <Box
                        component="span"
                        sx={{
                            fontFamily: designTokens.fontMono,
                            fontSize: "10px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: designTokens.dim,
                            border: `1px solid ${designTokens.line}`,
                            px: "6px",
                            py: "1px",
                            borderRadius: "2px",
                        }}
                    >
                        {lines.length} lines
                    </Box>
                </Box>

                {/* Right: Action Buttons */}
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {/* Primary Button: High contrast filled button */}
                    <Button
                        size="small"
                        onClick={handleRun}
                        disabled={isExecuting}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            px: "14px",
                            py: "5px",
                            borderRadius: "4px",
                            bgcolor: isExecuting ? designTokens.panelAlt : designTokens.text,
                            color: isExecuting ? designTokens.mute : designTokens.bg,
                            fontSize: "12px",
                            fontWeight: 600,
                            textTransform: "none",
                            fontFamily: designTokens.fontSans,
                            cursor: isExecuting ? "not-allowed" : "pointer",
                            boxShadow: "var(--ml-card-shadow)",
                            transition: "opacity 0.2s, transform 0.2s",
                            "&:hover": {
                                filter: "brightness(0.92)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        {isExecuting ? (
                            <>
                                <CircularProgress size={12} sx={{ color: "currentColor" }} />
                                <span>Menjalankan...</span>
                            </>
                        ) : (
                            <>
                                <IconComponent name="play" size={11} color="currentColor" />
                                <span>{executionCount !== null ? "Re-run Cell" : "Run Cell"}</span>
                            </>
                        )}
                    </Button>

                    {/* Secondary Hairline Ghost Buttons */}
                    <Button
                        size="small"
                        onClick={handleReset}
                        disabled={isExecuting || (!output && executionCount === null)}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            px: "10px",
                            py: "5px",
                            borderRadius: "4px",
                            bgcolor: designTokens.panel,
                            color: designTokens.mute,
                            border: `1px solid ${designTokens.line}`,
                            fontSize: "11px",
                            textTransform: "none",
                            fontFamily: designTokens.fontMono,
                            "&:hover": {
                                borderColor: designTokens.dim,
                                color: designTokens.text,
                            },
                            "&:disabled": {
                                opacity: 0.35,
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
                            px: "10px",
                            py: "5px",
                            borderRadius: "4px",
                            bgcolor: designTokens.panel,
                            color: copiedCode ? designTokens.acc : designTokens.mute,
                            border: `1px solid ${copiedCode ? designTokens.acc : designTokens.line}`,
                            fontSize: "11px",
                            textTransform: "none",
                            fontFamily: designTokens.fontMono,
                            "&:hover": {
                                borderColor: designTokens.dim,
                                color: designTokens.text,
                            },
                        }}
                    >
                        {copiedCode ? <IconComponent name="check" size={11} color={designTokens.acc} /> : null}
                        <span>{copiedCode ? "Tersalin" : "Salin Kode"}</span>
                    </Button>
                </Box>
            </Box>

            {/* Optional Description */}
            {description && (
                <Box
                    sx={{
                        px: "16px",
                        py: "8px",
                        bgcolor: designTokens.boxSubtleBg,
                        borderBottom: `1px solid ${designTokens.line}`,
                    }}
                >
                    <Typography sx={{ fontSize: "12.5px", color: designTokens.mute, lineHeight: 1.5 }}>
                        {description}
                    </Typography>
                </Box>
            )}

            {/* ─── Code Body: Monaco Editor with Fallback ──────────────── */}
            <Box
                sx={{
                    bgcolor: designTokens.panel,
                    position: "relative",
                    minHeight: "180px",
                    maxHeight: maxCodeHeight,
                    overflow: "hidden",
                }}
            >
                {isEditorMounted ? (
                    <Editor
                        height={calculatedEditorHeight}
                        language="python"
                        theme={themeMode === "light" ? "light" : "vs-dark"}
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12.5,
                            fontFamily: "var(--font-mono), 'JetBrains Mono', Consolas, monospace",
                            lineNumbers: "on",
                            lineNumbersMinChars: 3,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 4,
                            renderLineHighlight: "all",
                            padding: { top: 12, bottom: 12 },
                            scrollbar: {
                                vertical: "auto",
                                horizontal: "auto",
                                verticalScrollbarSize: 6,
                                horizontalScrollbarSize: 6,
                            },
                        }}
                    />
                ) : (
                    /* Initial Instant Render (No Flash of Empty Content) */
                    <Box
                        sx={{
                            display: "flex",
                            maxHeight: maxCodeHeight,
                            overflowY: "auto",
                        }}
                    >
                        <Box
                            sx={{
                                userSelect: "none",
                                px: "12px",
                                py: "14px",
                                bgcolor: designTokens.boxSubtleBg,
                                borderRight: `1px solid ${designTokens.line}`,
                                fontFamily: designTokens.fontMono,
                                fontSize: "12px",
                                lineHeight: 1.6,
                                color: designTokens.dim,
                                textAlign: "right",
                                minWidth: "38px",
                            }}
                        >
                            {lines.map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </Box>
                        <Box
                            component="pre"
                            sx={{
                                m: 0,
                                p: "14px 18px",
                                fontFamily: designTokens.fontMono,
                                fontSize: "12.5px",
                                lineHeight: 1.6,
                                color: designTokens.text,
                                overflowX: "auto",
                                flex: 1,
                            }}
                        >
                            <code>{code}</code>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ─── Output Section: Out [n] ──────────────────────────────── */}
            {output ? (
                <Box
                    sx={{
                        borderTop: `1px solid ${designTokens.line}`,
                        bgcolor: designTokens.panel,
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
                            px: "16px",
                            py: "8px",
                            bgcolor: designTokens.panelAlt,
                            borderBottom: `1px solid ${designTokens.line}`,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <Box
                                component="span"
                                sx={{
                                    color: output.status === "success" ? designTokens.acc : "#EF4444",
                                    fontWeight: 600,
                                    fontFamily: designTokens.fontMono,
                                    fontSize: "12px",
                                }}
                            >
                                Out [{executionCount || 1}]:
                            </Box>

                            <Box
                                component="span"
                                sx={{
                                    fontFamily: designTokens.fontMono,
                                    fontSize: "11px",
                                    letterSpacing: "0.08em",
                                    color: output.status === "success" ? designTokens.acc : "#EF4444",
                                    textTransform: "uppercase",
                                }}
                            >
                                {output.status === "success"
                                    ? `[EXIT: 0 · ${(output.executionTime / 1000).toFixed(2)}s]`
                                    : "[EXIT: 1 · ERROR]"}
                            </Box>

                            {/* View Mode Switcher (Stacked vs Plot vs Terminal) */}
                            {hasPlots && (
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        borderRadius: "3px",
                                        border: `1px solid ${designTokens.line}`,
                                        p: "2px",
                                        bgcolor: designTokens.boxSubtleBg,
                                        ml: "6px",
                                    }}
                                >
                                    <Button
                                        size="small"
                                        onClick={() => setOutputView("stacked")}
                                        sx={{
                                            px: "8px",
                                            py: "2px",
                                            borderRadius: "2px",
                                            fontSize: "10.5px",
                                            fontFamily: designTokens.fontMono,
                                            textTransform: "none",
                                            bgcolor: outputView === "stacked" ? designTokens.panel : "transparent",
                                            boxShadow: outputView === "stacked" ? "var(--ml-card-shadow)" : "none",
                                            color: outputView === "stacked" ? designTokens.text : designTokens.mute,
                                        }}
                                    >
                                        Semua (Plot &amp; Log)
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => setOutputView("plot")}
                                        sx={{
                                            px: "8px",
                                            py: "2px",
                                            borderRadius: "2px",
                                            fontSize: "10.5px",
                                            fontFamily: designTokens.fontMono,
                                            textTransform: "none",
                                            bgcolor: outputView === "plot" ? designTokens.panel : "transparent",
                                            boxShadow: outputView === "plot" ? "var(--ml-card-shadow)" : "none",
                                            color: outputView === "plot" ? designTokens.text : designTokens.mute,
                                        }}
                                    >
                                        Visual Plot ({output.plots!.length})
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => setOutputView("terminal")}
                                        sx={{
                                            px: "8px",
                                            py: "2px",
                                            borderRadius: "2px",
                                            fontSize: "10.5px",
                                            fontFamily: designTokens.fontMono,
                                            textTransform: "none",
                                            bgcolor: outputView === "terminal" ? designTokens.panel : "transparent",
                                            boxShadow: outputView === "terminal" ? "var(--ml-card-shadow)" : "none",
                                            color: outputView === "terminal" ? designTokens.text : designTokens.mute,
                                        }}
                                    >
                                        Terminal Stdout
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {output.stdout && (
                                <Button
                                    size="small"
                                    onClick={handleCopyOutput}
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        px: "8px",
                                        py: "3px",
                                        borderRadius: "3px",
                                        bgcolor: designTokens.panel,
                                        color: copiedOutput ? designTokens.acc : designTokens.mute,
                                        border: `1px solid ${designTokens.line}`,
                                        fontSize: "10.5px",
                                        textTransform: "none",
                                        fontFamily: designTokens.fontMono,
                                        "&:hover": {
                                            color: designTokens.text,
                                            borderColor: designTokens.dim,
                                        },
                                    }}
                                >
                                    {copiedOutput ? <IconComponent name="check" size={10} color={designTokens.acc} /> : null}
                                    <span>{copiedOutput ? "Tersalin" : "Salin Log"}</span>
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* ─── Visual Plot Output Container ─── */}
                    {hasPlots && (outputView === "stacked" || outputView === "plot") && (
                        <Box
                            sx={{
                                p: "16px 20px",
                                bgcolor: designTokens.vizContainerBg,
                                borderBottom: outputView === "stacked" ? `1px solid ${designTokens.line}` : "none",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mb: "12px",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Box
                                        component="span"
                                        sx={{
                                            display: "inline-block",
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            bgcolor: designTokens.acc,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: designTokens.fontMono,
                                            fontSize: "11px",
                                            fontWeight: 600,
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            color: designTokens.text,
                                        }}
                                    >
                                        Visual Output Plot (Matplotlib Figure)
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontFamily: designTokens.fontMono,
                                        fontSize: "10px",
                                        color: designTokens.dim,
                                    }}
                                >
                                    Client-Side Canvas Render · High-DPI
                                </Typography>
                            </Box>

                            {output.plots!.map((plotSrc, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        mb: idx === output.plots!.length - 1 ? 0 : "20px",
                                        p: "14px",
                                        borderRadius: "4px",
                                        border: `1px solid ${designTokens.line}`,
                                        bgcolor: designTokens.panel,
                                        boxShadow: "var(--ml-card-shadow)",
                                        textAlign: "center",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={plotSrc}
                                        alt={`Plot Output ${idx + 1}`}
                                        onClick={() => setZoomPlotSrc(plotSrc)}
                                        sx={{
                                            maxWidth: "100%",
                                            maxHeight: "440px",
                                            objectFit: "contain",
                                            borderRadius: "3px",
                                            cursor: "zoom-in",
                                            transition: "opacity 0.2s",
                                            "&:hover": { opacity: 0.95 },
                                        }}
                                    />

                                    {/* Plot Actions Strip */}
                                    <Box
                                        sx={{
                                            mt: "12px",
                                            pt: "10px",
                                            borderTop: `1px solid ${designTokens.line}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <Button
                                            size="small"
                                            onClick={() => setZoomPlotSrc(plotSrc)}
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                px: "10px",
                                                py: "3px",
                                                borderRadius: "3px",
                                                bgcolor: designTokens.panel,
                                                color: designTokens.mute,
                                                border: `1px solid ${designTokens.line}`,
                                                fontSize: "11px",
                                                textTransform: "none",
                                                fontFamily: designTokens.fontMono,
                                                "&:hover": {
                                                    borderColor: designTokens.dim,
                                                    color: designTokens.text,
                                                },
                                            }}
                                        >
                                            <IconComponent name="search" size={11} />
                                            <span>Perbesar Plot</span>
                                        </Button>

                                        <Button
                                            size="small"
                                            onClick={() => handleDownloadPlot(plotSrc, idx)}
                                            sx={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "5px",
                                                px: "10px",
                                                py: "3px",
                                                borderRadius: "3px",
                                                bgcolor: designTokens.panel,
                                                color: designTokens.mute,
                                                border: `1px solid ${designTokens.line}`,
                                                fontSize: "11px",
                                                textTransform: "none",
                                                fontFamily: designTokens.fontMono,
                                                "&:hover": {
                                                    borderColor: designTokens.dim,
                                                    color: designTokens.text,
                                                },
                                            }}
                                        >
                                            <IconComponent name="download" size={11} />
                                            <span>Unduh PNG</span>
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* ─── Terminal Stdout Output Container ─── */}
                    {(outputView === "stacked" || outputView === "terminal" || !hasPlots) && (
                        <Box
                            sx={{
                                p: "16px 20px",
                                fontFamily: designTokens.fontMono,
                                fontSize: "12px",
                                lineHeight: 1.6,
                                color: output.status === "error" ? "#EF4444" : designTokens.text,
                                bgcolor: designTokens.panelAlt,
                                maxHeight: "340px",
                                overflowY: "auto",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                            }}
                        >
                            {output.status === "error" ? (
                                <Box sx={{ color: "#F43F5E", fontFamily: designTokens.fontMono }}>
                                    {output.stderr || output.errorDetails || "Terjadi kesalahan saat mengeksekusi skrip Python."}
                                </Box>
                            ) : output.stdout ? (
                                renderFormattedStdout(output.stdout)
                            ) : (
                                <Box sx={{ color: designTokens.dim, fontStyle: "italic" }}>
                                    (Skrip selesai dieksekusi tanpa keluaran teks stdout)
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            ) : (
                /* Sleek Initial Prompt Strip (Prior to first run) */
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                        px: "16px",
                        py: "10px",
                        bgcolor: designTokens.panelAlt,
                        borderTop: `1px solid ${designTokens.line}`,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Box
                            component="span"
                            sx={{
                                color: designTokens.dim,
                                fontWeight: 600,
                                fontFamily: designTokens.fontMono,
                                fontSize: "12px",
                            }}
                        >
                            Out [ ]:
                        </Box>
                        <Typography sx={{ fontSize: "11.5px", color: designTokens.dim, fontFamily: designTokens.fontMono }}>
                            Klik &quot;Run Cell&quot; untuk mengeksekusi komputasi numerik &amp; visualisasi plot secara instan di browser.
                        </Typography>
                    </Box>

                    <Button
                        size="small"
                        onClick={handleRun}
                        disabled={isExecuting}
                        sx={{
                            color: designTokens.mute,
                            fontSize: "11px",
                            textTransform: "none",
                            fontFamily: designTokens.fontMono,
                            border: `1px solid ${designTokens.line}`,
                            px: "8px",
                            py: "2px",
                            borderRadius: "3px",
                            "&:hover": {
                                color: designTokens.text,
                                borderColor: designTokens.dim,
                            },
                        }}
                    >
                        Jalankan Sekarang →
                    </Button>
                </Box>
            )}

            {/* ─── Lightbox Dialog for Fullscreen Plot Preview ─── */}
            <Dialog
                open={!!zoomPlotSrc}
                onClose={() => setZoomPlotSrc(null)}
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        bgcolor: designTokens.panel,
                        border: `1px solid ${designTokens.line}`,
                        borderRadius: "6px",
                        p: 0,
                        overflow: "hidden",
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: "18px",
                        py: "10px",
                        borderBottom: `1px solid ${designTokens.line}`,
                    }}
                >
                    <Typography sx={{ fontFamily: designTokens.fontMono, fontSize: "12px", color: designTokens.text, fontWeight: 600 }}>
                        {title} — Visual Output Detail
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => setZoomPlotSrc(null)}
                        sx={{ color: designTokens.mute, "&:hover": { color: designTokens.text } }}
                    >
                        <IconComponent name="x" size={16} />
                    </IconButton>
                </Box>
                <DialogContent sx={{ p: "24px", textAlign: "center", bgcolor: designTokens.vizContainerBg }}>
                    {zoomPlotSrc && (
                        <Box
                            component="img"
                            src={zoomPlotSrc}
                            alt="Full Plot Detail"
                            sx={{
                                maxWidth: "100%",
                                maxHeight: "80vh",
                                objectFit: "contain",
                                borderRadius: "4px",
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}
