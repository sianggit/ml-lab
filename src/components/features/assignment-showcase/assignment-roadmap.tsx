"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ML_ASSIGNMENT_ROADMAP } from "@/consts/ml-assignments.const";
import { designTokens } from "@/config/theme";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function AssignmentRoadmap() {
    return (
        <Box sx={assignmentStyles.cardSection}>
            <Box sx={assignmentStyles.sectionHeader}>
                <Box>
                    <Typography component="h2" sx={assignmentStyles.sectionTitle}>
                        Roadmap Penugasan Praktikum &amp; Jadwal Showcase Bab 01 s.d. 14
                    </Typography>
                    <Typography sx={assignmentStyles.sectionSubtitle}>
                        Kalender akademik semester Gasal 2026/2027: Bab 01 s.d. 06 telah melewati jadwal dan aktif di showcase; Bab 07 s.d. 14 terjadwal Pasca-UTS.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={assignmentStyles.table}>
                    <Box component="thead">
                        <Box component="tr">
                            <Box component="th" sx={assignmentStyles.th}>Modul / Pertemuan</Box>
                            <Box component="th" sx={assignmentStyles.th}>Topik &amp; Algoritma Utama</Box>
                            <Box component="th" sx={assignmentStyles.th}>Dataset Showcase</Box>
                            <Box component="th" sx={assignmentStyles.th}>Jadwal Kuliah</Box>
                            <Box component="th" sx={assignmentStyles.th}>Rilis Showcase</Box>
                            <Box component="th" sx={assignmentStyles.th}>Status</Box>
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
                                            <span style={assignmentStyles.tableIndex}>
                                                {item.chapter}
                                            </span>
                                            {item.highlighted && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        fontFamily: designTokens.fontMono,
                                                        fontSize: "9.5px",
                                                        fontWeight: 600,
                                                        letterSpacing: "0.1em",
                                                        textTransform: "uppercase",
                                                        color: isDone ? designTokens.acc : "#D97706",
                                                    }}
                                                >
                                                    [{isDone ? "Showcase Aktif" : "UTS Target"}]
                                                </Box>
                                            )}
                                        </Box>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                                            <span style={assignmentStyles.tableTitle}>
                                                {item.title}
                                            </span>
                                            <span style={{ ...assignmentStyles.tableMeta, fontSize: "11px", color: designTokens.dim }}>
                                                {item.algorithm}
                                            </span>
                                        </Box>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <span style={{ ...assignmentStyles.tableMeta, color: designTokens.mute, fontSize: "11px" }}>
                                            {item.dataset}
                                        </span>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <span style={{ fontFamily: designTokens.fontMono, fontSize: "11.5px", color: designTokens.dim }}>
                                            {item.scheduleDate}
                                        </span>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <span style={{ fontFamily: designTokens.fontMono, fontSize: "11.5px", color: isDone ? designTokens.acc : designTokens.dim }}>
                                            {item.showcaseDate}
                                        </span>
                                    </Box>
                                    <Box component="td" sx={assignmentStyles.td(item.highlighted)}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Box component="span" sx={assignmentStyles.tableStatus(isDone)}>
                                                {isDone ? "Selesai" : isActive ? "Aktif (Pengerjaan)" : "Terjadwal"}
                                            </Box>
                                            {item.slug && (
                                                <Link
                                                    href={`/ml-lab/${item.slug}`}
                                                    style={{
                                                        fontFamily: designTokens.fontMono,
                                                        fontSize: "11px",
                                                        color: designTokens.dim,
                                                        textDecoration: "none",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    Lab ↗
                                                </Link>
                                            )}
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
