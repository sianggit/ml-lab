"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ML_ASSIGNMENT_ROADMAP } from "@/consts/ml-assignments.const";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function AssignmentRoadmap() {
    return (
        <Box sx={assignmentStyles.cardSection}>
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Typography component="h2" sx={assignmentStyles.sectionTitle}>
                        Roadmap Penugasan Praktikum & Project Semester Gasal
                    </Typography>
                    <Typography sx={assignmentStyles.sectionSubtitle}>
                        Status pelaporan praktikum berkala laboratorium Machine Learning Bab 01 s.d. Bab 14.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={assignmentStyles.table}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={assignmentStyles.th}>Modul / Pertemuan</Box>
                            <Box component="th" sx={assignmentStyles.th}>Topik Penugasan</Box>
                            <Box component="th" sx={assignmentStyles.th}>Kategori</Box>
                            <Box component="th" sx={assignmentStyles.th}>Status Pelaporan</Box>
                        </Box>
                    </Box>
                    <Box component="tbody">
                        {ML_ASSIGNMENT_ROADMAP.map((item, idx) => {
                            const isDone = item.status === "completed";
                            const isActive = item.status === "in_progress";

                            return (
                                <Box component="tr" key={idx}>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontFamily: "var(--font-mono), monospace", fontWeight: 700 }}>
                                                {item.chapter}
                                            </span>
                                            {item.highlighted && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        px: "6px",
                                                        py: "1px",
                                                        borderRadius: "4px",
                                                        fontSize: "0.65rem",
                                                        fontWeight: 700,
                                                        bgcolor: isDone ? "rgba(67, 217, 163, 0.15)" : "rgba(255, 184, 77, 0.15)",
                                                        color: isDone ? "#43D9A3" : "#FFB84D",
                                                        fontFamily: "var(--font-mono), monospace",
                                                    }}
                                                >
                                                    {isDone ? "Showcase Aktif" : "UTS Target"}
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <span style={{ fontWeight: item.highlighted ? 700 : 500 }}>
                                            {item.title}
                                        </span>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <span style={{ textTransform: "capitalize", color: "#8E99A8", fontSize: "0.80rem" }}>
                                            {item.type.replace("_", " ")}
                                        </span>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <Box component="span" sx={assignmentStyles.tabBadge(isDone ? "completed" : isActive ? "active" : "neutral")}>
                                            {isDone ? "Selesai" : isActive ? "Dalam Pengerjaan" : "Terjadwal"}
                                        </Box>
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
