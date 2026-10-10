import { create } from "zustand";
import { ParsedDataset, InferredColumnType } from "@/utils/csv-parser";
import {
    MLTaskType,
    MLModelType,
    PreprocessingOptions,
    generateMLPythonScript,
} from "@/utils/ml-code-generator";

export interface CustomDatasetStoreState {
    // Dataset state
    activeDatasetType: "builtin" | "custom";
    customDataset: ParsedDataset | null;
    rawCsvContent: string | null;
    columnTypeOverrides: Record<string, InferredColumnType>;

    // Preprocessing & Experiment configuration
    taskType: MLTaskType;
    modelType: MLModelType;
    targetColumn: string;
    selectedFeatures: string[];
    preprocessing: PreprocessingOptions;

    // Derived executable code
    generatedCode: string;

    // Actions
    setActiveDatasetType: (type: "builtin" | "custom") => void;
    setCustomDataset: (dataset: ParsedDataset, rawCsv: string) => void;
    clearCustomDataset: () => void;
    overrideColumnType: (colName: string, newType: InferredColumnType) => void;
    setTargetColumn: (colName: string) => void;
    toggleFeature: (colName: string) => void;
    selectAllFeatures: () => void;
    deselectAllFeatures: () => void;
    setTaskType: (task: MLTaskType) => void;
    setModelType: (model: MLModelType) => void;
    updatePreprocessing: (opts: Partial<PreprocessingOptions>) => void;
    regenerateCode: () => void;
}

const DEFAULT_PREPROCESSING: PreprocessingOptions = {
    missingStrategy: "impute_mean_mode",
    scaling: "standard",
    encodeCategorical: true,
    removeDuplicates: false,
    testSize: 0.2,
    randomState: 42,
};

export const useCustomDatasetStore = create<CustomDatasetStoreState>((set, get) => ({
    activeDatasetType: "builtin",
    customDataset: null,
    rawCsvContent: null,
    columnTypeOverrides: {},

    taskType: "classification",
    modelType: "random_forest",
    targetColumn: "",
    selectedFeatures: [],
    preprocessing: DEFAULT_PREPROCESSING,
    generatedCode: "",

    setActiveDatasetType: (type) => {
        set({ activeDatasetType: type });
    },

    setCustomDataset: (dataset, rawCsv) => {
        // Auto-detect suitable target column:
        // Prefer suggested target, or the last column, or first categorical
        let target = "";
        const suggestedTarget = dataset.columns.find((c) => c.isSuggestedTarget)?.name;
        if (suggestedTarget) {
            target = suggestedTarget;
        } else if (dataset.columns.length > 1) {
            target = dataset.columns[dataset.columns.length - 1].name;
        }

        // Feature columns: all columns except target and suggested IDs
        const features = dataset.columns
            .filter((c) => c.name !== target && !c.isSuggestedId)
            .map((c) => c.name);

        // Determine initial task type based on target
        const targetColMeta = dataset.columns.find((c) => c.name === target);
        const task: MLTaskType =
            targetColMeta?.inferredType === "numeric" && (targetColMeta.uniqueCount ?? 10) > 10
                ? "regression"
                : "classification";

        const model: MLModelType =
            task === "regression" ? "random_forest_regressor" : "random_forest";

        const code = generateMLPythonScript({
            filename: dataset.filename || "custom_data.csv",
            taskType: task,
            modelType: model,
            targetColumn: target,
            featureColumns: features,
            preprocessing: DEFAULT_PREPROCESSING,
        });

        set({
            customDataset: dataset,
            rawCsvContent: rawCsv,
            activeDatasetType: "custom",
            columnTypeOverrides: {},
            targetColumn: target,
            selectedFeatures: features,
            taskType: task,
            modelType: model,
            preprocessing: DEFAULT_PREPROCESSING,
            generatedCode: code,
        });
    },

    clearCustomDataset: () => {
        set({
            customDataset: null,
            rawCsvContent: null,
            activeDatasetType: "builtin",
            columnTypeOverrides: {},
            targetColumn: "",
            selectedFeatures: [],
            generatedCode: "",
        });
    },

    overrideColumnType: (colName, newType) => {
        set((state) => {
            const overrides = { ...state.columnTypeOverrides, [colName]: newType };
            return { columnTypeOverrides: overrides };
        });
        get().regenerateCode();
    },

    setTargetColumn: (colName) => {
        const state = get();
        // Remove new target from selected features if present
        const updatedFeatures = state.selectedFeatures.filter((f) => f !== colName);

        // Auto adjust task type based on target
        const colMeta = state.customDataset?.columns.find((c) => c.name === colName);
        const effectiveType = state.columnTypeOverrides[colName] || colMeta?.inferredType;
        const newTask: MLTaskType =
            effectiveType === "numeric" && (colMeta?.uniqueCount ?? 10) > 10
                ? "regression"
                : "classification";

        const newModel: MLModelType =
            newTask === "regression" ? "random_forest_regressor" : "random_forest";

        set({
            targetColumn: colName,
            selectedFeatures: updatedFeatures,
            taskType: newTask,
            modelType: newModel,
        });
        get().regenerateCode();
    },

    toggleFeature: (colName) => {
        const state = get();
        const exists = state.selectedFeatures.includes(colName);
        const updated = exists
            ? state.selectedFeatures.filter((f) => f !== colName)
            : [...state.selectedFeatures, colName];
        set({ selectedFeatures: updated });
        get().regenerateCode();
    },

    selectAllFeatures: () => {
        const state = get();
        if (!state.customDataset) return;
        const all = state.customDataset.columns
            .filter((c) => c.name !== state.targetColumn)
            .map((c) => c.name);
        set({ selectedFeatures: all });
        get().regenerateCode();
    },

    deselectAllFeatures: () => {
        set({ selectedFeatures: [] });
        get().regenerateCode();
    },

    setTaskType: (task) => {
        let model: MLModelType = "random_forest";
        if (task === "regression") model = "random_forest_regressor";
        if (task === "clustering") model = "kmeans";

        set({ taskType: task, modelType: model });
        get().regenerateCode();
    },

    setModelType: (model) => {
        set({ modelType: model });
        get().regenerateCode();
    },

    updatePreprocessing: (opts) => {
        set((state) => ({
            preprocessing: { ...state.preprocessing, ...opts },
        }));
        get().regenerateCode();
    },

    regenerateCode: () => {
        const state = get();
        if (!state.customDataset) return;

        const code = generateMLPythonScript({
            filename: state.customDataset.filename || "custom_data.csv",
            taskType: state.taskType,
            modelType: state.modelType,
            targetColumn: state.taskType !== "clustering" ? state.targetColumn : undefined,
            featureColumns: state.selectedFeatures,
            preprocessing: state.preprocessing,
        });

        set({ generatedCode: code });
    },
}));
