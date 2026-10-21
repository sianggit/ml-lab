"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconComponent from "@/shared/components/icon";
import { parseCSV } from "@/utils/csv-parser";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { designTokens } from "@/config/theme";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB limit

interface DatasetUploaderProps {
    onUploadSuccess?: () => void;
}

export default function DatasetUploader({ onUploadSuccess }: DatasetUploaderProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { setCustomDataset } = useCustomDatasetStore();

    const processFile = async (file: File) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setErrorMessage("Format file tidak didukung. Mohon unggah file dengan format .csv (Kaggle).");
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setErrorMessage(
                `Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimum 15 MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            const fileText = await file.text();

            if (!fileText.trim()) {
                setErrorMessage("File CSV kosong atau tidak memiliki data.");
                setIsLoading(false);
                return;
            }

            const parsed = parseCSV(fileText, {
                filename: file.name,
                maxRowsToParse: 50000,
            });

            if (parsed.columns.length === 0 || parsed.rowCount === 0) {
                setErrorMessage("Gagal membaca struktur kolom atau baris pada file CSV ini.");
                setIsLoading(false);
                return;
            }

            // Save to in-memory store
            setCustomDataset(parsed, fileText);
            setSuccessMessage(
                `Berhasil memuat "${file.name}" (${parsed.rowCount.toLocaleString()} baris, ${parsed.columnCount} kolom).`
            );

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMessage(`Kesalahan saat memproses file CSV: ${msg}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            processFile(file);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            processFile(file);
        }
    };

    return (
        <Box sx={customDatasetStudioStyles.panelCard}>
            <Box sx={customDatasetStudioStyles.cardHeader}>
                <Box sx={customDatasetStudioStyles.cardTitle}>
                    <IconComponent name="upload" size={20} color={designTokens.cyan} />
                    <span>Unggah Dataset Kustom (CSV)</span>
                </Box>
                <Typography variant="caption" sx={{ color: designTokens.mute, fontFamily: designTokens.fontMono }}>
                    Maks. 15 MB · Format RFC 4180 / Kaggle
                </Typography>
            </Box>

            {errorMessage && (
                <Box sx={customDatasetStudioStyles.errorAlert}>
                    <IconComponent name="alert-triangle" size={18} color="#fca5a5" />
                    <Box>{errorMessage}</Box>
                </Box>
            )}

            {successMessage && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        p: "12px 16px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "1px solid rgba(34, 197, 94, 0.25)",
                        color: designTokens.acc,
                        fontSize: "0.85rem",
                        mb: "16px",
                    }}
                >
                    <IconComponent name="check" size={18} color={designTokens.acc} />
                    <Box>{successMessage}</Box>
                </Box>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: "none" }}
                onChange={handleFileInputChange}
            />

            <Box
                sx={customDatasetStudioStyles.dropzone(isDragActive)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isLoading && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        fileInputRef.current?.click();
                    }
                }}
            >
                {isLoading ? (
                    <Box sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <CircularProgress size={36} sx={{ color: designTokens.cyan }} />
                        <Typography sx={{ color: designTokens.dim, fontSize: "0.9rem" }}>
                            Mem-parsing CSV & mengevaluasi profil kolom...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box sx={customDatasetStudioStyles.uploadIconWrap}>
                            <IconComponent name="upload" size={26} color={designTokens.cyan} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: designTokens.text, mb: 0.5, fontSize: "1rem" }}>
                            Tarik dan lepas file dataset CSV di sini
                        </Typography>
                        <Typography sx={{ color: designTokens.mute, fontSize: "0.82rem", mb: 2 }}>
                            atau klik untuk memilih file dari komputer Anda
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: designTokens.line,
                                color: designTokens.cyan,
                                textTransform: "none",
                                fontSize: "0.8rem",
                                px: 2,
                                "&:hover": {
                                    borderColor: designTokens.cyan,
                                    backgroundColor: designTokens.cyanBg,
                                },
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                        >
                            <IconComponent name="search" size={14} style={{ marginRight: 6 }} />
                            Pilih File CSV
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
}
