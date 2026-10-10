"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconComponent from "@/shared/components/icon";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

const PAGE_SIZE = 10;

export default function DatasetPreviewTable() {
    const { customDataset } = useCustomDatasetStore();
    const [page, setPage] = useState(0);

    if (!customDataset || customDataset.rows.length === 0) return null;

    const totalPages = Math.ceil(customDataset.rows.length / PAGE_SIZE);
    const displayedRows = customDataset.rows.slice(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE
    );

    return (
        <Box sx={customDatasetStudioStyles.panelCard}>
            <Box sx={customDatasetStudioStyles.cardHeader}>
                <Box sx={customDatasetStudioStyles.cardTitle}>
                    <IconComponent name="table" size={20} color="#38bdf8" />
                    <span>Pratinjau Data Sampel ({customDataset.rows.length} baris dimuat di memori)</span>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        size="small"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        sx={{
                            ...customDatasetStudioStyles.actionBtn,
                            ...customDatasetStudioStyles.btnSecondary,
                            py: "3px",
                            px: "8px",
                            fontSize: "0.75rem",
                        }}
                    >
                        <IconComponent name="arrow-left" size={14} />
                        Sebelumnya
                    </Button>
                    <Typography
                        variant="caption"
                        sx={{ color: "#94a3b8", fontFamily: "var(--font-mono)" }}
                    >
                        Hal {page + 1} dari {totalPages}
                    </Typography>
                    <Button
                        size="small"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        sx={{
                            ...customDatasetStudioStyles.actionBtn,
                            ...customDatasetStudioStyles.btnSecondary,
                            py: "3px",
                            px: "8px",
                            fontSize: "0.75rem",
                        }}
                    >
                        Selanjutnya
                        <IconComponent name="arrow-right" size={14} />
                    </Button>
                </Box>
            </Box>

            <Box sx={customDatasetStudioStyles.tableContainer}>
                <Box component="table" sx={customDatasetStudioStyles.table}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={{ width: 40, color: "#64748b" }}>
                                #
                            </Box>
                            {customDataset.columns.map((col) => (
                                <Box component="th" key={col.name}>
                                    {col.name}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {displayedRows.map((row: Record<string, string>, rowIdx: number) => {
                            const globalRowNumber = page * PAGE_SIZE + rowIdx + 1;
                            return (
                                <Box component="tr" key={globalRowNumber}>
                                    <Box
                                        component="td"
                                        sx={{ color: "#64748b", fontWeight: 600 }}
                                    >
                                        {globalRowNumber}
                                    </Box>
                                    {customDataset.columns.map((col) => {
                                        const cellVal = row[col.name];
                                        const isEmpty =
                                            cellVal === null ||
                                            cellVal === undefined ||
                                            cellVal === "";

                                        return (
                                            <Box component="td" key={col.name}>
                                                {isEmpty ? (
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            color: "#f59e0b",
                                                            fontStyle: "italic",
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        null
                                                    </Typography>
                                                ) : (
                                                    // Render safely as plain string text
                                                    String(cellVal)
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
