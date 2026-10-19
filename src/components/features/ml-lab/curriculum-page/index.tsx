"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
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
        <Box sx={curriculumPageStyles.root}>
            <Box sx={curriculumPageStyles.bg} aria-hidden="true" />

            <Box component="main" sx={curriculumPageStyles.wrap} className="wrap">
                {/* ─── Hero Section ────────────────────────────────────────────── */}
                <Box sx={curriculumPageStyles.hero} className="hero">
                    <Box sx={curriculumPageStyles.eyebrow} className="eyebrow">
                        <b>Kurikulum</b>
                        <s />
                        <span>Lab Bab 01–14</span>
                    </Box>

                    <Box component="h1" sx={curriculumPageStyles.title}>
                        <span>Kurikulum</span>
                        <span className="g">laboratorium</span>
                    </Box>

                    <Box component="p" sx={curriculumPageStyles.lead} className="bio">
                        Empat fase dari fondasi numerik sampai produksi. <strong>Bab 01</strong> sudah lengkap; bab lain dapat dibuka dan dicoba di Sandbox.
                    </Box>

                    {/* ─── Stats Hairline Block ────────────────────────────────────── */}
                    <Box component="section" sx={curriculumPageStyles.stats} className="stats" aria-label="Ringkasan progres">
                        <Box sx={curriculumPageStyles.statsCol(true)}>
                            <Box component="label" sx={curriculumPageStyles.statsLabel}>Bab selesai</Box>
                            <Box component="b" sx={curriculumPageStyles.statsValue}>
                                {completedCount}<em> / {TOTAL_CHAPTERS}</em>
                            </Box>
                        </Box>
                        <Box sx={curriculumPageStyles.statsCol(false)}>
                            <Box component="label" sx={curriculumPageStyles.statsLabel}>Cakupan kurikulum</Box>
                            <Box component="b" sx={curriculumPageStyles.statsValue}>
                                {completionPercent}%
                            </Box>
                        </Box>
                        <Box sx={curriculumPageStyles.statsCol(false)}>
                            <Box component="label" sx={curriculumPageStyles.statsLabel}>Skor XP</Box>
                            <Box component="b" sx={curriculumPageStyles.statsValue}>
                                {totalXp}
                            </Box>
                            <Box component="span" sx={curriculumPageStyles.statsSub}>Level {userLevel}</Box>
                        </Box>
                    </Box>
                </Box>

                {/* ─── Curriculum Phases & BAB Rows ────────────────────────────── */}
                {PHASES.map((phase) => {
                    const phaseChapters = ML_CHAPTERS.filter(
                        (c) => c.number >= phase.startBab && c.number <= phase.endBab
                    );

                    const visiblePhaseChapters = phaseChapters.filter(
                        (c) => c.number <= visibleCount
                    );

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
                            <Box sx={curriculumPageStyles.phaseMeta} className="ph">
                                <Box component="label">
                                    BAB {padNumber(phase.startBab)}–{padNumber(phase.endBab)}
                                </Box>
                                <Box component="h2">{phase.title}</Box>
                                <Box component="p">{phase.description}</Box>
                            </Box>

                            <Box sx={curriculumPageStyles.rowsPanel} className="rows">
                                {visiblePhaseChapters.map((chapter) => {
                                    const prog = chapterProgress[chapter.slug];
                                    const isDone = !!prog?.isCompleted;
                                    const mastery = prog?.masteryPercent || (isDone ? 100 : 0);

                                    let statusText = "Belum dimulai";
                                    if (isDone) {
                                        statusText = "Selesai";
                                    } else if (mastery > 0) {
                                        statusText = `Dikerjakan ${mastery}%`;
                                    }

                                    return (
                                        <Box
                                            key={chapter.id}
                                            component={Link}
                                            href={`/ml-lab/${chapter.slug}`}
                                            sx={curriculumPageStyles.row}
                                            className="row"
                                        >
                                            <Box component="span" sx={curriculumPageStyles.rowNumber} className="n">
                                                {padNumber(chapter.number)}
                                            </Box>
                                            <Box sx={curriculumPageStyles.rowContent}>
                                                <Box component="h3">{chapter.title}</Box>
                                                <Box component="small">
                                                    {chapter.category} · {chapter.estimatedMinutes} menit
                                                </Box>
                                            </Box>
                                            <Box
                                                component="span"
                                                sx={curriculumPageStyles.status(isDone)}
                                                className="st"
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
                <Box sx={curriculumPageStyles.loadMoreContainer} className="more">
                    {hasMore ? (
                        <>
                            <Box
                                component="button"
                                onClick={handleLoadMore}
                                sx={curriculumPageStyles.loadMoreButton}
                                className="btn"
                                aria-label={`Muat lebih banyak bab. Saat ini menampilkan ${visibleCount} dari ${TOTAL_CHAPTERS} bab.`}
                            >
                                Muat lebih banyak bab (+{Math.min(LOAD_MORE_STEP, TOTAL_CHAPTERS - visibleCount)})
                            </Box>
                            <Box component="span" sx={curriculumPageStyles.loadMoreProgressText}>
                                Menampilkan {visibleCount} dari {TOTAL_CHAPTERS} bab kurikulum
                            </Box>
                        </>
                    ) : (
                        <Box sx={curriculumPageStyles.allLoadedBadge}>
                            <span>Menampilkan seluruh {TOTAL_CHAPTERS} bab kurikulum</span>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
