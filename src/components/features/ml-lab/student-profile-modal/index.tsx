"use client";

import { useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { studentProfileModalStyles } from "./student-profile-modal.styles";

export interface StudentProfileModalProps {
    open: boolean;
    onClose: () => void;
}

export default function StudentProfileModal({ open, onClose }: StudentProfileModalProps) {
    const { studentInfo } = useMlLabStore();
    const escButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                escButtonRef.current?.focus();
            }, 60);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const name = studentInfo.name || "Anggit Arisa Siwi Pratama";
    const studentId = studentInfo.studentId || "202343570045";
    const classGroup = studentInfo.classGroup || "XC Ekstensi";
    const faculty = studentInfo.faculty || "Teknik dan Ilmu Komputer";
    const major = studentInfo.major || "Teknik Informatika (S1)";
    const university = studentInfo.university || "Universitas Indraprasta PGRI (UNINDRA)";

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="student-identity-title"
            aria-describedby="student-identity-desc"
            closeAfterTransition
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(5, 7, 9, 0.76)",
                WebkitBackdropFilter: "blur(14px)",
                backdropFilter: "blur(14px)",
                p: { xs: "16px", sm: "24px" },
            }}
        >
            <Box sx={studentProfileModalStyles.card} role="dialog" aria-modal="true">
                {/* Header */}
                <Box sx={studentProfileModalStyles.hd}>
                    <Box>
                        <Box sx={studentProfileModalStyles.eyebrow}>
                            <b>Kartu Identitas</b>
                            <s />
                            <span>Akademik</span>
                        </Box>
                        <Box component="h2" id="student-identity-title" sx={studentProfileModalStyles.title}>
                            Identitas penyusun
                        </Box>
                        <Box component="p" id="student-identity-desc" sx={studentProfileModalStyles.subtitle}>
                            Informasi akademik penyusun portfolio ini.
                        </Box>
                    </Box>
                    <Box
                        component="button"
                        ref={escButtonRef}
                        type="button"
                        onClick={onClose}
                        sx={studentProfileModalStyles.escBtn}
                        aria-label="Tutup dialog identitas"
                    >
                        ESC
                    </Box>
                </Box>

                {/* Preview strip */}
                <Box sx={studentProfileModalStyles.pv}>
                    <Box>
                        <Box component="small" sx={studentProfileModalStyles.pvLabel}>
                            Penyusun
                        </Box>
                        <Box component="span" sx={studentProfileModalStyles.pvName}>
                            Anggit Pratama
                        </Box>
                    </Box>
                    <Box component="span" sx={studentProfileModalStyles.pvNim}>
                        NPM {studentId}
                    </Box>
                </Box>

                {/* Fields grid */}
                <Box sx={studentProfileModalStyles.fg}>
                    <Box sx={{ ...studentProfileModalStyles.field, ...studentProfileModalStyles.fgFull }}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>01</em>Nama lengkap
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValue}>
                            {name}
                        </Box>
                    </Box>

                    <Box sx={studentProfileModalStyles.field}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>02</em>NPM
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValueMono}>
                            {studentId}
                        </Box>
                    </Box>

                    <Box sx={studentProfileModalStyles.field}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>03</em>Kelas / Kelompok
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValue}>
                            {classGroup}
                        </Box>
                    </Box>

                    <Box sx={studentProfileModalStyles.field}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>04</em>Fakultas
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValue}>
                            {faculty}
                        </Box>
                    </Box>

                    <Box sx={studentProfileModalStyles.field}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>05</em>Program studi
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValue}>
                            {major}
                        </Box>
                    </Box>

                    <Box sx={{ ...studentProfileModalStyles.field, ...studentProfileModalStyles.fgFull }}>
                        <Box component="label" sx={studentProfileModalStyles.fieldLabel}>
                            <em>06</em>Perguruan tinggi
                        </Box>
                        <Box component="p" sx={studentProfileModalStyles.fieldValue}>
                            {university}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}
