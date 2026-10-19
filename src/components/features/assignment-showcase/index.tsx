"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import AssignmentHeader from "./assignment-header";
import Bab04Showcase from "./bab04-showcase";
import UtsTasksShowcase from "./uts-tasks-showcase";
import AssignmentRoadmap from "./assignment-roadmap";
import { assignmentStyles } from "./assignment-showcase.styles";

type TabKey = "bab04" | "uts" | "roadmap";

export default function AssignmentShowcase() {
    const [activeTab, setActiveTab] = useState<TabKey>("bab04");

    return (
        <Box sx={assignmentStyles.wrap}>
            {/* Header Portofolio Akademik */}
            <AssignmentHeader />

            {/* Tab Selection */}
            <Box sx={assignmentStyles.tabsRow} role="tablist">
                <Box
                    component="button"
                    onClick={() => setActiveTab("bab04")}
                    sx={assignmentStyles.tabButton(activeTab === "bab04")}
                    role="tab"
                    aria-selected={activeTab === "bab04"}
                >
                    <span>Tugas Praktikum Bab 04 (Titanic Pipeline)</span>
                    <Box component="span" sx={assignmentStyles.tabBadge("completed")}>
                        Selesai
                    </Box>
                </Box>

                <Box
                    component="button"
                    onClick={() => setActiveTab("uts")}
                    sx={assignmentStyles.tabButton(activeTab === "uts")}
                    role="tab"
                    aria-selected={activeTab === "uts"}
                >
                    <span>Tugas Pertemuan 1 - 6 (Kisi-Kisi UTS)</span>
                    <Box component="span" sx={assignmentStyles.tabBadge("active")}>
                        Aktif
                    </Box>
                </Box>

                <Box
                    component="button"
                    onClick={() => setActiveTab("roadmap")}
                    sx={assignmentStyles.tabButton(activeTab === "roadmap")}
                    role="tab"
                    aria-selected={activeTab === "roadmap"}
                >
                    <span>Roadmap Modul (Bab 01 - 14)</span>
                    <Box component="span" sx={assignmentStyles.tabBadge("neutral")}>
                        14 Modul
                    </Box>
                </Box>
            </Box>

            {/* Tab Panes */}
            {activeTab === "bab04" && <Bab04Showcase />}
            {activeTab === "uts" && <UtsTasksShowcase />}
            {activeTab === "roadmap" && <AssignmentRoadmap />}
        </Box>
    );
}
