import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ExecutionOutput } from "@/models/ml-lab/chapter.model";

export interface StudentInfo {
    name: string;
    studentId: string; // NIM
    classGroup: string; // e.g., R6X / S6X
    faculty?: string;
    major?: string;
    university?: string;
}

export interface ChapterProgressItem {
    isCompleted: boolean;
    masteryPercent: number; // 25: Theory, 50: Sandbox, 75: Code, 100: Challenge Passed
    hasReadTheory?: boolean;
    hasTinkeredSandbox?: boolean;
    hasRanCode?: boolean;
    xpEarned: number;
    executedCode: string;
    lastOutput?: ExecutionOutput;
    timestamp: string;
}

export interface MlLabStoreState {
    studentInfo: StudentInfo;
    chapterProgress: Record<string, ChapterProgressItem>;
    totalXp: number;
    compileStreak: number;
    avgExecTimeMs: number;
    totalRuns: number;
    setStudentInfo: (info: Partial<StudentInfo>) => void;
    recordChapterStage: (
        chapterSlug: string,
        stage: "theory" | "sandbox"
    ) => void;
    recordChapterExecution: (
        chapterSlug: string,
        code: string,
        output: ExecutionOutput,
        xpBonus?: number
    ) => boolean;
    toggleChapterCompleted: (chapterSlug: string, xpBonus?: number) => boolean;
    resetProgress: () => void;
}

const DEFAULT_STUDENT_INFO: StudentInfo = {
    name: "Anggit Arisa Siwi Pratama",
    studentId: "202343570045",
    classGroup: "XC Ekstensi",
    faculty: "Fakultas Teknik dan Ilmu Komputer",
    major: "Teknik Informatika (S1)",
    university: "Universitas Indraprasta PGRI (UNINDRA)",
};

export const useMlLabStore = create<MlLabStoreState>()(
    persist(
        (set, get) => ({
            studentInfo: DEFAULT_STUDENT_INFO,
            chapterProgress: {},
            totalXp: 350,
            compileStreak: 3,
            avgExecTimeMs: 450,
            totalRuns: 3,

            setStudentInfo: (newInfo) => {
                set((state) => ({
                    studentInfo: { ...state.studentInfo, ...newInfo },
                }));
            },

            recordChapterStage: (chapterSlug, stage) => {
                const state = get();
                const existing = state.chapterProgress[chapterSlug] || {
                    isCompleted: false,
                    masteryPercent: 0,
                    xpEarned: 0,
                    executedCode: "",
                    timestamp: new Date().toISOString(),
                };

                let updatedMastery = existing.masteryPercent || 0;
                let bonusXp = 0;

                if (stage === "theory" && !existing.hasReadTheory) {
                    existing.hasReadTheory = true;
                    updatedMastery = Math.max(updatedMastery, 25);
                    bonusXp = 25;
                } else if (stage === "sandbox" && !existing.hasTinkeredSandbox) {
                    existing.hasTinkeredSandbox = true;
                    updatedMastery = Math.max(updatedMastery, 50);
                    bonusXp = 50;
                }

                if (bonusXp > 0) {
                    set({
                        totalXp: state.totalXp + bonusXp,
                        chapterProgress: {
                            ...state.chapterProgress,
                            [chapterSlug]: {
                                ...existing,
                                masteryPercent: updatedMastery,
                                xpEarned: existing.xpEarned + bonusXp,
                            },
                        },
                    });
                }
            },

            recordChapterExecution: (chapterSlug, code, output, xpBonus = 100) => {
                const state = get();
                const existing = state.chapterProgress[chapterSlug] || {
                    isCompleted: false,
                    masteryPercent: 0,
                    xpEarned: 0,
                    executedCode: "",
                    timestamp: new Date().toISOString(),
                };

                const isSuccess = output.status === "success";
                const isNewlyCompleted = !existing.isCompleted && isSuccess;
                const addedXp = isNewlyCompleted ? xpBonus : 0;

                const newStreak = isSuccess ? state.compileStreak + 1 : 0;
                const newTotalRuns = state.totalRuns + 1;
                const newAvgTime = Math.round(
                    (state.avgExecTimeMs * state.totalRuns + output.executionTime) / newTotalRuns
                );

                const newMastery = isSuccess ? 100 : Math.max(existing.masteryPercent || 0, 75);

                set({
                    totalXp: state.totalXp + addedXp,
                    compileStreak: newStreak,
                    avgExecTimeMs: newAvgTime,
                    totalRuns: newTotalRuns,
                    chapterProgress: {
                        ...state.chapterProgress,
                        [chapterSlug]: {
                            ...existing,
                            isCompleted: existing.isCompleted || isSuccess,
                            masteryPercent: newMastery,
                            hasRanCode: true,
                            xpEarned: existing.xpEarned + addedXp,
                            executedCode: code,
                            lastOutput: output,
                            timestamp: new Date().toISOString(),
                        },
                    },
                });

                return isNewlyCompleted;
            },

            toggleChapterCompleted: (chapterSlug, xpBonus = 100) => {
                const state = get();
                const existing = state.chapterProgress[chapterSlug] || {
                    isCompleted: false,
                    masteryPercent: 0,
                    xpEarned: 0,
                    executedCode: "",
                    timestamp: new Date().toISOString(),
                };

                const currentlyDone = !!existing.isCompleted;
                const nextDone = !currentlyDone;
                const xpDelta = nextDone ? xpBonus : -xpBonus;

                set({
                    totalXp: Math.max(0, state.totalXp + xpDelta),
                    chapterProgress: {
                        ...state.chapterProgress,
                        [chapterSlug]: {
                            ...existing,
                            isCompleted: nextDone,
                            masteryPercent: nextDone ? 100 : Math.min(existing.masteryPercent || 0, 75),
                            xpEarned: Math.max(0, (existing.xpEarned || 0) + xpDelta),
                            timestamp: new Date().toISOString(),
                        },
                    },
                });

                return nextDone;
            },

            resetProgress: () => {
                set({
                    chapterProgress: {},
                    totalXp: 350,
                    compileStreak: 0,
                    avgExecTimeMs: 0,
                    totalRuns: 0,
                });
            },
        }),
        {
            name: "ml_lab_portal_store",
            storage: createJSONStorage(() => {
                if (typeof window !== "undefined") {
                    return window.localStorage;
                }
                return {
                    getItem: () => null,
                    setItem: () => { },
                    removeItem: () => { },
                };
            }),
            skipHydration: true,
        }
    )
);
