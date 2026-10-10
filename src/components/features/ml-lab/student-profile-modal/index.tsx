"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AppModal from "@/shared/components/modal";
import IconComponent from "@/shared/components/icon";
import { useMlLabStore } from "@/stores/use-ml-lab-store";
import { studentProfileModalStyles } from "./student-profile-modal.styles";

export interface StudentProfileModalProps {
    open: boolean;
    onClose: () => void;
}

export default function StudentProfileModal({ open, onClose }: StudentProfileModalProps) {
    const { studentInfo, setStudentInfo } = useMlLabStore();
    const [name, setName] = useState(studentInfo.name);
    const [studentId, setStudentId] = useState(studentInfo.studentId);
    const [classGroup, setClassGroup] = useState(studentInfo.classGroup);
    const [faculty, setFaculty] = useState(studentInfo.faculty || "Fakultas Sains & Teknologi");
    const [major, setMajor] = useState(studentInfo.major || "Informatika");
    const [university, setUniversity] = useState(studentInfo.university || "Universitas / Perguruan Tinggi");

    useEffect(() => {
        if (open) {
            setName(studentInfo.name);
            setStudentId(studentInfo.studentId);
            setClassGroup(studentInfo.classGroup);
            setFaculty(studentInfo.faculty || "Fakultas Sains & Teknologi");
            setMajor(studentInfo.major || "Informatika");
            setUniversity(studentInfo.university || "Universitas / Perguruan Tinggi");
        }
    }, [open, studentInfo]);

    const handleSave = () => {
        setStudentInfo({
            name: name.trim() || "Mahasiswa",
            studentId: studentId.trim() || "20240001",
            classGroup: classGroup.trim() || "Reguler",
            faculty: faculty.trim() || "Fakultas Sains & Teknologi",
            major: major.trim() || "Informatika",
            university: university.trim() || "Universitas / Perguruan Tinggi",
        });
        onClose();
    };

    return (
        <AppModal open={open} onClose={onClose} maxWidth="sm">
            <Box sx={studentProfileModalStyles.container}>
                <Box sx={studentProfileModalStyles.header}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconComponent name="academic-cap" size={24} color="#67D9FF" />
                    </Box>
                    <Box>
                        <Typography sx={studentProfileModalStyles.title}>Identitas Mahasiswa Praktikan</Typography>
                        <Typography sx={studentProfileModalStyles.subtitle}>
                            Data ini akan dicantumkan pada header laporan resmi praktikum dan bukti eksekusi
                        </Typography>
                    </Box>
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Nama Lengkap Mahasiswa</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Anggit Arisa Siwi Pratama"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Nomor Induk Mahasiswa (NIM)</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Contoh: 202343500001"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Kelas / Kelompok Praktikum</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={classGroup}
                        onChange={(e) => setClassGroup(e.target.value)}
                        placeholder="Contoh: X7C - Informatika"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Fakultas</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={faculty}
                        onChange={(e) => setFaculty(e.target.value)}
                        placeholder="Contoh: Fakultas Teknik & Ilmu Komputer"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Program Studi / Jurusan</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="Contoh: Informatika"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.formField}>
                    <Typography sx={studentProfileModalStyles.fieldLabel}>Perguruan Tinggi / Universitas</Typography>
                    <TextField
                        fullWidth
                        size="small"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="Contoh: Nama Universitas / Institut"
                        sx={studentProfileModalStyles.input}
                    />
                </Box>

                <Box sx={studentProfileModalStyles.actionRow}>
                    <Button onClick={onClose} sx={studentProfileModalStyles.cancelButton}>
                        Batal
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={studentProfileModalStyles.saveButton}>
                        Simpan Identitas
                    </Button>
                </Box>
            </Box>
        </AppModal>
    );
}
