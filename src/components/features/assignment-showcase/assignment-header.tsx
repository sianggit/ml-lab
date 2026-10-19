"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function AssignmentHeader() {
    const { studentInfo } = useMlLabStore();

    return (
        <Box sx={assignmentStyles.headerCard}>
            <Box sx={assignmentStyles.headerBadgeRow}>
                <Box component="span" sx={assignmentStyles.badgeVerified}>
                    <Box component="span" sx={{ width: "6px", height: "6px", borderRadius: "50%", bgcolor: "#43D9A3", display: "inline-block" }} />
                    Portofolio Akademik
                </Box>
                <Box component="span" sx={assignmentStyles.badgeSemester}>
                    Semester Gasal 2026 / 2027
                </Box>
            </Box>

            <Typography component="h1" sx={assignmentStyles.headerTitle}>
                Machine Learning Assignment Showcase
            </Typography>

            <Typography sx={assignmentStyles.headerSubtitle}>
                Dokumentasi penugasan praktikum laboratorium, rekayasa fitur data riil Titanic, dan kisi-kisi evaluasi UTS mata kuliah Machine Learning.
            </Typography>

            <Box sx={assignmentStyles.studentMetaGrid}>
                <Box sx={assignmentStyles.metaItem}>
                    <Typography sx={assignmentStyles.metaLabel}>Mahasiswa</Typography>
                    <Typography sx={assignmentStyles.metaValue}>
                        {studentInfo.name || "Anggit Arisa Siwi Pratama"}
                    </Typography>
                </Box>

                <Box sx={assignmentStyles.metaItem}>
                    <Typography sx={assignmentStyles.metaLabel}>NPM</Typography>
                    <Typography sx={assignmentStyles.metaValue}>
                        {studentInfo.studentId || "202343570045"}
                    </Typography>
                </Box>

                <Box sx={assignmentStyles.metaItem}>
                    <Typography sx={assignmentStyles.metaLabel}>Kelas & Program</Typography>
                    <Typography sx={assignmentStyles.metaValue}>
                        {studentInfo.classGroup || "XC Ekstensi"} (S1 TI)
                    </Typography>
                </Box>

                <Box sx={assignmentStyles.metaItem}>
                    <Typography sx={assignmentStyles.metaLabel}>Dosen Pengampu</Typography>
                    <Typography sx={assignmentStyles.metaValue}>
                        Nurfidah Dwitiyanti, M.Kom.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
