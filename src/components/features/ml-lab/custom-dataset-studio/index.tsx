"use client";

import React from "react";
import Box from "@mui/material/Box";
import DatasetUploader from "./dataset-uploader";
import DatasetOverviewPanel from "./dataset-overview-panel";
import DatasetPreviewTable from "./dataset-preview-table";
import DatasetPreprocessingPanel from "./dataset-preprocessing-panel";
import DatasetModelRunner from "./dataset-model-runner";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import { customDatasetStudioStyles } from "./custom-dataset-studio.styles";

export interface CustomDatasetStudioProps {
    onApplyToSandbox?: (code: string) => void;
    onRunExperiment?: (code: string) => Promise<void>;
}

export default function CustomDatasetStudio({
    onApplyToSandbox,
    onRunExperiment,
}: CustomDatasetStudioProps) {
    const { customDataset } = useCustomDatasetStore();

    return (
        <Box sx={customDatasetStudioStyles.container}>
            {/* 1. Uploader */}
            <DatasetUploader />

            {/* When a dataset is loaded, display the exploration & configuration studio */}
            {customDataset && (
                <>
                    {/* 2. Overview, Column Schema & Type Overrides */}
                    <DatasetOverviewPanel />

                    {/* 3. Paginated Data Sample Preview */}
                    <DatasetPreviewTable />

                    {/* 4. Preprocessing & Leak-free Feature Selection */}
                    <DatasetPreprocessingPanel />

                    {/* 5. ML Model Selector & Execution */}
                    <DatasetModelRunner
                        onApplyToSandbox={onApplyToSandbox}
                        onRunExperiment={onRunExperiment}
                    />
                </>
            )}
        </Box>
    );
}
