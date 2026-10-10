"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import IconComponent from "@/shared/components/icon";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { pyodideBridge } from "@/services/ml-lab/pyodide-bridge.service";
import { MLTaskType, MLModelType } from "@/utils/ml-code-generator";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

interface DatasetModelRunnerProps {
    onApplyToSandbox?: (code: string) => void;
    onRunExperiment?: (code: string) => Promise<void>;
}

export default function DatasetModelRunner({
    onApplyToSandbox,
    onRunExperiment,
}: DatasetModelRunnerProps) {
    const {
        customDataset,
        rawCsvContent,
        taskType,
        modelType,
        targetColumn,
        selectedFeatures,
        generatedCode,
        setTaskType,
        setModelType,
    } = useCustomDatasetStore();

    const [isMounting, setIsMounting] = useState(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    if (!customDataset) return null;

    // Compatibility validation
    const validationErrors: string[] = [];
    if (customDataset.rowCount < 5) {
        validationErrors.push("Jumlah baris data terlalu sedikit (minimal 5 baris untuk pelatihan model).");
    }
    if (taskType !== "clustering" && !targetColumn) {
        validationErrors.push("Kolom target harus dipilih untuk task Supervised Learning.");
    }
    if (selectedFeatures.length === 0) {
        validationErrors.push("Pilih minimal 1 fitur prediktor (X) untuk menjalankan model.");
    }

    const isValid = validationErrors.length === 0;

    const handleApplyAndRun = async () => {
        if (!isValid || !rawCsvContent) return;

        setIsMounting(true);
        setActionMessage("Menyiapkan dataset ke dalam Pyodide virtual filesystem...");

        try {
            const filename = customDataset.filename || "custom_data.csv";
            // Mount the CSV text to Pyodide Emscripten Virtual File System
            await pyodideBridge.mountFile(filename, rawCsvContent);

            setActionMessage("Dataset berhasil dimuat ke kernel Python! Menjalankan eksperimen...");

            if (onApplyToSandbox) {
                onApplyToSandbox(generatedCode);
            }

            if (onRunExperiment) {
                await onRunExperiment(generatedCode);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setActionMessage(`Gagal memuat dataset: ${msg}`);
        } finally {
            setIsMounting(false);
        }
    };

    return (
        <Box sx={customDatasetStudioStyles.panelCard}>
            <Box sx={customDatasetStudioStyles.cardHeader}>
                <Box sx={customDatasetStudioStyles.cardTitle}>
                    <IconComponent name="zap" size={20} color="#38bdf8" />
                    <span>Konfigurasi Algoritma & Eksekusi Model</span>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Didukung: Scikit-learn · Pandas · NumPy
                </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, mb: 3 }}>
                {/* Task Type */}
                <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", mb: 0.8 }}>
                        Jenis Tugas Machine Learning:
                    </Typography>
                    <Select
                        fullWidth
                        size="small"
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value as MLTaskType)}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            color: "#f1f5f9",
                            fontSize: "0.82rem",
                            "& .MuiSvgIcon-root": { color: "#94a3b8" },
                        }}
                    >
                        <MenuItem value="classification">Klasifikasi (Supervised - Target Kategorikal)</MenuItem>
                        <MenuItem value="regression">Regresi (Supervised - Target Kontinu Numerik)</MenuItem>
                        <MenuItem value="clustering">Klastering (Unsupervised - Pengelompokan Data)</MenuItem>
                    </Select>
                </Box>

                {/* Model Algorithm */}
                <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", mb: 0.8 }}>
                        Algoritma Model Pembelajaran:
                    </Typography>
                    <Select
                        fullWidth
                        size="small"
                        value={modelType}
                        onChange={(e) => setModelType(e.target.value as MLModelType)}
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            color: "#f1f5f9",
                            fontSize: "0.82rem",
                            "& .MuiSvgIcon-root": { color: "#94a3b8" },
                        }}
                    >
                        {taskType === "classification" && (
                            <>
                                <MenuItem value="random_forest">Random Forest Classifier (Ensemble Trees)</MenuItem>
                                <MenuItem value="decision_tree">Decision Tree Classifier (Pohon Keputusan)</MenuItem>
                                <MenuItem value="logistic_regression">Logistic Regression (Linear Classification)</MenuItem>
                            </>
                        )}
                        {taskType === "regression" && (
                            <>
                                <MenuItem value="random_forest_regressor">Random Forest Regressor (Ensemble Trees)</MenuItem>
                                <MenuItem value="decision_tree">Decision Tree Regressor (Pohon Regresi)</MenuItem>
                                <MenuItem value="linear_regression">Linear Regression (Garis Tren)</MenuItem>
                            </>
                        )}
                        {taskType === "clustering" && (
                            <MenuItem value="kmeans">K-Means Clustering (Centroid-based)</MenuItem>
                        )}
                    </Select>
                </Box>
            </Box>

            {/* Validation Feedback */}
            {validationErrors.length > 0 && (
                <Box sx={customDatasetStudioStyles.warningAlert}>
                    <IconComponent name="alert-triangle" size={18} color="#fde047" />
                    <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", mb: 0.5 }}>
                            Konfigurasi Belum Lengkap:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {validationErrors.map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                        </ul>
                    </Box>
                </Box>
            )}

            {actionMessage && (
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: "6px",
                        backgroundColor: "rgba(56, 189, 248, 0.08)",
                        border: "1px solid rgba(56, 189, 248, 0.2)",
                        color: "#bae6fd",
                        fontSize: "0.82rem",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <IconComponent name="info" size={16} color="#38bdf8" />
                    <span>{actionMessage}</span>
                </Box>
            )}

            {/* Execution Buttons */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                <Button
                    variant="contained"
                    disabled={!isValid || isMounting}
                    onClick={handleApplyAndRun}
                    sx={{
                        ...customDatasetStudioStyles.actionBtn,
                        ...customDatasetStudioStyles.btnPrimary,
                        px: 3,
                        py: 1,
                    }}
                >
                    {isMounting ? (
                        <>
                            <CircularProgress size={16} sx={{ color: "#fff", mr: 1 }} />
                            Menyiapkan & Menjalankan...
                        </>
                    ) : (
                        <>
                            <IconComponent name="play" size={16} />
                            Jalankan Eksperimen pada Dataset Ini
                        </>
                    )}
                </Button>

                {onApplyToSandbox && (
                    <Button
                        variant="outlined"
                        disabled={!isValid || isMounting}
                        onClick={() => {
                            if (customDataset && rawCsvContent) {
                                pyodideBridge.mountFile(customDataset.filename, rawCsvContent);
                                onApplyToSandbox(generatedCode);
                            }
                        }}
                        sx={{
                            ...customDatasetStudioStyles.actionBtn,
                            ...customDatasetStudioStyles.btnSecondary,
                            py: 1,
                        }}
                    >
                        <IconComponent name="code" size={16} />
                        Tampilkan Kode di Monaco Editor
                    </Button>
                )}
            </Box>
        </Box>
    );
}
