"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ML_CHAPTERS } from "@/consts/ml-chapters.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import ReportExportModal from "@/components/features/ml-lab/report-export-modal";
import { reportPageStyles } from "./report-page.styles";

export default function ReportPage() {
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const { studentInfo, chapterProgress, totalXp } = useMlLabStore();

    const padNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const completedCount = ML_CHAPTERS.filter(
        (c) => chapterProgress[c.slug]?.isCompleted
    ).length;
    const completionPercent = Math.round((completedCount / ML_CHAPTERS.length) * 100);

    return (
        <Box sx={reportPageStyles.wrap} className="wrap">
            {/* ─── Head ──────────────────────────────────────────────────────── */}
            <Box sx={reportPageStyles.head} className="head">
                <Box>
                    <Box component="div" sx={reportPageStyles.chip} className="chip">
                        <Box component="span" sx={reportPageStyles.dot} className="dot" />
                        <span>Status: akademik aktif</span>
                    </Box>

                    <Box component="h1" sx={reportPageStyles.title}>
                        Laporan evaluasi praktikum
                    </Box>

                    <Box component="p" sx={reportPageStyles.lead} className="lead">
                        Praktikan: <b>{studentInfo.name || "Mahasiswa"}</b> (
                        {studentInfo.studentId || "202343500001"}) · Kelas{" "}
                        {studentInfo.classGroup || "S6X - Informatika"}
                    </Box>
                </Box>

                <Button
                    onClick={() => setExportModalOpen(true)}
                    sx={reportPageStyles.exportBtn}
                    className="btn btn-g"
                    id="e2"
                >
                    Ekspor laporan
                </Button>
            </Box>

            {/* ─── Telemetry Summary Strip ────────────────────────────────────── */}
            <Box component="ul" sx={reportPageStyles.tele} className="panel tele">
                <Box component="li" sx={reportPageStyles.teleItem(false)}>
                    <Box component="span" sx={reportPageStyles.teleValue} className="v">
                        {completedCount} / {ML_CHAPTERS.length}
                    </Box>
                    <Box component="span" sx={reportPageStyles.teleKey} className="k">
                        Modul diselesaikan
                    </Box>
                </Box>
                <Box component="li" sx={reportPageStyles.teleItem(true)}>
                    <Box component="span" sx={reportPageStyles.teleValue} className="v">
                        {completionPercent}%
                    </Box>
                    <Box component="span" sx={reportPageStyles.teleKey} className="k">
                        Tingkat kelulusan
                    </Box>
                </Box>
                <Box component="li" sx={reportPageStyles.teleItem(true)}>
                    <Box component="span" sx={reportPageStyles.teleValue} className="v">
                        {totalXp}
                    </Box>
                    <Box component="span" sx={reportPageStyles.teleKey} className="k">
                        Akumulasi XP
                    </Box>
                </Box>
            </Box>

            {/* ─── Chapters Rows Panel ────────────────────────────────────────── */}
            <Box sx={reportPageStyles.rowsPanel} className="panel rows">
                {ML_CHAPTERS.map((chapter, idx) => {
                    const prog = chapterProgress[chapter.slug];
                    const isDone = !!prog?.isCompleted;
                    const mastery = prog?.masteryPercent || (isDone ? 100 : 0);

                    let statusType: "ok" | "on" | "muted" = "muted";
                    let statusText = "Belum dieksekusi";

                    if (isDone) {
                        statusType = "ok";
                        statusText = "Selesai";
                    } else if (mastery > 0) {
                        statusType = "on";
                        statusText = `${mastery}%`;
                    }

                    return (
                        <Box
                            key={chapter.id}
                            component={Link}
                            href={`/ml-lab/${chapter.slug}`}
                            sx={reportPageStyles.row(idx === 0)}
                            className="row"
                        >
                            <Box component="span" sx={reportPageStyles.rowNumber} className="n">
                                BAB {padNumber(chapter.number)}
                            </Box>
                            <Box sx={reportPageStyles.rowContent}>
                                <h3>{chapter.title}</h3>
                                <small>
                                    {chapter.category} · {chapter.estimatedMinutes} menit
                                </small>
                            </Box>
                            <Box
                                component="span"
                                sx={reportPageStyles.status(statusType)}
                                className={`st ${statusType === "ok" ? "ok" : statusType === "on" ? "on" : ""}`}
                            >
                                {statusText}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* ─── Export Dialog ──────────────────────────────────────────────── */}
            <ReportExportModal
                open={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
            />
        </Box>
    );
}
