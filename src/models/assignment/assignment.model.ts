export type AssignmentStatus = "completed" | "in_progress" | "upcoming";
export type AssignmentCategory = "praktikum" | "uts_tugas" | "uas_project";

export interface AssignmentMetric {
    label: string;
    baseline: string;
    enhanced: string;
    delta?: string;
    highlight?: boolean;
}

export interface AssignmentResource {
    title: string;
    type: "pdf" | "image" | "code" | "notebook";
    path: string;
    description: string;
    size?: string;
}

export interface UtsQuestion {
    id: string;
    number: string;
    title: string;
    topic: string;
    description: string;
    formula?: string;
    solutionPoints: {
        subtitle: string;
        details: string[];
    }[];
}

export interface AssignmentItem {
    id: string;
    code: string; // e.g. "BAB-04", "UTS-1-6"
    title: string;
    subtitle: string;
    category: AssignmentCategory;
    status: AssignmentStatus;
    semester: string;
    courseName: string;
    courseCode: string;
    lecturer: string;
    classGroup: string;
    deadline?: string;
    executionDate?: string;
    abstract: string;
    keyHighlights: string[];
    metrics?: AssignmentMetric[];
    resources: AssignmentResource[];
    sourceCodeSnippet?: string;
    questions?: UtsQuestion[];
    slug?: string;
    datasetName?: string;
    datasetKaggleUrl?: string;
    datasetDownloadUrl?: string;
}
