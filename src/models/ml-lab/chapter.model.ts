export type VisualType =
    | "scatter"
    | "learning_curve"
    | "confusion_matrix"
    | "tree"
    | "boundary"
    | "roc_curve"
    | "cluster_2d"
    | "pca_scatter"
    | "loss_curve"
    | "feature_map"
    | "table"
    | "raw_text";

export interface ExecutionOutput {
    stdout: string;
    stderr: string;
    executionTime: number; // in milliseconds
    plots: string[]; // array of base64 PNG images or SVG data strings
    status: "idle" | "running" | "success" | "error";
    errorDetails?: string;
}

export interface ChapterResource {
    label: string;
    url?: string;
    description: string;
}

export interface DatasetInfo {
    name: string;
    description: string;
    filename?: string;
    downloadUrl?: string;
    kaggleUrl?: string;
    columns: string[];
    previewRows: (string | number)[][];
    totalRows?: number;
    sizeKb?: number;
}

export interface ChapterVariant {
    id: "original" | "alternatif";
    label: string;
    badge: string;
    description: string;
    code: string;
    datasetInfo?: DatasetInfo;
}

export interface Chapter {
    id: string;
    number: number; // 1 to 14
    title: string;
    slug: string;
    summary: string;
    category: "Dasar & Workflow" | "Preprocessing" | "Supervised Learning" | "Evaluasi & Optimasi" | "Unsupervised Learning" | "Deep Learning" | "Deployment & MLOps";
    difficulty: "Dasar" | "Menengah" | "Lanjutan";
    estimatedMinutes: number;
    visualType: VisualType;
    datasetKey: string;
    theoryMarkdown: string;
    initialCode: string;
    expectedOutputSummary?: string;
    keyFormulas?: string[];
    resources?: ChapterResource[];
    variants?: ChapterVariant[];
}
