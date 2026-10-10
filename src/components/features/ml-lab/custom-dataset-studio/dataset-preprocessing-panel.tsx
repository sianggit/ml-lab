"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import IconComponent from "@/shared/components/icon";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

export default function DatasetPreprocessingPanel() {
    const {
        customDataset,
        taskType,
        targetColumn,
        selectedFeatures,
        preprocessing,
        setTargetColumn,
        toggleFeature,
        selectAllFeatures,
        deselectAllFeatures,
        updatePreprocessing,
    } = useCustomDatasetStore();

    if (!customDataset) return null;

    const availableColumns = customDataset.columns;

    return (
        <Box sx={customDatasetStudioStyles.panelCard}>
            <Box sx={customDatasetStudioStyles.cardHeader}>
                <Box sx={customDatasetStudioStyles.cardTitle}>
                    <IconComponent name="sliders" size={20} color="#38bdf8" />
                    <span>Konfigurasi Pra-pemrosesan Data</span>
                </Box>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Pipelines dipasang secara otomatis mencegah Data Leakage
                </Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                {/* Left Column: Target & Features Selection */}
                <Box>
                    {taskType !== "clustering" && (
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", mb: 1 }}>
                                Kolom Target (Variabel Dependen / Label y):
                            </Typography>
                            <Select
                                fullWidth
                                size="small"
                                value={targetColumn}
                                onChange={(e) => setTargetColumn(e.target.value)}
                                sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.12)",
                                    color: "#38bdf8",
                                    fontWeight: 600,
                                    "& .MuiSvgIcon-root": { color: "#94a3b8" },
                                }}
                            >
                                {availableColumns.map((col) => (
                                    <MenuItem key={col.name} value={col.name}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                            <span>{col.name}</span>
                                            <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: 8 }}>
                                                ({col.inferredType})
                                            </span>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography variant="caption" sx={{ color: "#94a3b8", mt: 0.5, display: "block" }}>
                                Target akan dieksklusikan dari fitur X dan tidak akan terkena skala normalisasi.
                            </Typography>
                        </Box>
                    )}

                    {/* Features Selection */}
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9" }}>
                                Fitur Prediktor Terpilih (X) — ({selectedFeatures.length} dipilih):
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    onClick={selectAllFeatures}
                                    sx={{ fontSize: "0.72rem", color: "#38bdf8", p: 0, textTransform: "none" }}
                                >
                                    Pilih Semua
                                </Button>
                                <Typography sx={{ color: "#64748b" }}>·</Typography>
                                <Button
                                    size="small"
                                    onClick={deselectAllFeatures}
                                    sx={{ fontSize: "0.72rem", color: "#f87171", p: 0, textTransform: "none" }}
                                >
                                    Batalkan Semua
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                maxHeight: 200,
                                overflowY: "auto",
                                p: 1.5,
                                borderRadius: "6px",
                                backgroundColor: "rgba(10, 13, 18, 0.7)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                            }}
                        >
                            {availableColumns
                                .filter((c) => c.name !== targetColumn)
                                .map((col) => {
                                    const isChecked = selectedFeatures.includes(col.name);
                                    return (
                                        <Box
                                            key={col.name}
                                            onClick={() => toggleFeature(col.name)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                backgroundColor: isChecked ? "rgba(56, 189, 248, 0.08)" : "transparent",
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={isChecked}
                                                    sx={{ p: 0, color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#38bdf8" } }}
                                                />
                                                <Typography sx={{ fontSize: "0.82rem", color: isChecked ? "#f1f5f9" : "#94a3b8" }}>
                                                    {col.name}
                                                </Typography>
                                            </Box>
                                            <Box sx={customDatasetStudioStyles.chipBadge(col.inferredType)}>
                                                {col.inferredType}
                                            </Box>
                                        </Box>
                                    );
                                })}
                        </Box>
                    </Box>
                </Box>

                {/* Right Column: Preprocessing Transformations */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    {/* Missing Value Strategy */}
                    <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", mb: 0.8 }}>
                            Penanganan Nilai Hilang (Missing Values):
                        </Typography>
                        <Select
                            fullWidth
                            size="small"
                            value={preprocessing.missingStrategy}
                            onChange={(e) =>
                                updatePreprocessing({
                                    missingStrategy: e.target.value as typeof preprocessing.missingStrategy,
                                })
                            }
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                color: "#f1f5f9",
                                fontSize: "0.82rem",
                                "& .MuiSvgIcon-root": { color: "#94a3b8" },
                            }}
                        >
                            <MenuItem value="impute_mean_mode">Imputasi Mean (Numerik) & Modus (Kategorikal)</MenuItem>
                            <MenuItem value="impute_median_mode">Imputasi Median (Numerik) & Modus (Kategorikal)</MenuItem>
                            <MenuItem value="drop_rows">Hapus Baris yang Mengandung Nilai Hilang (Drop NA)</MenuItem>
                            <MenuItem value="none">Tanpa Imputasi (Gunakan Nilai Asli)</MenuItem>
                        </Select>
                    </Box>

                    {/* Scaling Method */}
                    <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", mb: 0.8 }}>
                            Skalisasi Fitur Numerik (Feature Scaling):
                        </Typography>
                        <Select
                            fullWidth
                            size="small"
                            value={preprocessing.scaling}
                            onChange={(e) =>
                                updatePreprocessing({
                                    scaling: e.target.value as typeof preprocessing.scaling,
                                })
                            }
                            sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                color: "#f1f5f9",
                                fontSize: "0.82rem",
                                "& .MuiSvgIcon-root": { color: "#94a3b8" },
                            }}
                        >
                            <MenuItem value="standard">StandardScaler (Rata-rata 0, Variansi 1)</MenuItem>
                            <MenuItem value="minmax">MinMaxScaler (Rentang Nilai 0 sampai 1)</MenuItem>
                            <MenuItem value="none">Tanpa Scaling (Raw Values)</MenuItem>
                        </Select>
                    </Box>

                    {/* Checkboxes: Categorical Encoding & Deduplication */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={preprocessing.encodeCategorical}
                                    onChange={(e) => updatePreprocessing({ encodeCategorical: e.target.checked })}
                                    sx={{ color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#38bdf8" } }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: "0.82rem", color: "#e2e8f0" }}>
                                    Encode fitur kategorikal teks (One-Hot Encoding via pd.get_dummies)
                                </Typography>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={preprocessing.removeDuplicates}
                                    onChange={(e) => updatePreprocessing({ removeDuplicates: e.target.checked })}
                                    sx={{ color: "rgba(255, 255, 255, 0.3)", "&.Mui-checked": { color: "#38bdf8" } }}
                                />
                            }
                            label={
                                <Typography sx={{ fontSize: "0.82rem", color: "#e2e8f0" }}>
                                    Hapus duplikasi baris data (Drop duplicate rows)
                                </Typography>
                            }
                        />
                    </Box>

                    {/* Train/Test Split Slider */}
                    {taskType !== "clustering" && (
                        <Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography sx={{ fontSize: "0.82rem", color: "#e2e8f0" }}>
                                    Porsi Pembagian Data Uji (Test Split):
                                </Typography>
                                <Typography sx={{ fontSize: "0.82rem", color: "#38bdf8", fontWeight: 600 }}>
                                    {Math.round(preprocessing.testSize * 100)}% Data Uji /{" "}
                                    {Math.round((1 - preprocessing.testSize) * 100)}% Data Latih
                                </Typography>
                            </Box>
                            <Slider
                                size="small"
                                min={0.1}
                                max={0.4}
                                step={0.05}
                                value={preprocessing.testSize}
                                onChange={(_, val) => updatePreprocessing({ testSize: val as number })}
                                sx={{ color: "#38bdf8" }}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
