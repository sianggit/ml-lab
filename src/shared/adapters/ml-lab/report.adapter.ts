import { Chapter } from "@/models/ml-lab/chapter.model";
import { StudentInfo, ChapterProgressItem } from "@/stores/use-ml-lab-store";

export interface ReportGenerationPayload {
    studentInfo: StudentInfo;
    chapters: Chapter[];
    progress: Record<string, ChapterProgressItem>;
    totalXp: number;
}

export class LabReportAdapter {
    /**
     * Formats academic lab report as standard Markdown
     */
    public static generateMarkdown(payload: ReportGenerationPayload): string {
        const { studentInfo, chapters, progress, totalXp } = payload;
        const dateStr = new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const completedCount = chapters.filter((c) => progress[c.slug]?.isCompleted).length;
        const facultyStr = studentInfo.faculty || "Fakultas Sains & Teknologi";
        const majorStr = studentInfo.major || "Teknik Informatika / Ilmu Komputer";
        const univStr = studentInfo.university || "Universitas / Perguruan Tinggi";

        let md = `# LAPORAN RESMI PRAKTIKUM MACHINE LEARNING\n`;
        md += `## ${facultyStr.toUpperCase()} - ${majorStr.toUpperCase()} - ${univStr.toUpperCase()}\n\n`;
        md += `---\n\n`;
        md += `### IDENTITAS PRAKTIKAN\n`;
        md += `- **Nama Mahasiswa**: ${studentInfo.name}\n`;
        md += `- **NPM**: ${studentInfo.studentId}\n`;
        md += `- **Kelas / Kelompok**: ${studentInfo.classGroup}\n`;
        md += `- **Program Studi**: ${majorStr}\n`;
        md += `- **Fakultas**: ${facultyStr}\n`;
        md += `- **Perguruan Tinggi**: ${univStr}\n`;
        md += `- **Tanggal Pelaporan**: ${dateStr}\n`;
        md += `- **Capaian Modul**: ${completedCount} dari ${chapters.length} Bab Selesai\n`;
        md += `- **Akumulasi Skor XP**: ${totalXp} XP\n\n`;
        md += `---\n\n`;

        chapters.forEach((ch) => {
            const chProgress = progress[ch.slug];
            const isCompleted = chProgress?.isCompleted ?? false;
            const codeToPrint = chProgress?.executedCode || ch.initialCode;
            const output = chProgress?.lastOutput;

            md += `## BAB ${ch.number < 10 ? `0${ch.number}` : ch.number}: ${ch.title.toUpperCase()}\n\n`;
            md += `### 1. Deskripsi & Capaian Pembelajaran\n`;
            md += `${ch.summary}\n\n`;

            if (ch.keyFormulas && ch.keyFormulas.length > 0) {
                md += `### 2. Rumus Kunci & Persamaan Terkait (UPM / UAS)\n`;
                ch.keyFormulas.forEach((formula, i) => {
                    md += `- Formula [${i + 1}]: \`${formula}\`\n`;
                });
                md += `\n`;
            }

            md += `### 3. Kode Implementasi Python (WebAssembly Executed)\n`;
            md += `\`\`\`python\n${codeToPrint.trim()}\n\`\`\`\n\n`;

            md += `### 4. Hasil Keluaran Terminal & Evaluasi\n`;
            if (output) {
                if (output.stdout) {
                    md += `**Stdout Output:**\n\`\`\`text\n${output.stdout.trim()}\n\`\`\`\n\n`;
                }
                if (output.stderr) {
                    md += `**Stderr / Exception:**\n\`\`\`text\n${output.stderr.trim()}\n\`\`\`\n\n`;
                }
                md += `- Status: **${output.status.toUpperCase()}**\n`;
                md += `- Waktu Eksekusi: **${output.executionTime} ms**\n\n`;
            } else {
                md += `*(Modul belum dieksekusi atau menggunakan nilai benchmark default)*\n\n`;
            }

            md += `### 5. Evaluasi & Catatan Mahasiswa\n`;
            md += `- Status Pengerjaan: ${isCompleted ? "[Selesai Dikerjakan]" : "[Belum Selesai]"}\n`;
            md += `- Catatan Analisis: Kode algoritma telah diuji pada dataset \`${ch.datasetKey}\` dengan representasi visual \`${ch.visualType}\`.\n\n`;
            md += `---\n\n`;
        });

        md += `\n*Laporan ini dihasilkan secara otomatis oleh sistem ML Lab Simulator (Pyodide WASM Engine).*`;
        return md;
    }

    /**
     * Downloads Markdown file directly in browser
     */
    public static downloadMarkdown(payload: ReportGenerationPayload): void {
        if (typeof window === "undefined") return;

        const content = this.generateMarkdown(payload);
        const dateTag = new Date().toISOString().slice(0, 10);
        const safeNim = payload.studentInfo.studentId.replace(/[^a-zA-Z0-9]/g, "");
        const safeName = payload.studentInfo.name.replace(/[^a-zA-Z0-9]/g, "-");
        const filename = `${dateTag}_ML-Lab_Report_${safeNim}_${safeName}.md`;

        const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Generates a printable HTML page and opens the browser print dialog
     */
    public static printReport(payload: ReportGenerationPayload): void {
        if (typeof window === "undefined") return;

        const { studentInfo, chapters, progress, totalXp } = payload;
        const dateStr = new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const facultyStr = studentInfo.faculty || "Fakultas Sains & Teknologi";
        const majorStr = studentInfo.major || "Teknik Informatika / Ilmu Komputer";
        const univStr = studentInfo.university || "Universitas / Perguruan Tinggi";

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        let html = `<!DOCTYPE html>
<html>
<head>
    <title>Laporan Praktikum ML - ${studentInfo.name} (${studentInfo.studentId})</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; margin: 40px; line-height: 1.6; }
        .header { border-bottom: 2px solid #374151; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0 0 6px 0; font-size: 24px; }
        .header h2 { margin: 0 0 16px 0; font-size: 16px; color: #4B5563; font-weight: 500; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; background: #F3F4F6; padding: 12px; border-radius: 8px; }
        .chapter { page-break-inside: avoid; margin-bottom: 35px; border-bottom: 1px solid #E5E7EB; padding-bottom: 25px; }
        .chapter h3 { color: #1F2937; margin: 0 0 8px 0; font-size: 18px; }
        pre { background: #F9FAFB; border: 1px solid #E5E7EB; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
        .output-box { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 12px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background: #EEF2FF; color: #4F46E5; }
        @media print {
            body { margin: 15mm; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN RESMI PRAKTIKUM MACHINE LEARNING</h1>
        <h2> ${facultyStr} - ${majorStr} - ${univStr} </h2>
        <div class="meta-grid">
            <div><strong>Nama:</strong> ${studentInfo.name}</div>
            <div><strong>NPM:</strong> ${studentInfo.studentId}</div>
            <div><strong>Kelas:</strong> ${studentInfo.classGroup}</div>
            <div><strong>Tanggal:</strong> ${dateStr}</div>
            <div><strong>Akumulasi Skor:</strong> ${totalXp} XP</div>
            <div><strong>Total Modul:</strong> ${chapters.length} Bab</div>
        </div>
    </div>
`;

        chapters.forEach((ch) => {
            const chProgress = progress[ch.slug];
            const isCompleted = chProgress?.isCompleted ?? false;
            const codeToPrint = chProgress?.executedCode || ch.initialCode;
            const output = chProgress?.lastOutput;

            html += `
    <div class="chapter">
        <h3>BAB ${ch.number < 10 ? `0${ch.number}` : ch.number}: ${ch.title} <span class="badge">${ch.difficulty}</span></h3>
        <p><strong>Capaian:</strong> ${ch.summary}</p>
        <h4>Kode Program Python:</h4>
        <pre>${escapeHtml(codeToPrint.trim())}</pre>
`;
            if (output && output.stdout) {
                html += `
        <h4>Hasil Output Terminal:</h4>
        <div class="output-box">${escapeHtml(output.stdout.trim())}</div>
`;
            }
            html += `
        <p style="margin-top: 12px; font-size: 13px; color: #4B5563;">
            Status: <strong>${isCompleted ? "[Selesai Dikerjakan]" : "[Belum Dieksekusi]"}</strong>
        </p>
    </div>
`;
        });

        html += `
    <script>
        window.onload = function() { window.print(); };
    </script>
</body>
</html>`;

        printWindow.document.write(html);
        printWindow.document.close();
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
