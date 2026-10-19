"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import ScrollableTabsRow from "@/shared/components/scrollable-tabs-row";
import { ML_ASSIGNMENTS } from "@/consts/ml-assignments.const";
import AssignmentHeader from "./assignment-header";
import Bab04Showcase from "./bab04-showcase";
import ChapterShowcaseView from "./chapter-showcase-view";
import UtsTasksShowcase from "./uts-tasks-showcase";
import AssignmentRoadmap from "./assignment-roadmap";
import { assignmentStyles } from "./assignment-showcase.styles";

type TabKey = "bab01" | "bab02" | "bab03" | "bab04" | "bab05" | "bab06" | "uts" | "roadmap";

export default function AssignmentShowcase() {
    const [activeTab, setActiveTab] = useState<TabKey>("bab04");

    const getAssignment = (id: string) => ML_ASSIGNMENTS.find((a) => a.id === id);

    return (
        <Box sx={assignmentStyles.root}>
            <Box sx={assignmentStyles.bg} />
            <Box sx={assignmentStyles.wrap}>
                {/* Header Portofolio Akademik */}
                <AssignmentHeader />

                {/* Open Tabs Navigation with Floating Chevrons */}
                <ScrollableTabsRow
                    sx={assignmentStyles.tabsWrapper}
                    scrollContainerSx={assignmentStyles.tabsRow}
                    role="tablist"
                    ariaLabel="Daftar tab penugasan"
                >
                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab01")}
                        sx={assignmentStyles.tabButton(activeTab === "bab01")}
                        role="tab"
                        aria-selected={activeTab === "bab01"}
                    >
                        <sup>01</sup>
                        <span>Bab 01: NumPy &amp; Penguins</span>
                        <small>Selesai</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab02")}
                        sx={assignmentStyles.tabButton(activeTab === "bab02")}
                        role="tab"
                        aria-selected={activeTab === "bab02"}
                    >
                        <sup>02</sup>
                        <span>Bab 02: Workflow Attrition</span>
                        <small>Selesai</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab03")}
                        sx={assignmentStyles.tabButton(activeTab === "bab03")}
                        role="tab"
                        aria-selected={activeTab === "bab03"}
                    >
                        <sup>03</sup>
                        <span>Bab 03: Preprocessing Fraud</span>
                        <small>Selesai</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab04")}
                        sx={assignmentStyles.tabButton(activeTab === "bab04")}
                        role="tab"
                        aria-selected={activeTab === "bab04"}
                    >
                        <sup>04</sup>
                        <span>Bab 04: Titanic Pipeline</span>
                        <small>Selesai (Resmi)</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab05")}
                        sx={assignmentStyles.tabButton(activeTab === "bab05")}
                        role="tab"
                        aria-selected={activeTab === "bab05"}
                    >
                        <sup>05</sup>
                        <span>Bab 05: Decision Tree</span>
                        <small>Selesai</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("bab06")}
                        sx={assignmentStyles.tabButton(activeTab === "bab06")}
                        role="tab"
                        aria-selected={activeTab === "bab06"}
                    >
                        <sup>06</sup>
                        <span>Bab 06: KNN &amp; Bayes</span>
                        <small>Selesai</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("uts")}
                        sx={assignmentStyles.tabButton(activeTab === "uts")}
                        role="tab"
                        aria-selected={activeTab === "uts"}
                    >
                        <sup>07</sup>
                        <span>Tugas Kisi-Kisi UTS</span>
                        <small>Aktif</small>
                    </Box>

                    <Box
                        component="button"
                        onClick={() => setActiveTab("roadmap")}
                        sx={assignmentStyles.tabButton(activeTab === "roadmap")}
                        role="tab"
                        aria-selected={activeTab === "roadmap"}
                    >
                        <sup>08</sup>
                        <span>Jadwal &amp; Roadmap (Bab 01-14)</span>
                        <small>14 Modul</small>
                    </Box>
                </ScrollableTabsRow>

                {/* Tab Panes */}
                <Box sx={assignmentStyles.contentPane}>
                    {activeTab === "bab01" && (
                        <ChapterShowcaseView assignment={getAssignment("tugas-bab-01-numpy-penguins")!} />
                    )}
                    {activeTab === "bab02" && (
                        <ChapterShowcaseView assignment={getAssignment("tugas-bab-02-workflow-attrition")!} />
                    )}
                    {activeTab === "bab03" && (
                        <ChapterShowcaseView assignment={getAssignment("tugas-bab-03-preprocessing-fraud")!} />
                    )}
                    {activeTab === "bab04" && <Bab04Showcase />}
                    {activeTab === "bab05" && (
                        <ChapterShowcaseView assignment={getAssignment("tugas-bab-05-decision-tree-microloan")!} />
                    )}
                    {activeTab === "bab06" && (
                        <ChapterShowcaseView assignment={getAssignment("tugas-bab-06-knn-bayes-sentiment")!} />
                    )}
                    {activeTab === "uts" && <UtsTasksShowcase />}
                    {activeTab === "roadmap" && <AssignmentRoadmap />}
                </Box>
            </Box>
        </Box>
    );
}
