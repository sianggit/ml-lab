/**
 * PDF / Printable Academic Report Generator for ML Lab
 * Generates print-ready A4 academic reports with student profile,
 * module portfolio, custom dataset metadata, and single-chapter visual simulation outputs.
 */

export interface PDFStudentInfo {
    name: string;
    studentId: string;
    classGroup: string;
    faculty?: string;
    major?: string;
    university?: string;
}

export interface PDFChapterItem {
    id: string;
    number: number;
    title: string;
    category?: string;
    estimatedMinutes?: number;
    visualType?: string;
    summary?: string;
    slug: string;
}

export interface PDFChapterProgress {
    isCompleted?: boolean;
    masteryPercent?: number;
    xpEarned?: number;
    lastOutput?: {
        plots?: string[];
        stdout?: string;
    };
}

export interface PDFReportOptions {
    studentInfo: PDFStudentInfo;
    totalXp: number;
    userLevel: number;
    selectedChapters: PDFChapterItem[];
    chapterProgress: Record<string, PDFChapterProgress>;
    customDatasetInfo?: {
        filename: string;
        rowCount: number;
        columnCount: number;
        taskType: string;
        modelType: string;
        targetColumn?: string;
        selectedFeatures: string[];
        preprocessingSummary: string;
    } | null;
    visualBabNumber?: number | null; // MAX 1 Bab for performance as required
}

function padNumber(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
}

function getVisualSimulationSVG(visualType: string): string {
    if (visualType === "tree") {
        return `
        <svg viewBox="0 0 540 220" width="100%" height="220" style="background:#0f172a; border-radius:8px;">
            <text x="270" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="monospace">Visualisasi Struktur Pohon Keputusan (Decision Tree Split)</text>
            <!-- Root node -->
            <rect x="210" y="40" width="120" height="34" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
            <text x="270" y="62" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">Petal Length ≤ 2.45</text>
            <!-- Lines -->
            <line x1="240" y1="74" x2="140" y2="120" stroke="#64748b" stroke-width="1.5" />
            <line x1="300" y1="74" x2="400" y2="120" stroke="#64748b" stroke-width="1.5" />
            <text x="175" y="95" fill="#4ade80" font-size="10" font-family="monospace">True</text>
            <text x="365" y="95" fill="#f87171" font-size="10" font-family="monospace">False</text>
            <!-- Left leaf -->
            <rect x="80" y="120" width="120" height="34" rx="6" fill="#064e3b" stroke="#34d399" stroke-width="1.5" />
            <text x="140" y="142" fill="#a7f3d0" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">Class: Setosa (N=50)</text>
            <!-- Right branch -->
            <rect x="340" y="120" width="120" height="34" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
            <text x="400" y="142" fill="#fbbf24" font-size="11" font-weight="bold" text-anchor="middle" font-family="monospace">Petal Width ≤ 1.75</text>
            <!-- Sub branches -->
            <line x1="370" y1="154" x2="310" y2="180" stroke="#64748b" stroke-width="1.2" />
            <line x1="430" y1="154" x2="470" y2="180" stroke="#64748b" stroke-width="1.2" />
            <rect x="250" y="180" width="110" height="28" rx="4" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1" />
            <text x="305" y="198" fill="#bae6fd" font-size="10" text-anchor="middle" font-family="monospace">Versicolor (N=48)</text>
            <rect x="420" y="180" width="110" height="28" rx="4" fill="#581c87" stroke="#c084fc" stroke-width="1" />
            <text x="475" y="198" fill="#e9d5ff" font-size="10" text-anchor="middle" font-family="monospace">Virginica (N=46)</text>
        </svg>`;
    } else if (visualType === "scatter" || visualType === "boundary") {
        return `
        <svg viewBox="0 0 540 220" width="100%" height="220" style="background:#0f172a; border-radius:8px;">
            <text x="270" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="monospace">Visualisasi Batas Keputusan (Decision Boundary & Sample Distribution)</text>
            <!-- Axes -->
            <line x1="60" y1="180" x2="480" y2="180" stroke="#334155" stroke-width="1.5" />
            <line x1="60" y1="40" x2="60" y2="180" stroke="#334155" stroke-width="1.5" />
            <!-- Decision boundary curve -->
            <path d="M 60 70 Q 250 140 480 90" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" />
            <!-- Cluster 1 dots (Class A) -->
            <circle cx="120" cy="130" r="5" fill="#38bdf8" />
            <circle cx="150" cy="150" r="5" fill="#38bdf8" />
            <circle cx="170" cy="120" r="5" fill="#38bdf8" />
            <circle cx="210" cy="145" r="5" fill="#38bdf8" />
            <circle cx="240" cy="160" r="5" fill="#38bdf8" />
            <circle cx="190" cy="135" r="5" fill="#38bdf8" />
            <!-- Cluster 2 dots (Class B) -->
            <circle cx="300" cy="70" r="5" fill="#f43f5e" />
            <circle cx="340" cy="85" r="5" fill="#f43f5e" />
            <circle cx="380" cy="65" r="5" fill="#f43f5e" />
            <circle cx="420" cy="75" r="5" fill="#f43f5e" />
            <circle cx="360" cy="55" r="5" fill="#f43f5e" />
            <circle cx="440" cy="60" r="5" fill="#f43f5e" />
            <!-- Labels -->
            <text x="140" y="175" fill="#38bdf8" font-size="10" font-family="monospace">● Kelas A (Positif)</text>
            <text x="350" y="45" fill="#f43f5e" font-size="10" font-family="monospace">● Kelas B (Negatif)</text>
            <text x="480" y="195" fill="#64748b" font-size="10" text-anchor="end" font-family="monospace">Fitur X1</text>
            <text x="50" y="50" fill="#64748b" font-size="10" text-anchor="middle" font-family="monospace">X2</text>
        </svg>`;
    } else {
        return `
        <svg viewBox="0 0 540 220" width="100%" height="220" style="background:#0f172a; border-radius:8px;">
            <text x="270" y="24" fill="#94a3b8" font-size="12" text-anchor="middle" font-family="monospace">Visualisasi Kurva Konvergensi & Loss Function Model</text>
            <!-- Axes -->
            <line x1="60" y1="180" x2="480" y2="180" stroke="#334155" stroke-width="1.5" />
            <line x1="60" y1="40" x2="60" y2="180" stroke="#334155" stroke-width="1.5" />
            <!-- Training Loss Curve -->
            <path d="M 60 50 Q 150 160 480 170" fill="none" stroke="#22c55e" stroke-width="2.5" />
            <!-- Validation Loss Curve -->
            <path d="M 60 70 Q 170 145 480 155" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="5,3" />
            <!-- Grid lines -->
            <line x1="60" y1="110" x2="480" y2="110" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
            <line x1="270" y1="40" x2="270" y2="180" stroke="#1e293b" stroke-width="1" stroke-dasharray="3,3" />
            <text x="460" y="145" fill="#eab308" font-size="10" font-family="monospace">Val Loss</text>
            <text x="460" y="165" fill="#22c55e" font-size="10" font-family="monospace">Train Loss</text>
            <text x="270" y="200" fill="#64748b" font-size="10" text-anchor="middle" font-family="monospace">Epochs / Iterasi</text>
        </svg>`;
    }
}

export function generatePrintableReportHTML(options: PDFReportOptions): string {
    const {
        studentInfo,
        totalXp,
        userLevel,
        selectedChapters,
        chapterProgress,
        customDatasetInfo,
        visualBabNumber,
    } = options;

    const completedCount = selectedChapters.filter(
        (ch) => chapterProgress[ch.slug]?.isCompleted
    ).length;
    const completionPercent =
        selectedChapters.length > 0
            ? Math.round((completedCount / selectedChapters.length) * 100)
            : 0;

    const printDate = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const chosenVisualChapter =
        visualBabNumber !== null && visualBabNumber !== undefined
            ? selectedChapters.find((c) => c.number === visualBabNumber)
            : null;

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Praktikum Machine Learning - ${studentInfo.studentId || "Praktikan"}</title>
    <style>
        @page {
            size: A4;
            margin: 14mm 15mm 14mm 15mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.45;
            font-size: 11pt;
            margin: 0;
            padding: 0;
        }
        /* Kop Surat Akademik */
        .kop-wrapper {
            border-bottom: 2.5px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .kop-inst {
            text-align: center;
            flex-grow: 1;
        }
        .kop-inst h1 {
            font-size: 14pt;
            font-weight: 800;
            margin: 0 0 2px 0;
            color: #0f172a;
            letter-spacing: -0.01em;
            text-transform: uppercase;
        }
        .kop-inst h2 {
            font-size: 11.5pt;
            font-weight: 700;
            margin: 0 0 3px 0;
            color: #334155;
            text-transform: uppercase;
        }
        .kop-inst p {
            font-size: 8.5pt;
            margin: 0;
            color: #64748b;
        }
        .kop-badge {
            background: #0284c7;
            color: #ffffff;
            font-weight: 700;
            font-size: 9pt;
            padding: 5px 10px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        /* Document Title */
        .doc-title {
            text-align: center;
            margin: 14px 0 16px;
        }
        .doc-title h3 {
            font-size: 13pt;
            font-weight: 750;
            margin: 0 0 3px;
            color: #0f172a;
            letter-spacing: -0.02em;
        }
        .doc-title span {
            font-size: 9pt;
            color: #64748b;
            font-family: "Courier New", Courier, monospace;
        }
        /* Metadata Grid */
        .meta-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 18px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px 20px;
            font-size: 9.5pt;
        }
        .meta-row {
            display: flex;
        }
        .meta-label {
            width: 130px;
            color: #64748b;
            font-weight: 600;
        }
        .meta-val {
            color: #0f172a;
            font-weight: 600;
        }
        /* Section Heading */
        .section-title {
            font-size: 11pt;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 1.5px solid #e2e8f0;
            padding-bottom: 4px;
            margin: 16px 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        /* Tables */
        table.portfolio-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-bottom: 16px;
        }
        table.portfolio-table th {
            background-color: #f1f5f9;
            color: #334155;
            font-weight: 700;
            text-align: left;
            padding: 6px 10px;
            border: 1px solid #cbd5e1;
            font-size: 8.5pt;
            text-transform: uppercase;
        }
        table.portfolio-table td {
            padding: 6px 10px;
            border: 1px solid #cbd5e1;
            color: #1e293b;
        }
        table.portfolio-table tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .badge-status {
            display: inline-block;
            font-size: 7.5pt;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }
        .badge-completed {
            background-color: #dcfce7;
            color: #15803d;
            border: 1px solid #86efac;
        }
        .badge-inprogress {
            background-color: #fef3c7;
            color: #b45309;
            border: 1px solid #fde68a;
        }
        .badge-pending {
            background-color: #f1f5f9;
            color: #64748b;
            border: 1px solid #cbd5e1;
        }
        /* Visual Simulation Container (Max 1 Bab) */
        .visual-container {
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            padding: 12px;
            background: #ffffff;
            margin-top: 10px;
            margin-bottom: 16px;
            page-break-inside: avoid;
        }
        .visual-header {
            font-size: 10pt;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
        }
        .visual-desc {
            font-size: 8.5pt;
            color: #475569;
            margin-bottom: 10px;
        }
        .visual-plot-img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            display: block;
            margin: 0 auto;
        }
        /* Signatures block */
        .signature-block {
            margin-top: 28px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
            font-size: 9.5pt;
            page-break-inside: avoid;
        }
        .sig-space {
            height: 55px;
        }
        .sig-name {
            font-weight: 700;
            text-decoration: underline;
            color: #0f172a;
        }
        .sig-sub {
            font-size: 8.5pt;
            color: #64748b;
        }
    </style>
</head>
<body>
    <!-- Academic Header -->
    <div class="kop-wrapper">
        <div class="kop-inst">
            <h1>${studentInfo.university || "Universitas / Perguruan Tinggi"}</h1>
            <h2>${studentInfo.faculty || "Fakultas Sains & Teknologi"} · ${studentInfo.major || "Program Studi Informatika"}</h2>
            <p>Laboratorium Sains Komputasi & Machine Learning · Smester Genap Akademik</p>
        </div>
        <div class="kop-badge">
            Official Portfolio
        </div>
    </div>

    <!-- Document Title -->
    <div class="doc-title">
        <h3>LEMBAR EVALUASI & LAPORAN PRAKTIKUM MACHINE LEARNING</h3>
        <span>ID Dokumen: ML-REP-${studentInfo.studentId || "2023"}-${Math.floor(Date.now() / 1000)}</span>
    </div>

    <!-- Student & Academic Metadata -->
    <div class="meta-box">
        <div class="meta-row">
            <span class="meta-label">Nama Mahasiswa:</span>
            <span class="meta-val">${studentInfo.name || "Mahasiswa"}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Total Akumulasi XP:</span>
            <span class="meta-val">${totalXp} XP (Tingkat ${userLevel})</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">NIM (Nomor Induk):</span>
            <span class="meta-val">${studentInfo.studentId || "-"}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Modul Selesai:</span>
            <span class="meta-val">${completedCount} dari ${selectedChapters.length} Bab (${completionPercent}%)</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Kelas / Rombel:</span>
            <span class="meta-val">${studentInfo.classGroup || "-"}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Tanggal Pelaporan:</span>
            <span class="meta-val">${printDate}</span>
        </div>
    </div>

    <!-- Module Matrix Table -->
    <div class="section-title">
        <span>I. Rekapitulasi Portofolio Praktikum (Bab 01 - 14)</span>
        <span style="font-size: 8.5pt; font-weight: normal; color: #64748b;">${selectedChapters.length} Modul</span>
    </div>

    <table class="portfolio-table">
        <thead>
            <tr>
                <th style="width: 35px; text-align: center;">No</th>
                <th style="width: 60px;">Kode</th>
                <th>Nama Topik & Kompetensi Modul</th>
                <th style="width: 100px; text-align: center;">Progres</th>
                <th style="width: 95px; text-align: center;">Status</th>
                <th style="width: 70px; text-align: right;">XP Earned</th>
            </tr>
        </thead>
        <tbody>
            ${selectedChapters.map((ch, idx) => {
        const prog = chapterProgress[ch.slug];
        const isComp = !!prog?.isCompleted;
        const mastery = prog?.masteryPercent || (isComp ? 100 : 0);
        const statusClass = isComp
            ? "badge-completed"
            : mastery > 0
                ? "badge-inprogress"
                : "badge-pending";
        const statusText = isComp
            ? "Lulus / Selesai"
            : mastery > 0
                ? `Aktif (${mastery}%)`
                : "Belum Diambil";
        const xp = prog?.xpEarned || (isComp ? 200 : 0);

        return `
                <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td style="font-family: monospace; font-weight: bold;">Bab ${padNumber(ch.number)}</td>
                    <td><b>${ch.title}</b><br><span style="font-size: 7.5pt; color: #64748b;">${ch.category} · Estimasi ${ch.estimatedMinutes} Menit</span></td>
                    <td style="text-align: center;">${mastery}%</td>
                    <td style="text-align: center;"><span class="badge-status ${statusClass}">${statusText}</span></td>
                    <td style="text-align: right; font-weight: 600;">+${xp}</td>
                </tr>`;
    }).join("")}
        </tbody>
    </table>

    ${customDatasetInfo ? `
    <!-- Custom Dataset Metadata -->
    <div class="section-title">
        <span>II. Eksperimen Dataset Eksternal (Kaggle / Custom CSV)</span>
        <span style="font-size: 8.5pt; font-weight: normal; color: #0284c7;">Validasi Pyodide WebAssembly</span>
    </div>
    <div class="meta-box" style="margin-bottom: 12px;">
        <div class="meta-row">
            <span class="meta-label">Nama Berkas:</span>
            <span class="meta-val" style="font-family: monospace;">${customDatasetInfo.filename}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Dimensi Data:</span>
            <span class="meta-val">${customDatasetInfo.rowCount.toLocaleString()} baris × ${customDatasetInfo.columnCount} kolom</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Jenis Tugas ML:</span>
            <span class="meta-val" style="text-transform: uppercase;">${customDatasetInfo.taskType}</span>
        </div>
        <div class="meta-row">
            <span class="meta-label">Model Algoritma:</span>
            <span class="meta-val">${customDatasetInfo.modelType}</span>
        </div>
        ${customDatasetInfo.targetColumn ? `
        <div class="meta-row">
            <span class="meta-label">Kolom Target:</span>
            <span class="meta-val" style="font-family: monospace; color: #0284c7;">${customDatasetInfo.targetColumn}</span>
        </div>` : ""}
        <div class="meta-row">
            <span class="meta-label">Fitur Terpilih:</span>
            <span class="meta-val">${customDatasetInfo.selectedFeatures.slice(0, 5).join(", ")}${customDatasetInfo.selectedFeatures.length > 5 ? "..." : ""}</span>
        </div>
    </div>
    ` : ""}

    ${chosenVisualChapter ? `
    <!-- Single Visual Output (Max 1 Bab for optimal performance) -->
    <div class="section-title">
        <span>${customDatasetInfo ? "III" : "II"}. Lampiran Visual Output Simulasi: Bab ${padNumber(chosenVisualChapter.number)}</span>
        <span style="font-size: 8.5pt; font-weight: normal; color: #059669;">Grafik & Output Komputasi</span>
    </div>

    <div class="visual-container">
        <div class="visual-header">
            <span>Bab ${padNumber(chosenVisualChapter.number)}: ${chosenVisualChapter.title}</span>
            <span style="font-size: 8pt; font-weight: normal; color: #64748b;">Visual Type: ${chosenVisualChapter.visualType || "plot"}</span>
        </div>
        <div class="visual-desc">
            ${chosenVisualChapter.summary}
        </div>
        ${chapterProgress[chosenVisualChapter.slug]?.lastOutput?.plots &&
                chapterProgress[chosenVisualChapter.slug]?.lastOutput?.plots?.length
                ? `<img class="visual-plot-img" src="data:image/png;base64,${chapterProgress[chosenVisualChapter.slug].lastOutput?.plots?.[0]}" alt="Visual Plot" />`
                : getVisualSimulationSVG(chosenVisualChapter.visualType || "scatter")
            }
    </div>
    ` : ""}

    <!-- Signatures -->
    <div class="signature-block">
        <div>
            <div>Mengetahui,</div>
            <div>Dosen Pengampu / Instruktur Lab</div>
            <div class="sig-space"></div>
            <div class="sig-name">( Ir. Dosen Pengampu, M.Kom. )</div>
            <div class="sig-sub">NIDN: 0412345678</div>
        </div>
        <div>
            <div>Jakarta, ${printDate}</div>
            <div>Mahasiswa Praktikan,</div>
            <div class="sig-space"></div>
            <div class="sig-name">${studentInfo.name || "Mahasiswa"}</div>
            <div class="sig-sub">NIM: ${studentInfo.studentId || "-"}</div>
        </div>
    </div>
</body>
</html>`;
}

/**
 * Triggers the browser's native print engine to save as PDF
 */
export function printReportToPDF(options: PDFReportOptions): void {
    if (typeof window === "undefined") return;

    const html = generatePrintableReportHTML(options);

    // Create an isolated hidden iframe for clean printing
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Allow styles & images to settle before triggering print
        setTimeout(() => {
            try {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
            } finally {
                // Remove iframe after print dialog completes
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }
        }, 300);
    }
}
