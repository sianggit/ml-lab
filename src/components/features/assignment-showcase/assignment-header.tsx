"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { assignmentStyles } from "./assignment-showcase.styles";

export default function AssignmentHeader() {
    const { studentInfo, setProfileModalOpen } = useMlLabStore();

    return (
        <Box sx={assignmentStyles.header}>
            <Box sx={assignmentStyles.eyebrow}>
                <b>PORTOFOLIO AKADEMIK</b>
                <s />
                <span>SEMESTER GASAL 2026 / 2027</span>
            </Box>

            <Typography component="h1" sx={assignmentStyles.title}>
                <span>Machine Learning</span>
                <span className="g">Assignment Showcase</span>
            </Typography>

            <Typography sx={assignmentStyles.lead}>
                Dokumentasi penugasan praktikum laboratorium, rekayasa fitur data riil Titanic, dan kisi-kisi evaluasi UTS mata kuliah Machine Learning.
            </Typography>

            <Box sx={assignmentStyles.plate}>
                <Box
                    sx={assignmentStyles.plateCol(true, true)}
                    onClick={() => setProfileModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setProfileModalOpen(true)}
                    aria-label="Buka detail identitas penyusun"
                >
                    <Box component="span" sx={assignmentStyles.plateLabel}>Disusun Oleh</Box>
                    <Box component="span" sx={assignmentStyles.plateName}>{studentInfo.name || "Anggit Arisa Siwi Pratama"}</Box>
                    <Box component="span" sx={assignmentStyles.plateNim}>NPM {studentInfo.studentId || "202343570045"}</Box>
                </Box>

                <Box sx={assignmentStyles.plateCol(false)}>
                    <Box component="span" sx={assignmentStyles.plateLabel}>Dosen Pengampu</Box>
                    <Box component="span" sx={assignmentStyles.plateText}>Nurfidah Dwitiyanti, M.Kom.</Box>
                    <Box component="span" sx={assignmentStyles.plateTa}>Teknik Informatika</Box>
                </Box>

                <Box sx={assignmentStyles.plateCol(false)}>
                    <Box component="span" sx={assignmentStyles.plateLabel}>Program &amp; Kelas</Box>
                    <Box component="span" sx={assignmentStyles.plateClass}>{studentInfo.classGroup || "XC Ekstensi"} (S1 TI)</Box>
                    <Box component="span" sx={assignmentStyles.plateTa}>TA 2026/2027</Box>
                </Box>
            </Box>
        </Box>
    );
}
