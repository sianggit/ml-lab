"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconComponent from "@/shared/components/icon";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { codeCellStyles } from "./code-cell.styles";

// Lazy load Monaco Editor to prevent SSR window issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
    loading: () => (
        <Box sx={codeCellStyles.loadingOverlay}>
            <CircularProgress size={24} sx={{ color: "#38BDF8" }} />
            <Typography sx={{ fontSize: "0.85rem", fontFamily: "var(--font-mono), monospace" }}>
                Memuat Monaco Scientific Code Editor...
            </Typography>
        </Box>
    ),
});

export interface CodeCellProps {
    initialCode: string;
    onRun: (code: string) => Promise<unknown> | void;
    isRunning?: boolean;
    executionTime?: number;
    disabled?: boolean;
    onResetKernel?: () => void;
}

type EditorTab = "code" | "dataset" | "hyperparams";

const SAMPLE_DATASET_CSV = `sepal_length,sepal_width,petal_length,petal_width,species
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
4.7,3.2,1.3,0.2,Iris-setosa
7.0,3.2,4.7,1.4,Iris-versicolor
6.4,3.2,4.5,1.5,Iris-versicolor
6.3,3.3,6.0,2.5,Iris-virginica
5.8,2.7,5.1,1.9,Iris-virginica
# [Loaded in-memory: 150 rows x 5 columns]`;

const SAMPLE_HYPERPARAMS_YAML = `pipeline:
  estimator: "RandomForestClassifier"
  parameters:
    n_estimators: 100
    criterion: "gini"
    max_depth: 5
    min_samples_split: 2
    random_state: 42
  validation:
    test_size: 0.2
    stratify: true
    scoring: "f1_macro"
  hardware_runtime:
    backend: "pyodide_wasm_64"
    thread_isolation: true`;

export default function CodeCell({
    initialCode,
    onRun,
    isRunning = false,
    executionTime,
    disabled = false,
    onResetKernel,
}: CodeCellProps) {
    const [code, setCode] = useState(initialCode);
    const [activeTab, setActiveTab] = useState<EditorTab>("code");
    const [isMounted, setIsMounted] = useState(false);
    const [isOptimisticRunning, setIsOptimisticRunning] = useState(false);
    const latestCodeRef = useRef(code);

    const effectiveIsRunning = isRunning || isOptimisticRunning;

    const { compileStreak, avgExecTimeMs } = useMlLabStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isRunning) {
            setIsOptimisticRunning(false);
        }
    }, [isRunning]);

    useEffect(() => {
        setCode(initialCode);
        latestCodeRef.current = initialCode;
    }, [initialCode]);

    const handleCodeChange = (newVal?: string) => {
        const value = newVal ?? "";
        setCode(value);
        latestCodeRef.current = value;
    };

    const handleRunClick = () => {
        if (!effectiveIsRunning && !disabled) {
            setIsOptimisticRunning(true);
            try {
                const res = onRun(latestCodeRef.current);
                if (res instanceof Promise) {
                    res.finally(() => {
                        setIsOptimisticRunning(false);
                    });
                }
            } catch {
                setIsOptimisticRunning(false);
            }
        }
    };

    const handleResetClick = () => {
        setCode(initialCode);
        latestCodeRef.current = initialCode;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if ((e.shiftKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            handleRunClick();
        }
    };

    return (
        <Box sx={codeCellStyles.container} onKeyDown={handleKeyDown}>
            {/* ─── 1. OS-Style Window Titlebar ─── */}
            <Box sx={codeCellStyles.windowTitlebar}>
                {/* Left: Window Dots & Tabs */}
                <Box sx={codeCellStyles.windowControlsLeft}>
                    <Box sx={codeCellStyles.macDotsGroup}>
                        <Box sx={codeCellStyles.macDot("#F43F5E")} />
                        <Box sx={codeCellStyles.macDot("#F59E0B")} />
                        <Box sx={codeCellStyles.macDot("#00F59B")} />
                    </Box>

                    {/* File Tabs */}
                    <Box
                        sx={codeCellStyles.fileTabItem(activeTab === "code")}
                        onClick={() => setActiveTab("code")}
                    >
                        <IconComponent name="code" size={14} />
                        <span>main.py</span>
                    </Box>
                    <Box
                        sx={codeCellStyles.fileTabItem(activeTab === "dataset")}
                        onClick={() => setActiveTab("dataset")}
                    >
                        <IconComponent name="file-text" size={14} />
                        <span>dataset.csv</span>
                    </Box>
                    <Box
                        sx={codeCellStyles.fileTabItem(activeTab === "hyperparams")}
                        onClick={() => setActiveTab("hyperparams")}
                    >
                        <IconComponent name="settings" size={14} />
                        <span>hyperparams.yaml</span>
                    </Box>
                </Box>

                {/* Center: Kernel Status Badge */}
                <Box sx={codeCellStyles.kernelStatusCenter}>
                    <Box sx={codeCellStyles.kernelDiode} />
                    <span>
                        Python 3.11 (Pyodide WebAssembly) • {effectiveIsRunning ? "Running..." : "Idle"}
                    </span>
                </Box>

                {/* Right: Quick Action Shortcuts */}
                <Box sx={codeCellStyles.shortcutsRight}>
                    <Typography sx={codeCellStyles.shortcutKbdHint}>
                        Shift + ↵ Run
                    </Typography>

                    <Button
                        onClick={handleResetClick}
                        disabled={effectiveIsRunning}
                        sx={codeCellStyles.titlebarBtn}
                        title="Kembalikan kode editor ke skrip awal modul"
                    >
                        Reset Source
                    </Button>

                    {onResetKernel && (
                        <Button
                            onClick={onResetKernel}
                            disabled={effectiveIsRunning}
                            sx={{ ...codeCellStyles.titlebarBtn, color: "#F43F5E" }}
                            title="Reset Global Pyodide Namespace & Kernel Memory"
                        >
                            Reset Namespace
                        </Button>
                    )}
                </Box>
            </Box>

            {/* ─── 2. Tactile Primary Action Bar ─── */}
            <Box sx={codeCellStyles.actionBar}>
                <Box sx={codeCellStyles.actionLeftGroup}>
                    <Button
                        variant="contained"
                        onClick={handleRunClick}
                        disabled={effectiveIsRunning || disabled}
                        sx={codeCellStyles.runSimulationButton}
                    >
                        {effectiveIsRunning ? (
                            <>
                                <CircularProgress size={14} color="inherit" />
                                <span>Menjalankan Simulasi...</span>
                            </>
                        ) : (
                            <>
                                <IconComponent name="play" size={12} />
                                <span>Run Simulation</span>
                            </>
                        )}
                    </Button>

                    <Typography sx={{ fontSize: "0.72rem", color: "#8A94A6", display: { xs: "none", sm: "inline-block" } }}>
                        (Eksekusi client-side real-time)
                    </Typography>
                </Box>

                {/* Execution Telemetry Badge */}
                <Box sx={codeCellStyles.telemetryBadge}>
                    <IconComponent name="zap" size={13} color="#00F59B" />
                    <span>
                        {isMounted && compileStreak > 0 ? `${compileStreak} Clean Runs` : "Engine Standby"} •{" "}
                        {executionTime !== undefined ? `${executionTime}ms` : `${avgExecTimeMs || 450}ms`} • Heap: 34MB
                    </span>
                </Box>
            </Box>

            {/* ─── 3. Editor Canvas or File Viewer Tab ─── */}
            {activeTab === "code" && (
                <Box sx={codeCellStyles.editorWrapper}>
                    {isMounted && (
                        <Editor
                            height="340px"
                            language="python"
                            theme="vs-dark"
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "var(--font-mono), 'JetBrains Mono', Consolas, monospace",
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                renderLineHighlight: "all",
                                scrollbar: {
                                    vertical: "auto",
                                    horizontal: "auto",
                                    verticalScrollbarSize: 6,
                                    horizontalScrollbarSize: 6,
                                },
                            }}
                        />
                    )}
                </Box>
            )}

            {activeTab === "dataset" && (
                <Box sx={codeCellStyles.fileViewerContainer}>
                    <Box component="pre" sx={{ m: 0, color: "#EDEDED", whiteSpace: "pre-wrap" }}>
                        {SAMPLE_DATASET_CSV}
                    </Box>
                </Box>
            )}

            {activeTab === "hyperparams" && (
                <Box sx={codeCellStyles.fileViewerContainer}>
                    <Box component="pre" sx={{ m: 0, color: "#38BDF8", whiteSpace: "pre-wrap" }}>
                        {SAMPLE_HYPERPARAMS_YAML}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

