"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import AppModal from "@/shared/components/modal";
import { ML_CHAPTERS } from "@/consts/ml-chapters.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import IconComponent from "@/shared/components/icon";
import { printReportToPDF } from "@/utils/pdf-report-generator";
import { reportExportModalStyles } from "./report-export-modal.styles";

export interface ReportExportModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ReportExportModal({ open, onClose }: ReportExportModalProps) {
    const { studentInfo, setStudentInfo, chapterProgress, totalXp } = useMlLabStore();
    const { customDataset, taskType, modelType, targetColumn, selectedFeatures, preprocessing } =
        useCustomDatasetStore();

    const [name, setName] = useState(studentInfo.name || "Mahasiswa");
    const [studentId, setStudentId] = useState(studentInfo.studentId || "202343500001");
    const [classGroup, setClassGroup] = useState(studentInfo.classGroup || "S6X - Informatika");
    const [copied, setCopied] = useState(false);

    // Active format tab: "pdf" | "markdown"
    const [formatTab, setFormatTab] = useState<"pdf" | "markdown">("pdf");

    // Visual output option for PDF (MAX 1 Bab for performance)
    const [includeVisualOutput, setIncludeVisualOutput] = useState(true);
    const [selectedVisualBabNumber, setSelectedVisualBabNumber] = useState<number>(1);

    // Default select all 14 chapters
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
        ML_CHAPTERS.map((c) => c.slug)
    );

    const padNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const userLevel = Math.max(1, Math.floor(totalXp / 350) + 1);

    const handleToggleChapter = (slug: string) => {
        setSelectedSlugs((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    const handleSelectAll = () => {
        setSelectedSlugs(ML_CHAPTERS.map((c) => c.slug));
    };

    const handleSelectCompletedOnly = () => {
        const completed = ML_CHAPTERS.filter((c) => chapterProgress[c.slug]?.isCompleted).map(
            (c) => c.slug
        );
        setSelectedSlugs(completed);
    };

    // Filtered selected chapters objects
    const selectedChapterObjects = useMemo(() => {
        return ML_CHAPTERS.filter((c) => selectedSlugs.includes(c.slug));
    }, [selectedSlugs]);

    // Custom dataset experiment info
    const customDatasetInfo = useMemo(() => {
        if (!customDataset) return null;
        return {
            filename: customDataset.filename,
            rowCount: customDataset.rowCount,
            columnCount: customDataset.columnCount,
            taskType: taskType.toUpperCase(),
            modelType,
            targetColumn,
            selectedFeatures,
            preprocessingSummary: `Imputasi (${preprocessing.missingStrategy}), Normalisasi (${preprocessing.scaling}), Encoding (${preprocessing.encodeCategorical ? "One-Hot" : "None"}), Data Uji (${Math.round(preprocessing.testSize * 100)}%)`,
        };
    }, [customDataset, taskType, modelType, targetColumn, selectedFeatures, preprocessing]);

    // Generated markdown string
    const markdownContent = useMemo(() => {
        let report = `# Laporan Praktikum Machine Learning\n\n`;
        report += `- Nama: ${name}\n`;
        report += `- NIM: ${studentId}\n`;
        report += `- Kelas: ${classGroup}\n`;
        report += `- XP: ${totalXp} (Level ${userLevel})\n\n`;
        report += `## Portofolio Modul Praktikum\n\n`;

        if (selectedChapterObjects.length === 0) {
            report += `Tidak ada bab dipilih.\n`;
        } else {
            selectedChapterObjects.forEach((ch) => {
                const prog = chapterProgress[ch.slug];
                const status = prog?.isCompleted
                    ? "selesai"
                    : prog?.masteryPercent
                        ? `dikerjakan ${prog.masteryPercent}%`
                        : "belum dieksekusi";
                report += `- Bab ${padNumber(ch.number)}: ${ch.title} (${status})\n`;
            });
        }

        if (customDatasetInfo) {
            report += `\n## Eksperimen Dataset Kustom (CSV)\n\n`;
            report += `- **Nama File:** ${customDatasetInfo.filename}\n`;
            report += `- **Dimensi Data:** ${customDatasetInfo.rowCount.toLocaleString()} baris × ${customDatasetInfo.columnCount} kolom\n`;
            report += `- **Jenis Tugas ML:** ${customDatasetInfo.taskType}\n`;
            report += `- **Model Algoritma:** ${customDatasetInfo.modelType}\n`;
            if (customDatasetInfo.targetColumn) {
                report += `- **Variabel Target:** ${customDatasetInfo.targetColumn}\n`;
            }
            report += `- **Fitur Terpilih:** ${customDatasetInfo.selectedFeatures.join(", ") || "Semua"}\n`;
            report += `- **Pra-pemrosesan:** ${customDatasetInfo.preprocessingSummary}\n`;
        }

        return report;
    }, [name, studentId, classGroup, selectedChapterObjects, chapterProgress, totalXp, userLevel, customDatasetInfo]);

    const saveStudentProfile = () => {
        setStudentInfo({
            name: name.trim() || studentInfo.name,
            studentId: studentId.trim() || studentInfo.studentId,
            classGroup: classGroup.trim() || studentInfo.classGroup,
        });
    };

    const handleDownloadMarkdown = () => {
        saveStudentProfile();
        try {
            const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `laporan-${studentId.trim() || "praktikum"}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            // fallback
        }
    };

    const handlePrintPDF = () => {
        saveStudentProfile();
        printReportToPDF({
            studentInfo: {
                ...studentInfo,
                name: name.trim() || studentInfo.name,
                studentId: studentId.trim() || studentInfo.studentId,
                classGroup: classGroup.trim() || studentInfo.classGroup,
            },
            totalXp,
            userLevel,
            selectedChapters: selectedChapterObjects,
            chapterProgress,
            customDatasetInfo,
            visualBabNumber: includeVisualOutput ? selectedVisualBabNumber : null,
        });
    };

    const handleCopyText = () => {
        try {
            navigator.clipboard.writeText(markdownContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // copy fallback
        }
    };

    return (
        <AppModal open={open} onClose={onClose} maxWidth="md">
            <Box sx={reportExportModalStyles.container}>
                {/* Header */}
                <Box sx={reportExportModalStyles.header}>
                    <h2>Ekspor laporan praktikum</h2>
                    <p>
                        Buat dokumen portofolio praktikum resmi untuk dosen pembimbing (Format PDF & Markdown).
                    </p>
                </Box>

                {/* Format Tabs Switcher */}
                <Box sx={reportExportModalStyles.formatTabs}>
                    <Button
                        onClick={() => setFormatTab("pdf")}
                        sx={reportExportModalStyles.formatTab(formatTab === "pdf")}
                    >
                        <IconComponent name="file-pdf" size={16} />
                        <span>Dokumen Cetak / PDF</span>
                    </Button>
                    <Button
                        onClick={() => setFormatTab("markdown")}
                        sx={reportExportModalStyles.formatTab(formatTab === "markdown")}
                    >
                        <IconComponent name="file-text" size={16} />
                        <span>Markdown (.md)</span>
                    </Button>
                </Box>

                {/* Student Info Inputs in 3 columns */}
                <Box sx={reportExportModalStyles.f3}>
                    <Box component="label" sx={reportExportModalStyles.label}>
                        Nama
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={reportExportModalStyles.input}
                        />
                    </Box>
                    <Box component="label" sx={reportExportModalStyles.label}>
                        NIM
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            style={reportExportModalStyles.input}
                        />
                    </Box>
                    <Box component="label" sx={reportExportModalStyles.label}>
                        Kelas
                        <input
                            type="text"
                            value={classGroup}
                            onChange={(e) => setClassGroup(e.target.value)}
                            style={reportExportModalStyles.input}
                        />
                    </Box>
                </Box>

                {/* Chapter Checkbox Selection */}
                <Box>
                    <Box sx={reportExportModalStyles.selectionHead}>
                        <span>{selectedSlugs.length} bab dipilih untuk portofolio</span>
                        <Box sx={{ display: "flex", gap: "6px" }}>
                            <Button
                                type="button"
                                onClick={handleSelectAll}
                                sx={{ ...reportExportModalStyles.btn, ...reportExportModalStyles.btnSm }}
                            >
                                Pilih semua
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSelectCompletedOnly}
                                sx={{ ...reportExportModalStyles.btn, ...reportExportModalStyles.btnSm }}
                            >
                                Hanya selesai
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={reportExportModalStyles.chk}>
                        {ML_CHAPTERS.map((ch) => (
                            <Box component="label" key={ch.id} sx={reportExportModalStyles.chkLabel}>
                                <input
                                    type="checkbox"
                                    checked={selectedSlugs.includes(ch.slug)}
                                    onChange={() => handleToggleChapter(ch.slug)}
                                />
                                <span>
                                    Bab {padNumber(ch.number)}: {ch.title}
                                </span>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* Visual Output Option for PDF (Max 1 Bab for performance) */}
                {formatTab === "pdf" && (
                    <Box sx={reportExportModalStyles.visualCard}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={includeVisualOutput}
                                        onChange={(e) => setIncludeVisualOutput(e.target.checked)}
                                        size="small"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.3)",
                                            "&.Mui-checked": { color: "#38bdf8" },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: "0.86rem", fontWeight: 650, color: "#f8fafc" }}>
                                        Sertakan Output Visual / Grafik Simulasi dalam PDF
                                    </Typography>
                                }
                            />
                            <Box sx={reportExportModalStyles.badgeMax1}>
                                Maks. 1 Bab
                            </Box>
                        </Box>

                        {includeVisualOutput && (
                            <Box sx={{ pl: 4, display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                                    Pilih 1 bab yang ingin dilampirkan grafik simulasinya pada lembar PDF:
                                </Typography>
                                <Select
                                    size="small"
                                    value={selectedVisualBabNumber}
                                    onChange={(e) => setSelectedVisualBabNumber(Number(e.target.value))}
                                    sx={{
                                        maxWidth: 480,
                                        height: 36,
                                        backgroundColor: "#090B0E",
                                        color: "#38bdf8",
                                        fontSize: "0.82rem",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        "& .MuiSvgIcon-root": { color: "#94a3b8" },
                                    }}
                                >
                                    {selectedChapterObjects.map((ch) => {
                                        const hasPlot = !!chapterProgress[ch.slug]?.lastOutput?.plots?.length;
                                        return (
                                            <MenuItem key={ch.id} value={ch.number}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                                    <span>Bab {padNumber(ch.number)}: {ch.title}</span>
                                                    <span style={{ fontSize: "0.72rem", color: hasPlot ? "#4ade80" : "#94a3b8", marginLeft: 8 }}>
                                                        {hasPlot ? "● Plot Siap" : "○ Visual Twin"}
                                                    </span>
                                                </Box>
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Preview Section */}
                {formatTab === "markdown" ? (
                    <Box component="label" sx={reportExportModalStyles.label}>
                        Pratinjau Markdown
                        <textarea
                            readOnly
                            value={markdownContent}
                            style={reportExportModalStyles.pv}
                            aria-label="Pratinjau laporan Markdown"
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            p: "12px 14px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(10, 13, 18, 0.6)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            fontSize: "0.82rem",
                            color: "#94a3b8",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0" }}>
                            📄 Ringkasan Berkas PDF yang Akan Dicetak:
                        </Typography>
                        <div>
                            • Kop Surat Resmi:{" "}
                            <b>
                                {studentInfo.university || "Institusi / Perguruan Tinggi"}
                                {studentInfo.faculty ? ` (${studentInfo.faculty})` : ""}
                            </b>
                        </div>
                        <div>• Portofolio Modul: <b>{selectedChapterObjects.length} Bab Terpilih</b> (Status, Nilai Mastery, XP)</div>
                        {customDatasetInfo && (
                            <div>• Dataset Kustom: <b>{customDatasetInfo.filename}</b> ({customDatasetInfo.rowCount} baris, {customDatasetInfo.modelType})</div>
                        )}
                        <div>
                            • Lampiran Visual:{" "}
                            {includeVisualOutput ? (
                                <b style={{ color: "#38bdf8" }}>
                                    Bab {padNumber(selectedVisualBabNumber)}: {ML_CHAPTERS.find((c) => c.number === selectedVisualBabNumber)?.title || ""}
                                </b>
                            ) : (
                                "Tidak disertakan"
                            )}
                        </div>
                    </Box>
                )}

                {/* Actions Footer */}
                <Box sx={reportExportModalStyles.acts}>
                    <Button
                        type="button"
                        onClick={onClose}
                        sx={reportExportModalStyles.btn}
                    >
                        Tutup
                    </Button>
                    <Button
                        type="button"
                        onClick={handleCopyText}
                        sx={reportExportModalStyles.btn}
                    >
                        {copied ? (
                            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                                <IconComponent name="check" size={14} /> Tersalin
                            </Box>
                        ) : (
                            "Salin teks"
                        )}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDownloadMarkdown}
                        sx={{ ...reportExportModalStyles.btn, ...reportExportModalStyles.btnGreen }}
                    >
                        <IconComponent name="download" size={15} />
                        Buat laporan (.md)
                    </Button>
                    <Button
                        type="button"
                        onClick={handlePrintPDF}
                        sx={{ ...reportExportModalStyles.btn, ...reportExportModalStyles.btnPdf }}
                    >
                        <IconComponent name="printer" size={16} />
                        Cetak / Ekspor PDF
                    </Button>
                </Box>
            </Box>
        </AppModal>
    );
}
