# ML Lab — Interactive Machine Learning Laboratory

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.9-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.7-61dafb?logo=react)](https://react.dev/)
[![Pyodide](https://img.shields.io/badge/WebAssembly-Pyodide%20v0.26.4-ffd43b?logo=python)](https://pyodide.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An interactive, browser-based Machine Learning experimentation platform and academic laboratory powered by **WebAssembly (Pyodide)**, **NumPy**, **Pandas**, **Scikit-Learn**, and **Monaco Editor**. 

Execute real Python machine learning algorithms directly inside your browser without installing local compilers, backend servers, or external cloud kernels.

---

## ✨ Features

- 🔬 **Client-Side Scientific Python Runtime**: Runs NumPy, pandas, scipy, scikit-learn, and matplotlib in a dedicated background Web Worker thread using WebAssembly, ensuring a smooth, non-blocking 60fps UI.
- 📚 **14 Comprehensive Laboratory Chapters**:
  - **Bab 01**: Pengantar Machine Learning & Python Environment
  - **Bab 02**: Workflow ML, Bias-Variance Tradeoff & Model Selection
  - **Bab 03**: Penanganan Missing Values & Imbalanced Dataset
  - **Bab 04**: Regresi Linear & Regresi Polinomial
  - **Bab 05**: Decision Tree (CART & C4.5) & Overfitting Pruning
  - **Bab 06**: Random Forest & Ensemble Learning (Bagging)
  - **Bab 07**: Support Vector Machine (Linear & RBF Kernel)
  - **Bab 08**: Naive Bayes (Gaussian, Multinomial & Bernoulli)
  - **Bab 09**: K-Nearest Neighbors (Euclidean & Manhattan Distance)
  - **Bab 10**: Clustering (K-Means Centroid Updates, Hierarkis & DBSCAN)
  - **Bab 11**: Reduksi Dimensi (PCA & Rekonstruksi Eigenvalue)
  - **Bab 12**: Neural Network & Multi-Layer Perceptron (MLP)
  - **Bab 13**: Evaluasi Model Mendalam (ROC-AUC, PR-Curve, Precision & Recall)
  - **Bab 14**: MLOps, Model Persistence & Hyperparameter Tuning (GridSearchCV)
- 📊 **Custom Dataset Studio (Kaggle Import)**:
  - Drag-and-drop CSV importer with strict RFC 4180 compliance.
  - Automated exploratory data analysis (EDA): data types, null distribution, summary statistics.
  - Leak-free preprocessing code generation (`StandardScaler`, `SimpleImputer`, `OneHotEncoder`).
  - Interactive table pagination and instant training execution.
- 📄 **Academic Report & PDF Export**:
  - Generate print-ready official academic reports with student profile metadata.
  - Single-chapter visual vector simulation outputs embedded in high-resolution vector SVG.
  - Formula injection sanitization for secure exports.
- 🛡️ **Production-Hardened Reliability**:
  - Global error boundaries with graceful retry capabilities.
  - Execution timeout safeguards (120s) and instant worker termination to prevent infinite loops.
  - Memory leak protection ensuring open Matplotlib figures are always cleaned up.
  - Modern security headers (HSTS preload, nosniff, frame denial, strict referrer).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.17.0+ or v20+
- **Package Manager**: `npm` (v9+) or `pnpm`

### Installation

```bash
# Clone the repository
git clone git@github.com:sianggit/ml-lab.git

# Enter project directory
cd ml-lab

# Install dependencies
npm install
```

### Development Server

Run the local development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the assigned port) in your browser.

---

## 🧪 Testing & Code Quality

```bash
# Run unit and integration tests (RFC 4180 CSV parser & PDF export)
npm test

# Run TypeScript type check
npm run typecheck

# Run ESLint validation
npm run lint

# Production build verification
npm run build
```

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Router** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Component System** | [Material-UI (MUI v7)](https://mui.com/), Emotion, Custom Design System |
| **Scientific Runtime** | [Pyodide v0.26.4](https://pyodide.org/) (WebAssembly Web Worker thread) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (`@monaco-editor/react`) |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) with `localStorage` persistence |
| **Form & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Mathematical Typesetting** | [KaTeX](https://katex.org/) |

---

## 🔒 Security & Privacy

- **100% Client-Side Processing**: Uploaded datasets and Python experiment codes are executed exclusively in your browser's WebAssembly sandbox. No raw datasets or experiment codes are sent to third-party servers.
- **CSV Formula Injection Safeguards**: Cell values starting with dangerous characters (`=`, `+`, `-`, `@`) are automatically escaped during report exports.
- **Strict Headers**: Configured with Content Security Policies, HSTS, X-Content-Type-Options, and Frame restrictions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
