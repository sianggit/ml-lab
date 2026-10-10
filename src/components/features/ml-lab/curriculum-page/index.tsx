"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconComponent from "@/shared/components/icon";
import { ML_CHAPTERS } from "@/consts/ml-chapters.const";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { curriculumPageStyles } from "./curriculum-page.styles";

interface CurriculumPhase {
    title: string;
    description: string;
    startBab: number;
    endBab: number;
}

const PHASES: CurriculumPhase[] = [
    {
        title: "Fondasi & Preprocessing",
        description: "Numerik, manipulasi data, dan persiapan fitur.",
        startBab: 1,
        endBab: 3,
    },
    {
        title: "Supervised Learning",
        description: "Klasifikasi, evaluasi, dan model ensemble.",
        startBab: 4,
        endBab: 9,
    },
    {
        title: "Unsupervised Learning",
        description: "Clustering dan reduksi dimensi.",
        startBab: 10,
        endBab: 12,
    },
    {
        title: "Deep Learning & MLOps",
        description: "Jaringan saraf dan alur produksi.",
        startBab: 13,
        endBab: 14,
    },
];

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 4;
const TOTAL_CHAPTERS = ML_CHAPTERS.length; // 14

export default function CurriculumPage() {
    const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);
    const { chapterProgress, totalXp } = useMlLabStore();

    const completedCount = ML_CHAPTERS.filter(
        (c) => chapterProgress[c.slug]?.isCompleted
    ).length;
    const completionPercent = Math.round((completedCount / TOTAL_CHAPTERS) * 100);
    const userLevel = Math.max(1, Math.floor(totalXp / 350) + 1);

    const padNumber = (num: number) => (num < 10 ? `0${num}` : `${num}`);

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(TOTAL_CHAPTERS, prev + LOAD_MORE_STEP));
    };

    const hasMore = visibleCount < TOTAL_CHAPTERS;

    return (
        <Box sx={curriculumPageStyles.wrap} className="wrap">
            {/* ─── Header ────────────────────────────────────────────────────── */}
            <Box component="div" sx={curriculumPageStyles.chip} className="chip">
                <Box component="span" sx={curriculumPageStyles.dot} className="dot" />
                <span>Lab Bab 01–14</span>
            </Box>

            <Box component="h1" sx={curriculumPageStyles.title}>
                Kurikulum laboratorium
            </Box>

            <Box component="p" sx={curriculumPageStyles.lead} className="lead">
                Empat fase dari fondasi numerik sampai produksi. Bab 01 sudah lengkap; bab lain dapat
                dibuka dan dicoba di Sandbox.
            </Box>

            {/* ─── Telemetry Summary Strip ────────────────────────────────────── */}
            <Box component="ul" sx={curriculumPageStyles.tele} className="panel tele">
                <Box component="li" sx={curriculumPageStyles.teleItem(false)}>
                    <Box component="span" sx={curriculumPageStyles.teleValue} className="v">
                        {completedCount} / {TOTAL_CHAPTERS}
                    </Box>
                    <Box component="span" sx={curriculumPageStyles.teleKey} className="k">
                        Bab selesai
                    </Box>
                </Box>
                <Box component="li" sx={curriculumPageStyles.teleItem(true)}>
                    <Box component="span" sx={curriculumPageStyles.teleValue} className="v">
                        {completionPercent}%
                    </Box>
                    <Box component="span" sx={curriculumPageStyles.teleKey} className="k">
                        Tingkat kelulusan
                    </Box>
                </Box>
                <Box component="li" sx={curriculumPageStyles.teleItem(true)}>
                    <Box component="span" sx={curriculumPageStyles.teleValue} className="v">
                        {totalXp}
                    </Box>
                    <Box component="span" sx={curriculumPageStyles.teleKey} className="k">
                        Skor XP · Level {userLevel}
                    </Box>
                </Box>
            </Box>

            {/* ─── Curriculum Phases & BAB Cards ────────────────────────────── */}
            {PHASES.map((phase) => {
                // Chapters belonging to this phase
                const phaseChapters = ML_CHAPTERS.filter(
                    (c) => c.number >= phase.startBab && c.number <= phase.endBab
                );

                // Filter chapters that are currently revealed by the Load More mechanism
                const visiblePhaseChapters = phaseChapters.filter(
                    (c) => c.number <= visibleCount
                );

                // If no chapters in this phase are revealed yet, don't show the phase section
                if (visiblePhaseChapters.length === 0) {
                    return null;
                }

                return (
                    <Box
                        component="section"
                        key={phase.title}
                        sx={curriculumPageStyles.phaseSection}
                        className="phase"
                    >
                        <Box sx={curriculumPageStyles.phaseMeta}>
                            <Box component="span" sx={curriculumPageStyles.phaseBadge} className="rng">
                                BAB {padNumber(phase.startBab)}–{padNumber(phase.endBab)}
                            </Box>
                            <h2>{phase.title}</h2>
                            <p>{phase.description}</p>
                        </Box>

                        <Box sx={curriculumPageStyles.rowsPanel} className="panel rows">
                            {visiblePhaseChapters.map((chapter, idx) => {
                                const prog = chapterProgress[chapter.slug];
                                const isDone = !!prog?.isCompleted;
                                const mastery = prog?.masteryPercent || (isDone ? 100 : 0);

                                let statusType: "ok" | "on" | "muted" = "muted";
                                let statusText = "Belum dimulai";

                                if (isDone) {
                                    statusType = "ok";
                                    statusText = "Selesai";
                                } else if (mastery > 0) {
                                    statusType = "on";
                                    statusText = `Dikerjakan ${mastery}%`;
                                }

                                return (
                                    <Box
                                        key={chapter.id}
                                        component={Link}
                                        href={`/ml-lab/${chapter.slug}`}
                                        sx={curriculumPageStyles.row(idx === 0)}
                                        className="row"
                                    >
                                        <Box component="span" sx={curriculumPageStyles.rowNumber} className="n">
                                            {padNumber(chapter.number)}
                                        </Box>
                                        <Box sx={curriculumPageStyles.rowContent}>
                                            <h3>{chapter.title}</h3>
                                            <small>
                                                {chapter.category} · {chapter.estimatedMinutes} menit
                                            </small>
                                        </Box>
                                        <Box
                                            component="span"
                                            sx={curriculumPageStyles.status(statusType)}
                                            className={`st ${statusType === "ok" ? "ok" : statusType === "on" ? "on" : ""}`}
                                        >
                                            {statusText}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                );
            })}

            {/* ─── Functional Load More Progressive Disclosure ───────────────── */}
            <Box sx={curriculumPageStyles.loadMoreContainer}>
                {hasMore ? (
                    <>
                        <Button
                            onClick={handleLoadMore}
                            sx={curriculumPageStyles.loadMoreButton}
                            className="btn"
                            aria-label={`Muat lebih banyak bab. Saat ini menampilkan ${visibleCount} dari ${TOTAL_CHAPTERS} bab.`}
                        >
                            <IconComponent name="arrow-down" size={15} />
                            <span>Muat Lebih Banyak Bab (+{Math.min(LOAD_MORE_STEP, TOTAL_CHAPTERS - visibleCount)} Bab)</span>
                        </Button>
                        <Box component="span" sx={curriculumPageStyles.loadMoreProgressText}>
                            Menampilkan {visibleCount} dari {TOTAL_CHAPTERS} Bab Kurikulum
                        </Box>
                    </>
                ) : (
                    <Box sx={curriculumPageStyles.allLoadedBadge}>
                        <IconComponent name="check" size={16} />
                        <span>Seluruh {TOTAL_CHAPTERS} Bab Kurikulum Telah Ditampilkan</span>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
