import test from "node:test";
import assert from "node:assert/strict";

import { generatePrintableReportHTML } from "../src/utils/pdf-report-generator.ts";
const SAMPLE_CHAPTERS = [
    { id: "bab-01", number: 1, title: "Pengantar Machine Learning", slug: "01-pengantar-ml", category: "Dasar", visualType: "scatter", estimatedMinutes: 30 },
    { id: "bab-02", number: 2, title: "Workflow Machine Learning", slug: "02-workflow", category: "Dasar", visualType: "scatter", estimatedMinutes: 30 },
    { id: "bab-03", number: 3, title: "Penanganan Missing Values", slug: "03-missing-values", category: "Dasar", visualType: "pipeline", estimatedMinutes: 30 },
    { id: "bab-05", number: 5, title: "Decision Tree (CART & C4.5)", slug: "05-decision-tree", category: "Klasifikasi", visualType: "tree", estimatedMinutes: 45 },
];

test("PDF Generator: Generates academic header, student info, and module table", () => {
    const html = generatePrintableReportHTML({
        studentInfo: {
            name: "Anggit Pratama",
            studentId: "202343500001",
            classGroup: "X7C - Informatika",
            faculty: "Fakultas Sains & Teknologi",
            major: "Teknik Informatika",
            university: "Institut Sains dan Teknologi Nasional",
        },
        totalXp: 450,
        userLevel: 2,
        selectedChapters: SAMPLE_CHAPTERS.slice(0, 3),
        chapterProgress: {
            "01-pengantar-ml": {
                isCompleted: true,
                masteryPercent: 100,
                xpEarned: 200,
                executedCode: "print('hello')",
                timestamp: new Date().toISOString(),
            },
        },
        visualBabNumber: null,
    });

    assert.ok(html.includes("Institut Sains dan Teknologi Nasional"));
    assert.ok(html.includes("Anggit Pratama"));
    assert.ok(html.includes("202343500001"));
    assert.ok(html.includes("Bab 01"));
    assert.ok(html.includes("Bab 02"));
    assert.ok(html.includes("Bab 03"));
    assert.ok(html.includes("Lulus / Selesai"));
});

test("PDF Generator: Includes visual simulation output for exactly 1 chapter", () => {
    const html = generatePrintableReportHTML({
        studentInfo: {
            name: "Mahasiswa Test",
            studentId: "202343500999",
            classGroup: "S6X",
        },
        totalXp: 350,
        userLevel: 1,
        selectedChapters: SAMPLE_CHAPTERS,
        chapterProgress: {},
        visualBabNumber: 5, // Bab 5: Decision Tree
    });

    assert.ok(html.includes("Lampiran Visual Output Simulasi: Bab 05"));
    assert.ok(html.includes("Universitas / Perguruan Tinggi"));
    assert.ok(html.includes("Decision Tree") || html.includes("Pohon Keputusan"));
    assert.ok(html.includes("<svg")); // Renders vector visualization
});

test("PDF Generator: Includes custom dataset experiment metadata when present", () => {
    const html = generatePrintableReportHTML({
        studentInfo: {
            name: "Mahasiswa Test",
            studentId: "202343500999",
            classGroup: "S6X",
        },
        totalXp: 350,
        userLevel: 1,
        selectedChapters: SAMPLE_CHAPTERS.slice(0, 2),
        chapterProgress: {},
        customDatasetInfo: {
            filename: "heart_disease_kaggle.csv",
            rowCount: 303,
            columnCount: 14,
            taskType: "CLASSIFICATION",
            modelType: "Random Forest",
            targetColumn: "target",
            selectedFeatures: ["age", "chol", "thalach"],
            preprocessingSummary: "Imputasi (mean/mode), Normalisasi (standard)",
        },
        visualBabNumber: null,
    });

    assert.ok(html.includes("Eksperimen Dataset Eksternal (Kaggle / Custom CSV)"));
    assert.ok(html.includes("heart_disease_kaggle.csv"));
    assert.ok(html.includes("CLASSIFICATION"));
    assert.ok(html.includes("Random Forest"));
});
