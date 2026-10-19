"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { usePyodideKernel } from "@/hooks/use-pyodide-kernel";
import CodeCell from "@/components/features/ml-lab/code-cell";
import CellOutput from "@/components/features/ml-lab/cell-output";
import CustomDatasetStudio from "@/components/features/ml-lab/custom-dataset-studio";
import { useCustomDatasetStore } from "@/stores/use-custom-dataset-store";
import ScrollableTabsRow from "@/shared/components/scrollable-tabs-row";
import { sandboxPageStyles } from "./sandbox-page.styles";

interface PresetSnippet {
    id: number;
    key: string;
    label: string;
    keyHint: string;
    code: string;
}

const PRESET_SNIPPETS: PresetSnippet[] = [
    {
        id: 1,
        key: "np",
        label: "1. NumPy Algebra",
        keyHint: "Alt+1",
        code: `# === NUMPY MATRIX ALGEBRA & LINEAR SOLVER ===
import numpy as np

# Matriks Koefisien 3x3 dan Vektor Target b
A = np.array([[2.0, 1.0, -1.0], [-3.0, -1.0, 2.0], [-2.0, 1.0, 2.0]])
b = np.array([8.0, -11.0, -3.0])

# Solusi Sistem Persamaan Linier Ax = b
x = np.linalg.solve(A, b)
det_A = np.linalg.det(A)
eigenvalues, eigenvectors = np.linalg.eig(A)

print("Solusi x:", x)
print(f"Determinan det(A): {det_A:.4f}")
print("Nilai Eigen:", np.round(eigenvalues, 4))
`,
    },
    {
        id: 2,
        key: "dt",
        label: "2. Sklearn Decision Tree",
        keyHint: "Alt+2",
        code: `# === SCIKIT-LEARN CLASSIFICATION PIPELINE ===
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)

model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_tr, y_tr)
print("Kedalaman pohon:", model.get_depth())
print("Akurasi:", accuracy_score(y_te, model.predict(X_te)))
`,
    },
    {
        id: 3,
        key: "cn",
        label: "3. Matplotlib 2D Contour",
        keyHint: "Alt+3",
        code: `# === MATPLOTLIB 2D DENSITY CONTOUR ===
import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 200)
X, Y = np.meshgrid(x, x)
Z = np.exp(-(X**2 + Y**2)) + 0.5 * np.exp(-((X - 1.5)**2 + (Y + 1)**2))

plt.contourf(X, Y, Z, levels=12)
plt.colorbar(label="densitas")
plt.title("2D Contour Simulation")
plt.show()

print("Grid:", Z.shape, "maks:", round(float(Z.max()), 3))
`,
    },
    {
        id: 4,
        key: "custom",
        label: "4. Dataset Kustom (CSV)",
        keyHint: "Alt+4",
        code: `# === DATASET KUSTOM: PRAKTIKUM MACHINE LEARNING ===
# Unggah file CSV (misal dari Kaggle) pada panel Studio Dataset Kustom di bawah.
# Kode pipeline otomatis scikit-learn & pandas akan digenerate di sini.
import pandas as pd
import numpy as np
print("Silakan pilih atau unggah file CSV di panel di bawah.")
`,
    },
];

export default function SandboxPage() {
    const [selectedPreset, setSelectedPreset] = useState<PresetSnippet>(PRESET_SNIPPETS[0]);
    const [editorCode, setEditorCode] = useState<string>(PRESET_SNIPPETS[0].code);
    const [editorKey, setEditorKey] = useState<number>(0);

    const { runCode, isExecuting, lastOutput, resetKernel } = usePyodideKernel();
    const { generatedCode, setActiveDatasetType } = useCustomDatasetStore();

    // Keyboard shortcut handler for Alt+1, Alt+2, Alt+3, Alt+4
    useEffect(() => {
        const handleKeyDown = (ev: KeyboardEvent) => {
            if (ev.altKey && ["1", "2", "3", "4"].includes(ev.key)) {
                ev.preventDefault();
                const index = parseInt(ev.key, 10) - 1;
                if (PRESET_SNIPPETS[index]) {
                    const preset = PRESET_SNIPPETS[index];
                    setSelectedPreset(preset);
                    if (preset.key === "custom" && generatedCode) {
                        setEditorCode(generatedCode);
                        setActiveDatasetType("custom");
                    } else {
                        setEditorCode(preset.code);
                        setActiveDatasetType("builtin");
                    }
                    setEditorKey((prev) => prev + 1);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [generatedCode, setActiveDatasetType]);

    const handleSelectPreset = (snippet: PresetSnippet) => {
        setSelectedPreset(snippet);
        if (snippet.key === "custom") {
            setActiveDatasetType("custom");
            if (generatedCode) {
                setEditorCode(generatedCode);
            } else {
                setEditorCode(snippet.code);
            }
        } else {
            setActiveDatasetType("builtin");
            setEditorCode(snippet.code);
        }
        setEditorKey((prev) => prev + 1);
    };

    const handleApplyCustomCodeToSandbox = (code: string) => {
        setEditorCode(code);
        setEditorKey((prev) => prev + 1);
        if (selectedPreset.key !== "custom") {
            setSelectedPreset(PRESET_SNIPPETS[3]);
        }
    };

    const handleRunCustomExperiment = async (code: string) => {
        setEditorCode(code);
        setEditorKey((prev) => prev + 1);
        if (selectedPreset.key !== "custom") {
            setSelectedPreset(PRESET_SNIPPETS[3]);
        }
        await runCode(code);
    };

    return (
        <Box sx={sandboxPageStyles.root}>
            <Box sx={sandboxPageStyles.bg} aria-hidden="true" />

            <Box component="main" sx={sandboxPageStyles.wrap} className="wrap">
                {/* ─── Hero Section ────────────────────────────────────────────── */}
                <Box sx={sandboxPageStyles.hero} className="hero">
                    <Box sx={sandboxPageStyles.eyebrow} className="eyebrow">
                        <b>Simulator</b>
                        <s />
                        <span>Python 3.11 · WebAssembly · Scikit-Learn</span>
                    </Box>

                    <Box component="h1" sx={sandboxPageStyles.title}>
                        <span>Monaco scientific</span>
                        <span className="g">workbench</span>
                    </Box>

                    <Box component="p" sx={sandboxPageStyles.lead} className="bio">
                        Eksperimen bebas dengan NumPy, scikit-learn, dan Matplotlib. Gunakan preset bawaan atau unggah dataset CSV Anda sendiri (Kaggle).
                    </Box>
                </Box>

                {/* ─── Presets Strip with Floating Chevrons ──────────────────────── */}
                <ScrollableTabsRow
                    sx={sandboxPageStyles.presetsWrapper}
                    scrollContainerSx={sandboxPageStyles.presetsBar}
                    role="tablist"
                    ariaLabel="Preset kode workbench"
                >
                    <Box component="span" sx={sandboxPageStyles.presetsLabel}>
                        Mode / Preset:
                    </Box>

                    {PRESET_SNIPPETS.map((snippet) => {
                        const isPressed = selectedPreset.key === snippet.key;
                        const cleanLabel = snippet.label.replace(/^\d+\.\s*/, "");
                        return (
                            <Box
                                component="button"
                                key={snippet.key}
                                onClick={() => handleSelectPreset(snippet)}
                                sx={sandboxPageStyles.presetTab(isPressed)}
                                role="tab"
                                aria-selected={isPressed}
                            >
                                <Box component="sup">0{snippet.id}</Box>
                                <span>{cleanLabel}</span>
                                <Box component="small">{snippet.keyHint}</Box>
                            </Box>
                        );
                    })}
                </ScrollableTabsRow>

                {/* ─── Custom Dataset Studio (Visible if preset 4 is active or user uploaded dataset) ─── */}
                {selectedPreset.key === "custom" && (
                    <Box sx={{ mb: 3 }}>
                        <CustomDatasetStudio
                            onApplyToSandbox={handleApplyCustomCodeToSandbox}
                            onRunExperiment={handleRunCustomExperiment}
                        />
                    </Box>
                )}

                {/* ─── Monaco / Python IDE Frame ─────────────────────────────────── */}
                <Box sx={sandboxPageStyles.ideContainer}>
                    <CodeCell
                        key={editorKey}
                        initialCode={editorCode}
                        onRun={runCode}
                        isRunning={isExecuting}
                        onResetKernel={() => {
                            resetKernel();
                            setEditorKey((prev) => prev + 1);
                        }}
                    />

                    {(lastOutput || isExecuting) && (
                        <CellOutput output={lastOutput} isRunning={isExecuting} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
