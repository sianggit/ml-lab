"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconComponent from "@/shared/components/icon";
import { InferredColumnType } from "@/utils/csv-parser";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { designTokens } from "@/config/theme";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

export default function DatasetOverviewPanel() {
    const {
        customDataset,
        columnTypeOverrides,
        overrideColumnType,
        clearCustomDataset,
    } = useCustomDatasetStore();

    if (!customDataset) return null;

    const totalCells = customDataset.rowCount * customDataset.columnCount;
    const totalMissingCells = customDataset.columns.reduce(
        (acc, col) => acc + col.missingCount,
        0
    );
    const overallMissingPercent =
        totalCells > 0 ? ((totalMissingCells / totalCells) * 100).toFixed(1) : "0";

    const warnings: string[] = [];
    if (parseFloat(overallMissingPercent) > 20) {
        warnings.push(`Tingkat missing values keseluruhan relatif tinggi (${overallMissingPercent}%). Pertimbangkan strategi imputasi atau pembersihan data.`);
    }

    const idCols = customDataset.columns.filter((c) => c.isSuggestedId);
    if (idCols.length > 0) {
        warnings.push(`Kolom ${idCols.map((c) => `"${c.name}"`).join(", ")} terdeteksi sebagai Identifier (ID / Index). Sebaiknya kecualikan dari fitur pelatihan model.`);
    }

    const constantCols = customDataset.columns.filter((c) => c.uniqueCount === 1);
    if (constantCols.length > 0) {
        warnings.push(`Kolom ${constantCols.map((c) => `"${c.name}"`).join(", ")} hanya memiliki 1 nilai unik (konstan) dan tidak memberikan informasi pembeda.`);
    }

    return (
        <Box sx={customDatasetStudioStyles.panelCard}>
            <Box sx={customDatasetStudioStyles.cardHeader}>
                <Box sx={customDatasetStudioStyles.cardTitle}>
                    <IconComponent name="database" size={20} color={designTokens.cyan} />
                    <span>Profil & Ringkasan Dataset: {customDataset.filename}</span>
                </Box>
                <Button
                    size="small"
                    onClick={clearCustomDataset}
                    sx={{
                        ...customDatasetStudioStyles.actionBtn,
                        ...customDatasetStudioStyles.btnDanger,
                        fontSize: "0.78rem",
                        py: "4px",
                        px: "10px",
                    }}
                >
                    <IconComponent name="trash" size={14} />
                    Hapus Dataset
                </Button>
            </Box>

            {/* Quick Metrics Grid */}
            <Box sx={customDatasetStudioStyles.statsGrid}>
                <Box sx={customDatasetStudioStyles.statItem}>
                    <Box sx={customDatasetStudioStyles.statVal}>
                        {customDataset.rowCount.toLocaleString()}
                    </Box>
                    <Box sx={customDatasetStudioStyles.statLabel}>Total Baris</Box>
                </Box>
                <Box sx={customDatasetStudioStyles.statItem}>
                    <Box sx={customDatasetStudioStyles.statVal}>{customDataset.columnCount}</Box>
                    <Box sx={customDatasetStudioStyles.statLabel}>Total Kolom</Box>
                </Box>
                <Box sx={customDatasetStudioStyles.statItem}>
                    <Box
                        sx={{
                            ...customDatasetStudioStyles.statVal,
                            color: parseFloat(overallMissingPercent) > 0 ? "#f59e0b" : "#4ade80",
                        }}
                    >
                        {overallMissingPercent}%
                    </Box>
                    <Box sx={customDatasetStudioStyles.statLabel}>
                        Missing ({totalMissingCells.toLocaleString()})
                    </Box>
                </Box>
                <Box sx={customDatasetStudioStyles.statItem}>
                    <Box sx={customDatasetStudioStyles.statVal}>
                        {customDataset.columns.filter((c) => c.inferredType === "numeric").length} /{" "}
                        {customDataset.columns.filter((c) => c.inferredType === "categorical").length}
                    </Box>
                    <Box sx={customDatasetStudioStyles.statLabel}>Numerik / Kategorikal</Box>
                </Box>
            </Box>

            {/* Warnings Alert */}
            {warnings.map((w, idx) => (
                <Box key={idx} sx={customDatasetStudioStyles.warningAlert}>
                    <IconComponent name="alert-triangle" size={18} color="#fde047" />
                    <Box>{w}</Box>
                </Box>
            ))}

            {/* Columns Schema & Type Override Table */}
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: designTokens.text, mb: 1.5 }}>
                Struktur Kolom & Penyesuaian Tipe Data:
            </Typography>

            <Box sx={customDatasetStudioStyles.tableContainer}>
                <Box component="table" sx={customDatasetStudioStyles.table}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th">Nama Kolom</Box>
                            <Box component="th">Tipe Terdeteksi</Box>
                            <Box component="th">Koreksi Tipe</Box>
                            <Box component="th">Missing (%)</Box>
                            <Box component="th">Nilai Unik</Box>
                            <Box component="th">Statistik Dasar (Min / Max / Mean / Std)</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {customDataset.columns.map((col) => {
                            const effectiveType =
                                columnTypeOverrides[col.name] || col.inferredType;

                            return (
                                <Box component="tr" key={col.name}>
                                    <Box component="td">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography
                                                component="span"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: col.isSuggestedTarget ? designTokens.cyan : designTokens.text,
                                                }}
                                            >
                                                {col.name}
                                            </Typography>
                                            {col.isSuggestedTarget && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontSize: "0.65rem",
                                                        px: "6px",
                                                        py: "1px",
                                                        borderRadius: "4px",
                                                        backgroundColor: designTokens.cyanBg,
                                                        color: designTokens.cyan,
                                                    }}
                                                >
                                                    Kandidat Target
                                                </Box>
                                            )}
                                            {col.isSuggestedId && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontSize: "0.65rem",
                                                        px: "6px",
                                                        py: "1px",
                                                        borderRadius: "4px",
                                                        backgroundColor: "rgba(234, 179, 8, 0.15)",
                                                        color: "#d97706",
                                                    }}
                                                >
                                                    ID/Index
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box component="td">
                                        <Box sx={customDatasetStudioStyles.chipBadge(col.inferredType)}>
                                            {col.inferredType}
                                        </Box>
                                    </Box>
                                    <Box component="td">
                                        <Select
                                            size="small"
                                            value={effectiveType}
                                            onChange={(e) =>
                                                overrideColumnType(
                                                    col.name,
                                                    e.target.value as InferredColumnType
                                                )
                                            }
                                            sx={{
                                                height: 28,
                                                fontSize: "0.75rem",
                                                color: designTokens.text,
                                                backgroundColor: designTokens.panel,
                                                border: `1px solid ${designTokens.line}`,
                                                "& .MuiSvgIcon-root": { color: designTokens.dim },
                                            }}
                                        >
                                            <MenuItem value="numeric">numeric</MenuItem>
                                            <MenuItem value="categorical">categorical</MenuItem>
                                            <MenuItem value="boolean">boolean</MenuItem>
                                            <MenuItem value="datetime">datetime</MenuItem>
                                        </Select>
                                    </Box>
                                    <Box component="td">
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: col.missingCount > 0 ? "#f59e0b" : designTokens.dim,
                                            }}
                                        >
                                            {col.missingCount} ({col.missingPercent.toFixed(1)}%)
                                        </Typography>
                                    </Box>
                                    <Box component="td">
                                        {col.uniqueCount !== undefined ? col.uniqueCount : "-"}
                                    </Box>
                                    <Box component="td">
                                        {col.stats && col.stats.min !== undefined && col.stats.max !== undefined && col.stats.mean !== undefined && col.stats.std !== undefined ? (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: "0.75rem", color: designTokens.mute }}
                                            >
                                                Min: {col.stats.min.toFixed(2)} · Max:{" "}
                                                {col.stats.max.toFixed(2)} · μ:{" "}
                                                {col.stats.mean.toFixed(2)} · σ:{" "}
                                                {col.stats.std.toFixed(2)}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                component="span"
                                                sx={{ fontSize: "0.75rem", color: designTokens.dim }}
                                            >
                                                N/A (kategorikal)
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
