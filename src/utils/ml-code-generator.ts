/**
 * Machine Learning Code Generator
 * Generates reproducible, leak-free scikit-learn and pandas Python code
 * tailored for custom imported datasets in Pyodide.
 */

export type MLTaskType = "classification" | "regression" | "clustering";

export type MLModelType =
    | "random_forest"
    | "logistic_regression"
    | "decision_tree"
    | "linear_regression"
    | "random_forest_regressor"
    | "kmeans";

export interface PreprocessingOptions {
    missingStrategy: "drop_rows" | "impute_mean_mode" | "impute_median_mode" | "none";
    scaling: "none" | "standard" | "minmax";
    encodeCategorical: boolean;
    removeDuplicates: boolean;
    testSize: number; // e.g. 0.2
    randomState: number; // e.g. 42
}

export interface MLCodeGeneratorConfig {
    filename: string;
    taskType: MLTaskType;
    modelType: MLModelType;
    targetColumn?: string;
    featureColumns: string[];
    preprocessing: PreprocessingOptions;
}

export function generateMLPythonScript(config: MLCodeGeneratorConfig): string {
    const {
        filename,
        taskType,
        modelType,
        targetColumn,
        featureColumns,
        preprocessing,
    } = config;

    const featureColsRepr = JSON.stringify(featureColumns);
    const targetRepr = targetColumn ? JSON.stringify(targetColumn) : "None";

    if (taskType === "clustering") {
        return `# === ML LAB: UNSUPERVISED CLUSTERING PIPELINE ===
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
${preprocessing.scaling === "standard" ? "from sklearn.preprocessing import StandardScaler\n" : ""}${preprocessing.scaling === "minmax" ? "from sklearn.preprocessing import MinMaxScaler\n" : ""}
# 1. Load dataset from Pyodide virtual filesystem
df = pd.read_csv("${filename}")
print(f"Dataset dimuat: {df.shape[0]} baris, {df.shape[1]} kolom")

# 2. Fitur terpilih
features = ${featureColsRepr}
X = df[features].copy()

${preprocessing.removeDuplicates ? "# Hapus duplikat\nX = X.drop_duplicates()\n" : ""}${preprocessing.missingStrategy === "drop_rows" ? "# Hapus baris dengan missing value\nX = X.dropna()\n" : ""}${preprocessing.missingStrategy !== "drop_rows" && preprocessing.missingStrategy !== "none" ? `# Imputasi missing values numerik
numeric_cols = X.select_dtypes(include=[np.number]).columns
for col in numeric_cols:
    if X[col].isnull().any():
        X[col] = X[col].fillna(X[col].mean())
` : ""}${preprocessing.encodeCategorical ? `# One-Hot Encoding fitur kategorikal
X = pd.get_dummies(X, drop_first=True)
` : ""}
${preprocessing.scaling === "standard" ? `# Scaling fitur numerik (StandardScaler)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
` : preprocessing.scaling === "minmax" ? `# Scaling fitur numerik (MinMaxScaler)
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)
` : "X_scaled = X.values\n"}
# 3. Model Training: K-Means Clustering
k = 3
kmeans = KMeans(n_clusters=k, random_state=${preprocessing.randomState}, n_init=10)
labels = kmeans.fit_predict(X_scaled)

# 4. Evaluasi
if len(np.unique(labels)) > 1:
    sil_score = silhouette_score(X_scaled, labels)
    print(f"Silhouette Score (k={k}): {sil_score:.4f}")
print(f"Inersia (Sum of squared distances): {kmeans.inertia_:.2f}")

# Distribusi cluster
cluster_counts = pd.Series(labels).value_counts().sort_index()
print("\\nDistribusi Klaster:")
for c, cnt in cluster_counts.items():
    print(f" - Klaster {c}: {cnt} sampel")

# 5. Visualisasi 2D Scatter Plot
plt.figure(figsize=(7, 4.5))
plt.scatter(X_scaled[:, 0], X_scaled[:, 1 if X_scaled.shape[1] > 1 else 0], c=labels, cmap='viridis', alpha=0.7, edgecolors='k')
plt.title(f"K-Means Clustering (k={k})")
plt.xlabel(features[0] if len(features) > 0 else "Fitur 1")
plt.ylabel(features[1] if len(features) > 1 else features[0])
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
`;
    }

    // Supervised Learning (Classification / Regression)
    const isClassification = taskType === "classification";

    return `# === ML LAB: ${isClassification ? "SUPERVISED CLASSIFICATION" : "SUPERVISED REGRESSION"} PIPELINE ===
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
${isClassification ? `from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
${modelType === "random_forest" ? "from sklearn.ensemble import RandomForestClassifier" : modelType === "decision_tree" ? "from sklearn.tree import DecisionTreeClassifier" : "from sklearn.linear_model import LogisticRegression"}` : `from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
${modelType === "random_forest_regressor" ? "from sklearn.ensemble import RandomForestRegressor" : modelType === "decision_tree" ? "from sklearn.tree import DecisionTreeRegressor" : "from sklearn.linear_model import LinearRegression"}`}
${preprocessing.scaling === "standard" ? "from sklearn.preprocessing import StandardScaler\n" : ""}${preprocessing.scaling === "minmax" ? "from sklearn.preprocessing import MinMaxScaler\n" : ""}
# 1. Load Dataset
df = pd.read_csv("${filename}")
target_col = ${targetRepr}
feature_cols = ${featureColsRepr}

print(f"Dataset dimuat: {df.shape[0]} baris, {df.shape[1]} kolom")
print(f"Target: {target_col}")
print(f"Fitur ({len(feature_cols)}): {', '.join(feature_cols[:5])}{'...' if len(feature_cols) > 5 else ''}")

# 2. Pra-pemrosesan Data
df_work = df[feature_cols + [target_col]].copy()

${preprocessing.removeDuplicates ? "# Hapus duplikasi baris\ndf_work = df_work.drop_duplicates()\n" : ""}${preprocessing.missingStrategy === "drop_rows" ? "# Hapus baris dengan nilai hilang\ndf_work = df_work.dropna()\n" : ""}${preprocessing.missingStrategy !== "drop_rows" && preprocessing.missingStrategy !== "none" ? `# Imputasi missing values
for col in feature_cols:
    if pd.api.types.is_numeric_dtype(df_work[col]):
        df_work[col] = df_work[col].fillna(df_work[col].${preprocessing.missingStrategy === "impute_median_mode" ? "median" : "mean"}())
    else:
        df_work[col] = df_work[col].fillna(df_work[col].mode()[0] if not df_work[col].mode().empty else "Unknown")
df_work[target_col] = df_work[target_col].dropna()
` : ""}
# Pisahkan Fitur (X) dan Target (y)
X = df_work[feature_cols]
y = df_work[target_col]

${preprocessing.encodeCategorical ? `# Encode kategorikal X dengan pd.get_dummies
X = pd.get_dummies(X, drop_first=True)
` : ""}${isClassification ? `# Encode target jika berupa teks
if not pd.api.types.is_numeric_dtype(y):
    y, y_uniques = pd.factorize(y)
` : ""}
# 3. Train-Test Split (Mencegah Data Leakage)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=${preprocessing.testSize}, random_state=${preprocessing.randomState}${isClassification ? ", stratify=y if len(np.unique(y)) > 1 and min(pd.Series(y).value_counts()) >= 2 else None" : ""}
)

${preprocessing.scaling === "standard" ? `# Scaling fitted HANYA pada X_train, kemudian transform pada X_test
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
` : preprocessing.scaling === "minmax" ? `# Scaling MinMaxScaler
scaler = MinMaxScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
` : ""}
# 4. Inisialisasi & Pelatihan Model
${isClassification ? (
    modelType === "random_forest"
        ? `model = RandomForestClassifier(n_estimators=100, random_state=${preprocessing.randomState})`
        : modelType === "decision_tree"
            ? `model = DecisionTreeClassifier(max_depth=5, random_state=${preprocessing.randomState})`
            : `model = LogisticRegression(max_iter=1000, random_state=${preprocessing.randomState})`
) : (
    modelType === "random_forest_regressor"
        ? `model = RandomForestRegressor(n_estimators=100, random_state=${preprocessing.randomState})`
        : modelType === "decision_tree"
            ? `model = DecisionTreeRegressor(max_depth=5, random_state=${preprocessing.randomState})`
            : `model = LinearRegression()`
)}
model.fit(X_train, y_train)

# 5. Prediksi & Evaluasi
y_pred = model.predict(X_test)

${isClassification ? `acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

print(f"\\nHASIL EVALUASI MODEL:")
print(f" - Akurasi:  {acc:.4f} ({acc*100:.1f}%)")
print(f" - Presisi:  {prec:.4f}")
print(f" - Recall:   {rec:.4f}")
print(f" - F1-Score: {f1:.4f}")

# Visualisasi Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6, 5))
plt.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
plt.title('Confusion Matrix')
plt.colorbar()
tick_marks = np.arange(len(np.unique(y_test)))
plt.xticks(tick_marks, tick_marks)
plt.yticks(tick_marks, tick_marks)
for i in range(cm.shape[0]):
    for j in range(cm.shape[1]):
        plt.text(j, i, format(cm[i, j], 'd'),
                 horizontalalignment="center",
                 color="white" if cm[i, j] > cm.max() / 2. else "black")
plt.ylabel('Nilai Aktual')
plt.xlabel('Nilai Prediksi')
plt.tight_layout()
plt.show()
` : `mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print(f"\\nHASIL EVALUASI REGRESI:")
print(f" - MAE:  {mae:.4f}")
print(f" - MSE:  {mse:.4f}")
print(f" - RMSE: {rmse:.4f}")
print(f" - R²:   {r2:.4f}")

# Visualisasi Aktual vs Prediksi
plt.figure(figsize=(6.5, 4.5))
plt.scatter(y_test, y_pred, alpha=0.6, color='#38bdf8', edgecolors='k')
min_val = min(float(y_test.min()), float(y_pred.min()))
max_val = max(float(y_test.max()), float(y_pred.max()))
plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2, label='Garis Ideal (y=x)')
plt.xlabel('Nilai Aktual')
plt.ylabel('Nilai Prediksi')
plt.title('Aktual vs Prediksi')
plt.legend()
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
`}
print("\\nEksperimen selesai!")
`;
}
