"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconComponent from "@/shared/components/icon";
import { Chapter } from "@/models/ml-lab/chapter.model";
import { designTokens } from "@/config/theme";
import { visualSandboxStyles } from "./visual-sandbox.styles";

export interface VisualSandboxProps {
    chapter: Chapter;
}

export default function VisualSandbox({ chapter }: VisualSandboxProps) {
    const chapterNum = chapter.number;

    // Group chapters into 6 visual parametric twins
    if (chapterNum <= 3) {
        return <DataPipelineSandbox chapter={chapter} />;
    } else if (chapterNum <= 5) {
        return <RegressionAndTreesSandbox chapter={chapter} />;
    } else if (chapterNum <= 7) {
        return <KnnSvmBoundarySandbox chapter={chapter} />;
    } else if (chapterNum <= 9) {
        return <DecisionTreeEnsembleSandbox chapter={chapter} />;
    } else if (chapterNum <= 11) {
        return <ClusteringAndPcaSandbox chapter={chapter} />;
    } else {
        return <EvaluationAndNeuralSandbox chapter={chapter} />;
    }
}

// ─── 1. Bab 01 - 03: Feature Scaling & Matrix Broadcasting Visualizer ────────
function DataPipelineSandbox({ chapter }: { chapter: Chapter }) {
    const [scalingMethod, setScalingMethod] = useState<"raw" | "minmax" | "standard">("raw");
    const [multiplier, setMultiplier] = useState<number>(1.5);

    const rawData = useMemo(() => [15, 32, 60, 110, 220, 480], []);

    const transformedData = useMemo(() => {
        const scaled = rawData.map((v) => v * multiplier);
        if (scalingMethod === "raw") return scaled;
        if (scalingMethod === "minmax") {
            const min = Math.min(...scaled);
            const max = Math.max(...scaled);
            return scaled.map((v) => (v - min) / (max - min || 1));
        }
        // standard (z-score)
        const mean = scaled.reduce((a, b) => a + b, 0) / scaled.length;
        const std = Math.sqrt(scaled.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scaled.length) || 1;
        return scaled.map((v) => (v - mean) / std);
    }, [rawData, multiplier, scalingMethod]);

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="chart-bar" size={20} color="#00F59B" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Feature Scaling & Normalization
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Eksplorasi efek Min-Max Scaler vs Standard Scaler terhadap sebaran data
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab 0${chapter.number} Sandbox`} color="primary" />
            </Box>

            {/* Controls */}
            <Box sx={visualSandboxStyles.controlPanel}>
                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Metode Penskalaan</Typography>
                    </Box>
                    <ButtonGroup size="small" variant="outlined">
                        <Button
                            variant={scalingMethod === "raw" ? "contained" : "outlined"}
                            onClick={() => setScalingMethod("raw")}
                            sx={{ textTransform: "none" }}
                        >
                            Raw Data
                        </Button>
                        <Button
                            variant={scalingMethod === "minmax" ? "contained" : "outlined"}
                            onClick={() => setScalingMethod("minmax")}
                            sx={{ textTransform: "none" }}
                        >
                            MinMax [0, 1]
                        </Button>
                        <Button
                            variant={scalingMethod === "standard" ? "contained" : "outlined"}
                            onClick={() => setScalingMethod("standard")}
                            sx={{ textTransform: "none" }}
                        >
                            Standard (Z-Score)
                        </Button>
                    </ButtonGroup>
                </Box>

                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Skala Pengali Fitur (Broadcasting)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            {multiplier.toFixed(2)}x
                        </Typography>
                    </Box>
                    <Slider
                        value={multiplier}
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        onChange={(_, v) => setMultiplier(v as number)}
                        sx={{ maxWidth: 360, color: "#6366F1" }}
                    />
                </Box>
            </Box>

            {/* Visual Bars */}
            <Box sx={visualSandboxStyles.visualCanvasCard}>
                <Typography sx={{ color: designTokens.mute, fontSize: "0.8rem", mb: 2 }}>
                    Diagram Sebaran Nilai Fitur Tabular
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: 180, width: "100%", px: 4, justifyContent: "center" }}>
                    {transformedData.map((val, idx) => {
                        let barHeight = 40;
                        if (scalingMethod === "raw") barHeight = Math.min(160, Math.max(10, (val / 1000) * 160));
                        else if (scalingMethod === "minmax") barHeight = Math.max(8, val * 160);
                        else barHeight = Math.max(10, Math.min(160, ((val + 2) / 4) * 160));

                        return (
                            <Box key={idx} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                <Typography sx={{ fontSize: "0.72rem", color: designTokens.text, fontFamily: designTokens.fontMono }}>
                                    {val.toFixed(2)}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 32,
                                        height: `${barHeight}px`,
                                        borderRadius: "6px 6px 0 0",
                                        background: "linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)",
                                        transition: "height 0.25s ease",
                                    }}
                                />
                                <Typography sx={{ fontSize: "0.7rem", color: designTokens.dim }}>X_{idx + 1}</Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Min Terhitung</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{Math.min(...transformedData).toFixed(2)}</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Max Terhitung</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{Math.max(...transformedData).toFixed(2)}</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Modus Transformasi</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: "#6366F1" }}>{scalingMethod.toUpperCase()}</Typography>
                </Box>
            </Box>
        </Box>
    );
}

// ─── 2. Bab 04 - 05: Regression & Linear Decision Fitting Canvas ─────────────
function RegressionAndTreesSandbox({ chapter }: { chapter: Chapter }) {
    const [slope, setSlope] = useState<number>(1.2);
    const [intercept, setIntercept] = useState<number>(20);

    // Fixed benchmark points
    const points = useMemo(
        () => [
            { x: 10, y: 35 },
            { x: 20, y: 50 },
            { x: 30, y: 55 },
            { x: 40, y: 75 },
            { x: 50, y: 80 },
            { x: 60, y: 95 },
            { x: 70, y: 100 },
            { x: 80, y: 120 },
        ],
        []
    );

    // Compute live Mean Squared Error (MSE) at 60 FPS
    const mse = useMemo(() => {
        const errorSum = points.reduce((acc, p) => {
            const pred = slope * p.x + intercept;
            return acc + Math.pow(p.y - pred, 2);
        }, 0);
        return (errorSum / points.length).toFixed(2);
    }, [points, slope, intercept]);

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="chart-line" size={20} color="#38BDF8" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Fitting Garis Regresi & Loss MSE
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Gerakkan parameter bobot (w) dan bias (b) untuk meminimalkan garis error
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab 0${chapter.number} Sandbox`} color="primary" />
            </Box>

            <Box sx={visualSandboxStyles.controlPanel}>
                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Slope / Bobot Kemiringan (w)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            {slope.toFixed(2)}
                        </Typography>
                    </Box>
                    <Slider
                        value={slope}
                        min={0.0}
                        max={2.5}
                        step={0.05}
                        onChange={(_, v) => setSlope(v as number)}
                        sx={{ maxWidth: 360, color: "#10B981" }}
                    />
                </Box>

                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Intercept / Nilai Bias (b)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            {intercept.toFixed(1)}
                        </Typography>
                    </Box>
                    <Slider
                        value={intercept}
                        min={-20}
                        max={60}
                        step={1}
                        onChange={(_, v) => setIntercept(v as number)}
                        sx={{ maxWidth: 360, color: "#6366F1" }}
                    />
                </Box>
            </Box>

            {/* Dual-viewport Canvas */}
            <Box sx={visualSandboxStyles.dualViewportGrid}>
                {/* Left Viewport: Data Points + Live Fit + Residual Error Bars */}
                <Box sx={visualSandboxStyles.viewportCard}>
                    <Typography sx={visualSandboxStyles.viewportHeader}>
                        Viewport 1: Titik Observasi & Residual Error
                    </Typography>
                    <svg width="100%" height="220" viewBox="0 0 360 200" style={{ overflow: "visible" }}>
                        {/* Axes */}
                        <line x1="30" y1="20" x2="30" y2="180" stroke={designTokens.line} strokeWidth="1" />
                        <line x1="30" y1="180" x2="340" y2="180" stroke={designTokens.line} strokeWidth="1" />

                        {/* Residual error dashed lines */}
                        {points.map((p, idx) => {
                            const cx = 30 + (p.x / 100) * 300;
                            const cy = 180 - (p.y / 140) * 160;
                            const predY = slope * p.x + intercept;
                            const predCy = 180 - (predY / 140) * 160;
                            return (
                                <line
                                    key={`res-${idx}`}
                                    x1={cx}
                                    y1={cy}
                                    x2={cx}
                                    y2={predCy}
                                    stroke="rgba(255, 77, 109, 0.6)"
                                    strokeWidth="1.5"
                                    strokeDasharray="3 3"
                                />
                            );
                        })}

                        {/* Data Points */}
                        {points.map((p, idx) => {
                            const cx = 30 + (p.x / 100) * 300;
                            const cy = 180 - (p.y / 140) * 160;
                            return <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#38BDF8" stroke={designTokens.panel} strokeWidth="1" />;
                        })}

                        {/* Fitted Regression Line */}
                        {(() => {
                            const px1 = 30;
                            const py1 = 180 - (intercept / 140) * 160;
                            const px2 = 330;
                            const py2 = 180 - ((slope * 100 + intercept) / 140) * 160;
                            return (
                                <line
                                    x1={px1}
                                    y1={py1}
                                    x2={px2}
                                    y2={py2}
                                    stroke="#00F59B"
                                    strokeWidth="2.5"
                                />
                            );
                        })()}
                    </svg>
                </Box>

                {/* Right Viewport: 2D Loss Surface Contour Map J(w, b) */}
                <Box sx={visualSandboxStyles.viewportCard}>
                    <Typography sx={visualSandboxStyles.viewportHeader}>
                        Viewport 2: Permukaan Loss J(w, b) [Kontur Gradien]
                    </Typography>
                    <svg width="100%" height="220" viewBox="0 0 360 200">
                        {/* Contour ellipses representing loss bowl */}
                        <ellipse cx="180" cy="100" rx="140" ry="80" fill="none" stroke="rgba(124, 92, 252, 0.15)" strokeWidth="1.5" />
                        <ellipse cx="180" cy="100" rx="105" ry="60" fill="none" stroke="rgba(124, 92, 252, 0.25)" strokeWidth="1.5" />
                        <ellipse cx="180" cy="100" rx="70" ry="40" fill="none" stroke="rgba(124, 92, 252, 0.4)" strokeWidth="1.5" />
                        <ellipse cx="180" cy="100" rx="35" ry="20" fill="rgba(0, 245, 155, 0.08)" stroke="rgba(0, 245, 155, 0.5)" strokeWidth="1.5" />

                        {/* Global optimum marker (w*, b*) */}
                        <circle cx="180" cy="100" r="3" fill="#00F59B" />
                        <text x="188" y="104" fill="#00F59B" fontSize="9" fontFamily="var(--font-mono)">min J*</text>

                        {/* Dynamic point representing current (w, b) rolling down gradient */}
                        {(() => {
                            const curX = 40 + (slope / 2.5) * 280;
                            const curY = 180 - ((intercept + 20) / 80) * 160;
                            return (
                                <>
                                    <line x1="180" y1="100" x2={curX} y2={curY} stroke="rgba(255, 178, 36, 0.4)" strokeWidth="1" strokeDasharray="2 2" />
                                    <circle cx={curX} cy={curY} r="7" fill="#FFB224" stroke={designTokens.panel} strokeWidth="2" />
                                    <text x={curX + 10} y={curY - 6} fill="#FFB224" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                                        (w, b)
                                    </text>
                                </>
                            );
                        })()}
                    </svg>
                </Box>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Persamaan Model</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: "#9B82FD", fontSize: "0.95rem" }}>
                        y = {slope.toFixed(2)}x + {intercept.toFixed(1)}
                    </Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Mean Squared Error (MSE)</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{mse}</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Loss Convergence Status</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: Number(mse) < 50 ? "#00F59B" : "#FFB224" }}>
                        {Number(mse) < 50 ? "Optimal Fit" : "High Loss"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// ─── 3. Bab 06 - 07: K-NN & SVM Decision Boundary ───────────────────────────
function KnnSvmBoundarySandbox({ chapter }: { chapter: Chapter }) {
    const [kNeighbors, setKNeighbors] = useState<number>(3);
    const [cRegularization, setCRegularization] = useState<number>(1.0);
    const [kernelType, setKernelType] = useState<"linear" | "rbf">("rbf");
    const [activeDropClass, setActiveDropClass] = useState<0 | 1>(0);

    const initialBenchmarkPoints = useMemo<Array<{ x: number; y: number; cls: 0 | 1 }>>(
        () => [
            { x: 80, y: 50, cls: 0 },
            { x: 110, y: 80, cls: 0 },
            { x: 130, y: 140, cls: 0 },
            { x: 60, y: 120, cls: 0 },
            { x: 240, y: 60, cls: 1 },
            { x: 280, y: 110, cls: 1 },
            { x: 230, y: 150, cls: 1 },
            { x: 300, y: 80, cls: 1 },
        ],
        []
    );

    const [points, setPoints] = useState<Array<{ x: number; y: number; cls: 0 | 1 }>>(initialBenchmarkPoints);

    const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 360);
        const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 200);

        setPoints((prev) => [...prev, { x: clickX, y: clickY, cls: activeDropClass }]);
    };

    const handleResetPoints = () => {
        setPoints(initialBenchmarkPoints);
    };

    // Calculate dynamic boundary center from points
    const c0Points = points.filter((p) => p.cls === 0);
    const c1Points = points.filter((p) => p.cls === 1);
    const meanX0 = c0Points.length > 0 ? c0Points.reduce((acc, p) => acc + p.x, 0) / c0Points.length : 100;
    const meanX1 = c1Points.length > 0 ? c1Points.reduce((acc, p) => acc + p.x, 0) / c1Points.length : 260;
    const boundaryX = Math.max(60, Math.min(300, Math.round((meanX0 + meanX1) / 2)));
    const curveDeflection = kernelType === "rbf" ? Math.round((kNeighbors - 5) * 5 * cRegularization) : 0;

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="zap" size={20} color="#F59E0B" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Batas Keputusan K-NN & SVM Margin
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Klik langsung pada canvas untuk menaruh titik data & amati batas pemisah berubah live
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab 0${chapter.number} Sandbox`} color="primary" />
            </Box>

            <Box sx={visualSandboxStyles.controlPanel}>
                {/* Mode Taruh Titik */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Mode Penempatan Titik:</Typography>
                        <ButtonGroup size="small">
                            <Button
                                variant={activeDropClass === 0 ? "contained" : "outlined"}
                                onClick={() => setActiveDropClass(0)}
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: activeDropClass === 0 ? "#7C5CFC" : "transparent",
                                    color: activeDropClass === 0 ? "#FFFFFF" : designTokens.text,
                                }}
                            >
                                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                                    <IconComponent name="circle-dot" size={12} color="#A78BFA" />
                                    <span>Kelas 0 ({c0Points.length})</span>
                                </Box>
                            </Button>
                            <Button
                                variant={activeDropClass === 1 ? "contained" : "outlined"}
                                onClick={() => setActiveDropClass(1)}
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: activeDropClass === 1 ? "#00F59B" : "transparent",
                                    color: activeDropClass === 1 ? "#0B0D11" : designTokens.acc,
                                }}
                            >
                                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                                    <IconComponent name="circle-dot" size={12} color="#00F59B" />
                                    <span>Kelas 1 ({c1Points.length})</span>
                                </Box>
                            </Button>
                        </ButtonGroup>
                    </Box>

                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleResetPoints}
                        sx={{ fontSize: "0.75rem", textTransform: "none" }}
                    >
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                            <IconComponent name="rotate-ccw" size={13} />
                            <span>Reset Titik Data</span>
                        </Box>
                    </Button>
                </Box>

                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>K-Tetangga (K-NN)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            k = {kNeighbors}
                        </Typography>
                    </Box>
                    <Slider
                        value={kNeighbors}
                        min={1}
                        max={11}
                        step={2}
                        onChange={(_, v) => setKNeighbors(v as number)}
                        sx={{ maxWidth: 360, color: "#7C5CFC" }}
                    />
                </Box>

                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>SVM Kernel & Penalti C</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            C = {cRegularization.toFixed(1)}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <ButtonGroup size="small">
                            <Button
                                variant={kernelType === "linear" ? "contained" : "outlined"}
                                onClick={() => setKernelType("linear")}
                                sx={{ textTransform: "none" }}
                            >
                                Linear
                            </Button>
                            <Button
                                variant={kernelType === "rbf" ? "contained" : "outlined"}
                                onClick={() => setKernelType("rbf")}
                                sx={{ textTransform: "none" }}
                            >
                                RBF
                            </Button>
                        </ButtonGroup>
                        <Slider
                            value={cRegularization}
                            min={0.1}
                            max={5.0}
                            step={0.1}
                            onChange={(_, v) => setCRegularization(v as number)}
                            sx={{ width: 140, color: "#00F59B" }}
                        />
                    </Stack>
                </Box>
            </Box>

            {/* Interactive SVG Canvas with Click-to-Drop Data Placement */}
            <Box sx={visualSandboxStyles.visualCanvasCard}>
                <svg
                    width="100%"
                    height="240"
                    viewBox="0 0 360 200"
                    onClick={handleCanvasClick}
                    style={{ cursor: "crosshair" }}
                >
                    {/* Background region classification fill based on dynamic boundary */}
                    <rect x="0" y="0" width={boundaryX} height="200" fill="rgba(124, 92, 252, 0.12)" />
                    <rect x={boundaryX} y="0" width={360 - boundaryX} height="200" fill="rgba(0, 245, 155, 0.12)" />

                    {/* Decision Boundary Line / Curve */}
                    {kernelType === "linear" ? (
                        <line
                            x1={boundaryX}
                            y1="10"
                            x2={boundaryX}
                            y2="190"
                            stroke="#FFB224"
                            strokeWidth="3"
                            strokeDasharray="4"
                        />
                    ) : (
                        <path
                            d={`M ${boundaryX} 10 Q ${boundaryX + curveDeflection} 100 ${boundaryX} 190`}
                            stroke="#FFB224"
                            strokeWidth="3"
                            fill="none"
                        />
                    )}

                    {/* Dynamic Points Placed */}
                    {points.map((p, idx) => (
                        <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r="6.5"
                            fill={p.cls === 0 ? "#7C5CFC" : "#00F59B"}
                            stroke={designTokens.panel}
                            strokeWidth="1.2"
                        />
                    ))}

                    {/* Query point */}
                    <circle cx="170" cy="100" r="7.5" fill="#FF4D6D" stroke={designTokens.panel} strokeWidth="2" />
                    <text x="178" y="104" fill="#FF4D6D" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                        Target
                    </text>
                </svg>

                <Box sx={visualSandboxStyles.interactiveCanvasPrompt}>
                    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, verticalAlign: "-2px", mr: 0.5 }}>
                        <IconComponent name="target" size={14} color="#38BDF8" />
                    </Box>
                    Klik canvas untuk menambah titik {activeDropClass === 0 ? "Kelas 0" : "Kelas 1"}
                </Box>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Margin Lebar (2/||w||)</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>
                        {(2.0 / (1 + cRegularization * 0.35)).toFixed(3)}
                    </Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Total Sampel Pelatihan</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{points.length} Titik</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Prediksi Titik Target</Typography>
                    <Typography
                        sx={{
                            ...visualSandboxStyles.metricValue,
                            color: 170 < boundaryX ? "#9B82FD" : "#00F59B",
                        }}
                    >
                        {170 < boundaryX ? "Kelas 0 (Violet)" : "Kelas 1 (Mint)"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// ─── 4. Bab 08 - 09: Decision Tree & Ensemble Random Forest ─────────────────
function DecisionTreeEnsembleSandbox({ chapter }: { chapter: Chapter }) {
    const [maxDepth, setMaxDepth] = useState<number>(3);
    const [nEstimators, setNEstimators] = useState<number>(30);

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="tree" size={20} color="#00F59B" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Arsitektur Pohon Keputusan & Random Forest
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Simulasi kedalaman partisi fitur dan agregasi voting pohon majemuk
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab ${chapter.number} Sandbox`} color="primary" />
            </Box>

            <Box sx={visualSandboxStyles.controlPanel}>
                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Kedalaman Maksimal (Max Depth)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            Kedalaman: {maxDepth}
                        </Typography>
                    </Box>
                    <Slider
                        value={maxDepth}
                        min={1}
                        max={4}
                        step={1}
                        onChange={(_, v) => setMaxDepth(v as number)}
                        sx={{ maxWidth: 360, color: "#10B981" }}
                    />
                </Box>

                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Jumlah Pohon Ensemble (n_estimators)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            {nEstimators} Pohon
                        </Typography>
                    </Box>
                    <Slider
                        value={nEstimators}
                        min={10}
                        max={100}
                        step={10}
                        onChange={(_, v) => setNEstimators(v as number)}
                        sx={{ maxWidth: 360, color: "#6366F1" }}
                    />
                </Box>
            </Box>

            {/* Tree Nodes Visual Hierarchy */}
            <Box sx={visualSandboxStyles.visualCanvasCard}>
                <Stack spacing={2} sx={{ alignItems: "center", width: "100%" }}>
                    <Box sx={visualSandboxStyles.treeNode(true)}>
                        Root: Luas &lt;= 120m² (H=0.98)
                    </Box>
                    {maxDepth >= 2 && (
                        <Stack direction="row" spacing={6}>
                            <Box sx={visualSandboxStyles.treeNode(false)}>
                                L1: Kamur &lt;= 2 (H=0.45)
                            </Box>
                            <Box sx={visualSandboxStyles.treeNode(false)}>
                                L1: Lokasi = DKI (H=0.62)
                            </Box>
                        </Stack>
                    )}
                    {maxDepth >= 3 && (
                        <Stack direction="row" spacing={2}>
                            <Box sx={{ ...visualSandboxStyles.treeNode(false), fontSize: "0.7rem", minWidth: 70 }}>
                                Daun: Murah
                            </Box>
                            <Box sx={{ ...visualSandboxStyles.treeNode(false), fontSize: "0.7rem", minWidth: 70 }}>
                                Daun: Sedang
                            </Box>
                            <Box sx={{ ...visualSandboxStyles.treeNode(false), fontSize: "0.7rem", minWidth: 70 }}>
                                Daun: Tinggi
                            </Box>
                            <Box sx={{ ...visualSandboxStyles.treeNode(false), fontSize: "0.7rem", minWidth: 70 }}>
                                Daun: Mewah
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Total Daun Terminal</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{Math.pow(2, maxDepth - 1)} Daun</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Peluang Out-of-Bag (OOB)</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>36.79%</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Stabilitas Variansi Ensemble</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: "#34D399" }}>
                        {nEstimators >= 50 ? "Sangat Stabil" : "Cukup Stabil"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// ─── 5. Bab 10 - 11: K-Means Clustering & PCA Scree Plot ────────────────────
function ClusteringAndPcaSandbox({ chapter }: { chapter: Chapter }) {
    const [step, setStep] = useState<number>(1);

    const handleNextStep = () => {
        setStep((prev) => (prev >= 3 ? 1 : prev + 1));
    };

    // Centroid coordinates moving across iterations
    const c1 = step === 1 ? { x: 2, y: 9 } : step === 2 ? { x: 2.5, y: 9.0 } : { x: 2.5, y: 9.0 };
    const c2 = step === 1 ? { x: 9, y: 2 } : step === 2 ? { x: 9.0, y: 2.3 } : { x: 9.0, y: 2.3 };

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="network" size={20} color="#38BDF8" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Pembaruan Centroid K-Means & Variansi PCA
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Pembuktian langkah update centroid (Bab 10 Halaman 60 modul)
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab ${chapter.number} Sandbox`} color="primary" />
            </Box>

            <Box sx={visualSandboxStyles.controlPanel}>
                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Status Iterasi Clustering</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: designTokens.mute }}>
                            {step === 1 ? "Inisialisasi Titik Centroid Awal" : step === 2 ? "Partisi Anggota Klaster" : "Konvergensi Posisi Centroid Final"}
                        </Typography>
                    </Box>
                    <Button variant="contained" onClick={handleNextStep} sx={{ backgroundColor: "#6366F1", textTransform: "none" }}>
                        {step === 3 ? "Reset ke Awal" : "Langkah Iterasi Berikutnya &rarr;"}
                    </Button>
                </Box>
            </Box>

            {/* Scatter 2D Centroid canvas */}
            <Box sx={visualSandboxStyles.visualCanvasCard}>
                <svg width="100%" height="220" viewBox="0 0 360 200">
                    {/* Points cluster 1 */}
                    <circle cx="80" cy="60" r="6" fill="#6366F1" opacity="0.8" />
                    <circle cx="100" cy="70" r="6" fill="#6366F1" opacity="0.8" />
                    <circle cx="70" cy="90" r="6" fill="#6366F1" opacity="0.8" />

                    {/* Points cluster 2 */}
                    <circle cx="260" cy="140" r="6" fill="#10B981" opacity="0.8" />
                    <circle cx="280" cy="130" r="6" fill="#10B981" opacity="0.8" />
                    <circle cx="290" cy="160" r="6" fill="#10B981" opacity="0.8" />

                    {/* Centroid 1 marker */}
                    <rect x={70 + step * 10} y={60 + step * 5} width="16" height="16" fill="#FBBF24" stroke={designTokens.panel} strokeWidth="2" />
                    <text x={95 + step * 10} y={73 + step * 5} fill="#FBBF24" fontSize="12" fontWeight="bold">
                        C1 ({c1.x}, {c1.y})
                    </text>

                    {/* Centroid 2 marker */}
                    <rect x={260 - step * 5} y={130 + step * 4} width="16" height="16" fill="#EF4444" stroke={designTokens.panel} strokeWidth="2" />
                    <text x={285 - step * 5} y={143 + step * 4} fill="#EF4444" fontSize="12" fontWeight="bold">
                        C2 ({c2.x}, {c2.y})
                    </text>
                </svg>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Iterasi Langkah</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>Langkah {step} dari 3</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>PCA Rasio Varians PC1</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>78.4%</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Status Konvergensi</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: step === 3 ? "#34D399" : "#F59E0B" }}>
                        {step === 3 ? "Tercapai (Stabil)" : "Sedang Bergeser"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// ─── 6. Bab 12 - 14: Confusion Matrix, ROC-AUC & MLP Weights ────────────────
function EvaluationAndNeuralSandbox({ chapter }: { chapter: Chapter }) {
    const [threshold, setThreshold] = useState<number>(0.5);

    // Dynamic confusion matrix based on threshold
    const totalPos = 60;
    const totalNeg = 60;

    const tp = Math.round(totalPos * (1 - Math.pow(threshold, 1.8)));
    const fn = totalPos - tp;
    const fp = Math.round(totalNeg * Math.pow(1 - threshold, 2.2));
    const tn = totalNeg - fp;

    const tpr = tp / totalPos; // Recall / Sensitivity
    const fpr = fp / totalNeg; // Fall-out
    const precision = tp / (tp + fp || 1);
    const f1 = (2 * (precision * tpr)) / (precision + tpr || 1);
    const accuracy = (tp + tn) / (totalPos + totalNeg);

    return (
        <Box sx={visualSandboxStyles.container}>
            <Box sx={visualSandboxStyles.sandboxHeader}>
                <Box sx={visualSandboxStyles.titleWrapper}>
                    <Box sx={visualSandboxStyles.headerIcon}>
                        <IconComponent name="target" size={20} color="#F59E0B" />
                    </Box>
                    <Box>
                        <Typography sx={visualSandboxStyles.titleText}>
                            Visual Twin: Kurva ROC, Ambang Klasifikasi & Confusion Matrix
                        </Typography>
                        <Typography sx={visualSandboxStyles.subtitleText}>
                            Tarik slider ambang batas (T) untuk menggeser garis potong probabilitas & amati lintasan titik ROC
                        </Typography>
                    </Box>
                </Box>
                <Chip size="small" label={`Bab ${chapter.number} Sandbox`} color="primary" />
            </Box>

            <Box sx={visualSandboxStyles.controlPanel}>
                <Box sx={visualSandboxStyles.sliderRow}>
                    <Box sx={visualSandboxStyles.sliderLabelWrapper}>
                        <Typography sx={visualSandboxStyles.sliderLabel}>Ambang Keputusan (Threshold T)</Typography>
                        <Typography component="span" sx={visualSandboxStyles.sliderValueBadge}>
                            T = {threshold.toFixed(2)}
                        </Typography>
                    </Box>
                    <Slider
                        value={threshold}
                        min={0.05}
                        max={0.95}
                        step={0.01}
                        onChange={(_, v) => setThreshold(v as number)}
                        sx={{ maxWidth: 360, color: "#FFB224" }}
                    />
                </Box>
            </Box>

            {/* Dual Viewport: Probability Distribution & ROC Curve */}
            <Box sx={visualSandboxStyles.dualViewportGrid}>
                {/* Viewport 1: Probability Distribution with Vertical Threshold Line */}
                <Box sx={visualSandboxStyles.viewportCard}>
                    <Typography sx={visualSandboxStyles.viewportHeader}>
                        Viewport 1: Sebaran Probabilitas & Ambang T
                    </Typography>
                    <svg width="100%" height="200" viewBox="0 0 320 180">
                        {/* Negative class curve (left bell) */}
                        <path d="M 20 150 Q 85 25 150 150" fill="rgba(124, 92, 252, 0.18)" stroke="#7C5CFC" strokeWidth="2" />
                        <text x="60" y="70" fill="#9B82FD" fontSize="9" fontFamily="var(--font-mono)">Kelas 0 (Negatif)</text>

                        {/* Positive class curve (right bell) */}
                        <path d="M 130 150 Q 210 25 290 150" fill="rgba(0, 245, 155, 0.18)" stroke="#00F59B" strokeWidth="2" />
                        <text x="200" y="70" fill="#00F59B" fontSize="9" fontFamily="var(--font-mono)">Kelas 1 (Positif)</text>

                        {/* Base axis */}
                        <line x1="15" y1="150" x2="305" y2="150" stroke={designTokens.line} strokeWidth="1" />

                        {/* Dynamic threshold vertical bar */}
                        {(() => {
                            const barX = 20 + threshold * 270;
                            return (
                                <>
                                    <line x1={barX} y1="20" x2={barX} y2="155" stroke="#FFB224" strokeWidth="2.5" strokeDasharray="3 3" />
                                    <circle cx={barX} cy="20" r="4.5" fill="#FFB224" />
                                    <text x={barX - 16} y="14" fill="#FFB224" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
                                        T={threshold.toFixed(2)}
                                    </text>
                                </>
                            );
                        })()}
                    </svg>
                </Box>

                {/* Viewport 2: ROC Curve with Operating Point (FPR, TPR) */}
                <Box sx={visualSandboxStyles.viewportCard}>
                    <Typography sx={visualSandboxStyles.viewportHeader}>
                        Viewport 2: Kurva ROC (AUC ≈ 0.91)
                    </Typography>
                    <svg width="100%" height="200" viewBox="0 0 320 180">
                        {/* Axes */}
                        <line x1="40" y1="20" x2="40" y2="150" stroke={designTokens.line} strokeWidth="1" />
                        <line x1="40" y1="150" x2="290" y2="150" stroke={designTokens.line} strokeWidth="1" />
                        <text x="130" y="168" fill={designTokens.dim} fontSize="8.5" fontFamily="var(--font-mono)">FPR (False Positive)</text>
                        <text x="8" y="24" fill={designTokens.dim} fontSize="8.5" fontFamily="var(--font-mono)">TPR</text>

                        {/* Diagonal baseline */}
                        <line x1="40" y1="150" x2="280" y2="20" stroke={designTokens.line} strokeWidth="1" strokeDasharray="2 2" />

                        {/* ROC curve */}
                        <path d="M 40 150 Q 55 35 280 20" fill="none" stroke="#7C5CFC" strokeWidth="2.5" />

                        {/* Active operating point */}
                        {(() => {
                            const ptX = 40 + fpr * 240;
                            const ptY = 150 - tpr * 130;
                            return (
                                <>
                                    <circle cx={ptX} cy={ptY} r="6" fill="#00F59B" stroke={designTokens.panel} strokeWidth="2" />
                                    <text x={ptX + 8} y={ptY - 4} fill="#00F59B" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
                                        ({fpr.toFixed(2)}, {tpr.toFixed(2)})
                                    </text>
                                </>
                            );
                        })()}
                    </svg>
                </Box>
            </Box>

            {/* Confusion Matrix Interactive Grid */}
            <Box sx={{ p: 2, borderRadius: "8px", backgroundColor: designTokens.panelAlt, border: `1px solid ${designTokens.line}` }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: designTokens.mute, textTransform: "uppercase", mb: 1.5, letterSpacing: "0.04em" }}>
                    Matriks Kebingungan (Confusion Matrix) — Total 120 Sampel Uji
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" }, gap: 1.5 }}>
                    <Box sx={{ p: 1.5, borderRadius: "6px", backgroundColor: "rgba(0, 245, 155, 0.1)", border: "1px solid rgba(0, 245, 155, 0.3)", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#00F59B", fontWeight: 600 }}>True Positive (TP)</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: designTokens.text, fontFamily: "var(--font-mono)" }}>{tp}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: "6px", backgroundColor: "rgba(255, 77, 109, 0.1)", border: "1px solid rgba(255, 77, 109, 0.3)", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#FF4D6D", fontWeight: 600 }}>False Positive (FP)</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: designTokens.text, fontFamily: "var(--font-mono)" }}>{fp}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: "6px", backgroundColor: "rgba(255, 77, 109, 0.1)", border: "1px solid rgba(255, 77, 109, 0.3)", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#FF4D6D", fontWeight: 600 }}>False Negative (FN)</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: designTokens.text, fontFamily: "var(--font-mono)" }}>{fn}</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, borderRadius: "6px", backgroundColor: "rgba(124, 92, 252, 0.1)", border: "1px solid rgba(124, 92, 252, 0.3)", textAlign: "center" }}>
                        <Typography sx={{ fontSize: "0.7rem", color: "#9B82FD", fontWeight: 600 }}>True Negative (TN)</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: designTokens.text, fontFamily: "var(--font-mono)" }}>{tn}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={visualSandboxStyles.metricsSummaryRow}>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Akurasi Global</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{(accuracy * 100).toFixed(1)}%</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>Presisi (Precision)</Typography>
                    <Typography sx={visualSandboxStyles.metricValue}>{(precision * 100).toFixed(1)}%</Typography>
                </Box>
                <Box sx={visualSandboxStyles.metricBox}>
                    <Typography sx={visualSandboxStyles.metricLabel}>F1-Score Harmonik</Typography>
                    <Typography sx={{ ...visualSandboxStyles.metricValue, color: "#7C5CFC" }}>{f1.toFixed(3)}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
