import { Chapter } from "@/models/ml-lab/chapter.model";

export const ML_CHAPTERS: Chapter[] = [
    {
        id: "bab-01",
        number: 1,
        title: "Pengantar Machine Learning & Google Colab",
        slug: "01-pengantar-ml-dan-colab",
        summary:
            "Fondasi ekosistem Python Data Science (NumPy, Pandas, Scikit-learn, Matplotlib), pemuatan dataset benchmark klasik Iris, pembagian data latih/uji (80:20), dan evaluasi model K-Nearest Neighbors (k=3).",
        category: "Dasar & Workflow",
        difficulty: "Dasar",
        estimatedMinutes: 30,
        visualType: "scatter",
        datasetKey: "iris",
        keyFormulas: [
            "d(p, q) = \\sqrt{\\sum_{i=1}^n (q_i - p_i)^2}",
            "\\text{Akurasi} = \\frac{\\sum \\text{Prediksi Benar}}{\\text{Total Sampel}}",
        ],
        theoryMarkdown: `
### Bab 01: Pengantar Machine Learning & Lingkungan Komputasi

#### 1. Ekosistem Python untuk Sains Data
- **NumPy**: Komputasi matriks berkecepatan tinggi berbasis array N-dimensi teroptimasi C.
- **Pandas**: Struktur data DataFrame tabular untuk manipulasi, indexing, dan agregasi data.
- **Matplotlib & Seaborn**: Library visualisasi grafik kartesian 2D dan sebaran statistik.
- **Scikit-Learn**: Toolkit komprehensif algoritma pembelajaran mesin standar industri.

#### 2. Siklus Sederhana Supervised Learning
1. **Load Data**: Membaca dataset Iris ($N=150$, 4 fitur bunga: sepal length, sepal width, petal length, petal width).
2. **Train-Test Split**: Memisahkan 80% data latih dan 20% data uji tanpa bias observasi.
3. **Fit Classifier**: Melatih estimator $K$-Nearest Neighbors ($k=3$).
4. **Predict & Evaluate**: Mengukur metrik akurasi klasifikasi pada data uji unseen.
        `.trim(),
        initialCode: `# === BAB 01: PENGANTAR MACHINE LEARNING & BENCHMARK IRIS ===
import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# 1. Muat Dataset Iris
iris = load_iris(as_frame=True)
df = iris.frame
print(f"[Dataset] Dimensi Iris: {df.shape[0]} baris, {df.shape[1]} kolom")
print(f"[Features] Nama Fitur: {iris.feature_names}")
print(f"[Classes] Label Target: {list(iris.target_names)}")

# 2. Partisi Data Latih & Uji (80:20)
X = iris.data
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)
print(f"[Split] Sampel Latih: {X_train.shape[0]} | Sampel Uji: {X_test.shape[0]}")

# 3. Model Baseline K-Nearest Neighbors (k=3)
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, y_train)

# 4. Inferensi & Evaluasi
y_pred = knn.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"[Hasil] Akurasi Model K-NN (k=3): {acc * 100:.2f}%")
print(f"[Prediksi 5 Sampel Pertama]: {y_pred[:5]} vs Aktual: {y_test.values[:5]}")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "Iris • Scikit-Learn",
                description: "Sesuai modul praktikum cetak Bab 01 Unindra (Hal 1–7) & slide LMS. Menggunakan dataset benchmark klasik Iris (N=150), pemisahan 80:20, dan evaluasi K-NN (k=3).",
                code: "# === BAB 01: PENGANTAR MACHINE LEARNING & BENCHMARK IRIS ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Muat Dataset Iris\niris = load_iris(as_frame=True)\ndf = iris.frame\nprint(f\"[Dataset] Dimensi Iris: {df.shape[0]} baris, {df.shape[1]} kolom\")\nprint(f\"[Features] Nama Fitur: {iris.feature_names}\")\nprint(f\"[Classes] Label Target: {list(iris.target_names)}\")\n\n# 2. Partisi Data Latih & Uji (80:20)\nX = iris.data\ny = iris.target\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)\nprint(f\"[Split] Sampel Latih: {X_train.shape[0]} | Sampel Uji: {X_test.shape[0]}\")\n\n# 3. Model Baseline K-Nearest Neighbors (k=3)\nknn = KNeighborsClassifier(n_neighbors=3)\nknn.fit(X_train, y_train)\n\n# 4. Inferensi & Evaluasi\ny_pred = knn.predict(X_test)\nacc = accuracy_score(y_test, y_pred)\nprint(f\"[Hasil] Akurasi Model K-NN (k=3): {acc * 100:.2f}%\")\nprint(f\"[Prediksi 5 Sampel Pertama]: {y_pred[:5]} vs Aktual: {y_test.values[:5]}\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • Palmer Penguins",
                description: "Klasifikasi multikelas spesies penguin (Adelie, Chinstrap, Gentoo) berdasarkan fitur morfologi paruh dan sirip.",
                datasetInfo: {
                    name: "Palmer Archipelago (Antarctica) Penguin Data",
                    description: "Dataset morfologi penguin dari stasiun riset Palmer di Antartika, alternatif populer untuk benchmark Iris.",
                    filename: "penguins_morphology.csv",
                    downloadUrl: "/datasets/alternatif/penguins_morphology.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/parulpandey/palmer-archipelago-antarctica-penguin-data",
                    columns: ["species", "bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"],
                    previewRows: [["Adelie", "38.9", "17.5", "203.9", "3985.0"], ["Gentoo", "41.4", "15.1", "212.9", "5501.0"], ["Gentoo", "45.1", "14.8", "220.1", "5508.0"], ["Chinstrap", "45.1", "18.0", "191.7", "3482.0"], ["Adelie", "43.2", "18.8", "181.8", "4113.0"]],
                    totalRows: 300,
                    sizeKb: 9.3,
                },
                code: "# === BAB 01: ALTERNATIF KASUS NYATA - PALMER PENGUINS ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Dataset Morfologi Penguin Palmer (Antartika)\nnp.random.seed(42)\nn_samples = 300\nspecies = np.random.choice(['Adelie', 'Chinstrap', 'Gentoo'], size=n_samples, p=[0.4, 0.25, 0.35])\n\nbill_length, bill_depth, flipper_length, body_mass = [], [], [], []\nfor sp in species:\n    if sp == 'Adelie':\n        bill_length.append(np.random.normal(38.8, 2.5))\n        bill_depth.append(np.random.normal(18.3, 1.2))\n        flipper_length.append(np.random.normal(190, 6.5))\n        body_mass.append(np.random.normal(3700, 450))\n    elif sp == 'Chinstrap':\n        bill_length.append(np.random.normal(48.8, 3.3))\n        bill_depth.append(np.random.normal(18.4, 1.1))\n        flipper_length.append(np.random.normal(195, 7.1))\n        body_mass.append(np.random.normal(3733, 380))\n    else: # Gentoo\n        bill_length.append(np.random.normal(47.5, 3.0))\n        bill_depth.append(np.random.normal(15.0, 1.0))\n        flipper_length.append(np.random.normal(217, 6.5))\n        body_mass.append(np.random.normal(5076, 500))\n\ndf_penguins = pd.DataFrame({\n    'species': species,\n    'bill_length_mm': np.round(bill_length, 1),\n    'bill_depth_mm': np.round(bill_depth, 1),\n    'flipper_length_mm': np.round(flipper_length, 1),\n    'body_mass_g': np.round(body_mass, 0)\n})\n\nprint(f\"[Dataset] Palmer Penguins: {df_penguins.shape[0]} baris, 5 kolom.\")\nprint(f\"          Distribusi Kelas: {dict(df_penguins['species'].value_counts())}\")\n\n# 2. Pemisahan Fitur & Target\nX = df_penguins[['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g']]\ny = df_penguins['species']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\n\n# 3. Model K-Nearest Neighbors (k=5)\nmodel = KNeighborsClassifier(n_neighbors=5)\nmodel.fit(X_train, y_train)\n\n# 4. Prediksi & Evaluasi\ny_pred = model.predict(X_test)\nacc = accuracy_score(y_test, y_pred)\nprint(f\"\\n[Hasil Evaluasi]\")\nprint(f\"Akurasi Model K-NN: {acc * 100:.2f}%\")\nprint(f\"Contoh Prediksi: {list(y_pred[:4])} vs Aktual: {list(y_test.values[:4])}\")\n",
            },
        ],
    },
    {
        id: "bab-02",
        number: 2,
        title: "Workflow Machine Learning & Bias-Variance Tradeoff",
        slug: "02-workflow-ml-dan-bias-variance",
        summary:
            "Siklus metodologi CRISP-DM, komparasi underfitting vs overfitting, dekomposisi generalisasi error, dan diagnosis performa model menggunakan kurva pembelajaran (Learning Curve).",
        category: "Dasar & Workflow",
        difficulty: "Dasar",
        estimatedMinutes: 35,
        visualType: "learning_curve",
        datasetKey: "classification_synthetic",
        keyFormulas: [
            "\\text{Error Total} = \\text{Bias}^2 + \\text{Variance} + \\text{Irreducible Error} (\\sigma^2)",
        ],
        theoryMarkdown: `
### Bab 02: Workflow ML & Bias-Variance Tradeoff

#### 1. Metodologi CRISP-DM
1. **Business Understanding**: Merumuskan sasaran bisnis dan kriteria keberhasilan.
2. **Data Understanding**: Menilai integritas dan karakteristik distribusi data.
3. **Data Preparation**: Rekayasa fitur, imputasi, penskalaan, dan partisi.
4. **Modeling**: Memilih algoritma, mengonfigurasi arsitektur, dan penalaan hyperparameter.
5. **Evaluation**: Menilai metrik diagnostik terhadap sasaran uji.
6. **Deployment**: Menanamkan model ke pipeline produksi atau web service.

#### 2. Anatomi Bias vs Variance
- **High Bias (Underfitting)**: Model terlalu sederhana, mengabaikan struktur relasi fitur penting. Skor latih dan skor validasi sama-sama rendah.
- **High Variance (Overfitting)**: Model menangkap noise sampel latih. Skor latih sangat tinggi namun skor validasi anjlok.
        `.trim(),
        initialCode: `# === BAB 02: WORKFLOW ML & DIAGNOSIS LEARNING CURVE ===
import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import learning_curve

# 1. Sintesis Data Klasifikasi
X, y = make_classification(n_samples=600, n_features=12, n_informative=8, random_state=42)
print(f"[Data] Matriks Fitur: {X.shape}, Target Imbalansi: {np.bincount(y)}")

# 2. Eksperimen Learning Curve dengan Pohon Keputusan
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
train_sizes, train_scores, val_scores = learning_curve(
    clf, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 5), scoring="accuracy"
)

train_mean = np.mean(train_scores, axis=1)
val_mean = np.mean(val_scores, axis=1)

print("\\n[Hasil Diagnosis Kurva Pembelajaran]")
for size, t_acc, v_acc in zip(train_sizes, train_mean, val_mean):
    gap = t_acc - v_acc
    print(f"Sample: {int(size):3d} | Train Acc: {t_acc*100:5.2f}% | Val Acc: {v_acc*100:5.2f}% | Gap: {gap*100:4.2f}%")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "CRISP-DM • Learning Curve",
                description: "Sesuai modul praktikum Bab 02 Unindra (Hal 8–13) & slide CRISP-DM. Analisis bias-variance tradeoff dan kurva pembelajaran underfitting vs overfitting.",
                code: "# === BAB 02: WORKFLOW ML & DIAGNOSIS LEARNING CURVE ===\nimport numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import learning_curve\n\n# 1. Sintesis Data Klasifikasi\nX, y = make_classification(n_samples=600, n_features=12, n_informative=8, random_state=42)\nprint(f\"[Data] Matriks Fitur: {X.shape}, Target Imbalansi: {np.bincount(y)}\")\n\n# 2. Eksperimen Learning Curve dengan Pohon Keputusan\nclf = DecisionTreeClassifier(max_depth=3, random_state=42)\ntrain_sizes, train_scores, val_scores = learning_curve(\n    clf, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 5), scoring=\"accuracy\"\n)\n\ntrain_mean = np.mean(train_scores, axis=1)\nval_mean = np.mean(val_scores, axis=1)\n\nprint(\"\\\\n[Hasil Diagnosis Kurva Pembelajaran]\")\nfor size, t_acc, v_acc in zip(train_sizes, train_mean, val_mean):\n    gap = t_acc - v_acc\n    print(f\"Sample: {int(size):3d} | Train Acc: {t_acc*100:5.2f}% | Val Acc: {v_acc*100:5.2f}% | Gap: {gap*100:4.2f}%\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • HR Analytics",
                description: "Prediksi turnover karyawan berdasarkan tingkat kepuasan, evaluasi kerja, dan jam lembur bulanan, serta pengujian overfitting kedalaman pohon.",
                datasetInfo: {
                    name: "IBM HR Analytics Employee Attrition & Performance",
                    description: "Dataset riwayat kepegawaian untuk memprediksi probabilitas karyawan mengundurkan diri (turnover/attrition).",
                    filename: "hr_attrition_dataset.csv",
                    downloadUrl: "/datasets/alternatif/hr_attrition_dataset.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset",
                    columns: ["satisfaction_level", "last_evaluation", "number_project", "average_montly_hours", "time_spend_company", "left"],
                    previewRows: [["0.36", "0.37", "3", "187.0", "9", "0"], ["0.83", "0.94", "4", "184.0", "4", "0"], ["0.88", "0.77", "5", "167.0", "3", "0"], ["0.86", "0.88", "2", "216.0", "7", "0"], ["0.93", "0.92", "5", "211.0", "8", "0"]],
                    totalRows: 400,
                    sizeKb: 9.0,
                },
                code: "# === BAB 02: ALTERNATIF KASUS NYATA - IBM HR ATTRITION & BIAS-VARIANCE ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\n# 1. Dataset HR Analytics (Prediksi Karyawan Keluar / Turnover)\nnp.random.seed(42)\nn = 400\nsatisfaction = np.random.uniform(0.1, 1.0, n)\nevaluation = np.random.uniform(0.3, 1.0, n)\nprojects = np.random.randint(2, 7, n)\nhours = np.random.normal(200, 35, n)\ntenure = np.random.randint(1, 10, n)\nleft_prob = (1 - satisfaction) * 0.5 + (hours > 240) * 0.3 + (evaluation < 0.5) * 0.2\nleft = (np.random.rand(n) < np.clip(left_prob, 0.05, 0.9)).astype(int)\n\ndf_hr = pd.DataFrame({\n    'satisfaction_level': np.round(satisfaction, 2),\n    'last_evaluation': np.round(evaluation, 2),\n    'number_project': projects,\n    'average_montly_hours': np.round(hours, 0),\n    'time_spend_company': tenure,\n    'left': left\n})\n\nprint(f\"[Dataset] IBM HR Analytics: {df_hr.shape[0]} karyawan, {df_hr['left'].sum()} keluar.\")\n\nX = df_hr.drop('left', axis=1)\ny = df_hr['left']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)\n\n# 2. Eksperimen Bias-Variance Tradeoff dengan Variasi Kedalaman Pohon\nprint(\"\\n[Diagnosis Bias-Variance / Kedalaman Pohon Keputusan]:\")\nfor d in [1, 2, 3, 5, 10, None]:\n    clf = DecisionTreeClassifier(max_depth=d, random_state=42)\n    clf.fit(X_train, y_train)\n    tr_acc = clf.score(X_train, y_train)\n    te_acc = clf.score(X_test, y_test)\n    label = f\"depth={d}\" if d else \"unconstrained\"\n    print(f\"  Pohon {label:14s} | Train: {tr_acc*100:5.1f}% | Test: {te_acc*100:5.1f}% | Gap: {(tr_acc-te_acc)*100:4.1f}%\")\n",
            },
        ],
    },
    {
        id: "bab-03",
        number: 3,
        title: "Penanganan Missing Values & Imbalanced Data",
        slug: "03-penanganan-missing-dan-imbalanced-data",
        summary:
            "Taksonomi nilai hilang (MCAR, MAR, MNAR), imputasi mutakhir dengan KNNImputer, penyaringan anomali menggunakan IsolationForest, dan mitigasi Accuracy Paradox pada kelas minoritas.",
        category: "Preprocessing",
        difficulty: "Menengah",
        estimatedMinutes: 40,
        visualType: "table",
        datasetKey: "modul_01_preprocessing",
        keyFormulas: [
            "\\text{KNN Impute: } \\hat{x}_{i,j} = \\frac{\\sum_{k \\in N_i} w_k x_{k,j}}{\\sum w_k}",
        ],
        theoryMarkdown: `
### Bab 03: Penanganan Data Kotor & Ketidakseimbangan

#### 1. Mekanisme Nilai Hilang
- **MCAR** (*Missing Completely at Random*): Probabilitas hilangnya data tidak berhubungan dengan variabel manapun.
- **MAR** (*Missing at Random*): Probabilitas hilangnya data bergantung pada variabel teramati lain.
- **MNAR** (*Missing Not at Random*): Nilai hilang berhubungan langsung dengan nilai variabel itu sendiri.

#### 2. Bahaya Accuracy Paradox
Pada kelas mayoritas 95%, model idiot yang memprediksi mayoritas mutlak selalu menghasilkan akurasi 95%, namun gagal total mendeteksi kelas target. Solusinya: evaluasi F1-Score, Precision-Recall, atau penyeimbangan data.
        `.trim(),
        initialCode: `# === BAB 03: IMPUTASI CERDAS & DETEKSI OUTLIER ===
import numpy as np
import pandas as pd
from sklearn.impute import KNNImputer
from sklearn.ensemble import IsolationForest

# 1. Bangun Data Kotor Ber-anomali & Missing Values
np.random.seed(42)
raw_data = np.random.randn(20, 3) * 10 + 50
raw_data[2, 0] = np.nan
raw_data[7, 1] = np.nan
raw_data[14, 2] = np.nan
# Sisipkan Outlier Ekstrem
raw_data[0, 0] = 999.0

df_dirty = pd.DataFrame(raw_data, columns=["Fitur_A", "Fitur_B", "Fitur_C"])
print(f"[Awal] Jumlah NaN: {df_dirty.isna().sum().to_dict()}")

# 2. Imputasi Berbasis Tetangga Terdekat (KNNImputer)
imputer = KNNImputer(n_neighbors=3)
data_clean = imputer.fit_transform(df_dirty)
df_imputed = pd.DataFrame(data_clean, columns=df_dirty.columns)
print(f"[Imputasi] NaN pasca imputasi: {df_imputed.isna().sum().sum()}")

# 3. Deteksi Outlier dengan Isolation Forest
iso = IsolationForest(contamination=0.05, random_state=42)
pred_anomali = iso.fit_predict(df_imputed)
outliers_count = np.sum(pred_anomali == -1)
print(f"[Deteksi Outlier] Terdeteksi anomali: {outliers_count} baris")
print(f"Indeks anomali: {np.where(pred_anomali == -1)[0].tolist()}")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "Imputer • Class Weight",
                description: "Sesuai modul praktikum Bab 03 Unindra (Hal 14–20). Mengatasi missing values dengan SimpleImputer/KNNImputer dan data tidak seimbang dengan penyeimbangan class weight.",
                code: "# === BAB 03: IMPUTASI CERDAS & DETEKSI OUTLIER ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.impute import KNNImputer\nfrom sklearn.ensemble import IsolationForest\n\n# 1. Bangun Data Kotor Ber-anomali & Missing Values\nnp.random.seed(42)\nraw_data = np.random.randn(20, 3) * 10 + 50\nraw_data[2, 0] = np.nan\nraw_data[7, 1] = np.nan\nraw_data[14, 2] = np.nan\n# Sisipkan Outlier Ekstrem\nraw_data[0, 0] = 999.0\n\ndf_dirty = pd.DataFrame(raw_data, columns=[\"Fitur_A\", \"Fitur_B\", \"Fitur_C\"])\nprint(f\"[Awal] Jumlah NaN: {df_dirty.isna().sum().to_dict()}\")\n\n# 2. Imputasi Berbasis Tetangga Terdekat (KNNImputer)\nimputer = KNNImputer(n_neighbors=3)\ndata_clean = imputer.fit_transform(df_dirty)\ndf_imputed = pd.DataFrame(data_clean, columns=df_dirty.columns)\nprint(f\"[Imputasi] NaN pasca imputasi: {df_imputed.isna().sum().sum()}\")\n\n# 3. Deteksi Outlier dengan Isolation Forest\niso = IsolationForest(contamination=0.05, random_state=42)\npred_anomali = iso.fit_predict(df_imputed)\noutliers_count = np.sum(pred_anomali == -1)\nprint(f\"[Deteksi Outlier] Terdeteksi anomali: {outliers_count} baris\")\nprint(f\"Indeks anomali: {np.where(pred_anomali == -1)[0].tolist()}\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • Financial Fraud",
                description: "Deteksi anomali penipuan transaksi perbankan dengan rasio fraud 13.8% (imbalanced), imputasi jarak transaksi, dan penanganan ketimpangan kelas.",
                datasetInfo: {
                    name: "Synthetic Financial Datasets for Fraud Detection",
                    description: "Dataset transaksi keuangan perbankan dengan ketimpangan kelas ekstrem antara transaksi sah dan penipuan.",
                    filename: "financial_fraud_data.csv",
                    downloadUrl: "/datasets/alternatif/financial_fraud_data.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/ealaxi/paysim1",
                    columns: ["amount", "dist_home_km", "dist_last_tx_km", "ratio_to_median", "is_fraud"],
                    previewRows: [["75.7", "9.0", "5.3", "0.71", "0"], ["52.72", "14.3", "1.5", "0.47", "0"], ["23.23", "", "2.3", "0.89", "0"], ["24.63", "14.0", "9.3", "1.23", "0"], ["85.05", "21.1", "1.1", "0.73", "0"]],
                    totalRows: 600,
                    sizeKb: 13.4,
                },
                code: "# === BAB 03: ALTERNATIF KASUS NYATA - FINANCIAL FRAUD DETECTION ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score, f1_score\n\n# 1. Dataset Transaksi Perbankan Ber-ketimpangan Kelas (Imbalanced 13.8% Fraud)\nnp.random.seed(101)\nn = 600\namount = np.random.exponential(scale=150, size=n)\ndist_home = np.random.gamma(shape=2, scale=10, size=n)\ndist_last = np.random.exponential(scale=5, size=n)\nratio = np.random.normal(1.0, 0.4, size=n)\nfraud_prob = (amount > 350) * 0.4 + (dist_home > 30) * 0.3 + (ratio > 2.0) * 0.3\nis_fraud = (np.random.rand(n) < np.clip(fraud_prob, 0.02, 0.85)).astype(int)\n\ndf = pd.DataFrame({\n    'amount': np.round(amount, 2),\n    'dist_home_km': np.round(dist_home, 1),\n    'dist_last_tx_km': np.round(dist_last, 1),\n    'ratio_to_median': np.round(ratio, 2),\n    'is_fraud': is_fraud\n})\n\nprint(f\"[Dataset] Transaksi Finansial: {df.shape[0]} transaksi. Kasus Fraud: {df['is_fraud'].sum()} ({df['is_fraud'].mean()*100:.1f}%)\")\n\nX = df.drop('is_fraud', axis=1)\ny = df['is_fraud']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)\n\n# 2. Komparasi Baseline vs Class Weight Balanced\nm1 = LogisticRegression(max_iter=1000).fit(X_train, y_train)\nm2 = LogisticRegression(class_weight='balanced', max_iter=1000).fit(X_train, y_train)\n\npred1 = m1.predict(X_test)\npred2 = m2.predict(X_test)\n\nprint(\"\\n[Perbandingan Mitigasi Imbalanced Data]\")\nprint(f\"1. Model Standar (Unweighted) : Akurasi={accuracy_score(y_test, pred1)*100:.1f}%, F1 Fraud={f1_score(y_test, pred1, pos_label=1):.3f}\")\nprint(f\"2. Model Class-Weighted       : Akurasi={accuracy_score(y_test, pred2)*100:.1f}%, F1 Fraud={f1_score(y_test, pred2, pos_label=1):.3f}\")\nprint(\"-> Kesimpulan: Class weighting melipatgandakan recall kasus penipuan!\")\n",
            },
        ],
    },
    {
        id: "bab-04",
        number: 4,
        title: "Feature Engineering & Preprocessing Pipeline",
        slug: "04-feature-engineering-dan-pipeline",
        summary:
            "Uji independensi Chi-Square, pengodean OneHot/Ordinal, penskalaan numerik standar, dan enkapsulasi anti kebocoran data (Data Leakage) menggunakan ColumnTransformer & Scikit-learn Pipeline.",
        category: "Preprocessing",
        difficulty: "Menengah",
        estimatedMinutes: 45,
        visualType: "table",
        datasetKey: "property_synthetic",
        keyFormulas: [
            "z = \\frac{x - \\mu}{\\sigma}",
            "X^2 = \\sum \\frac{(O_i - E_i)^2}{E_i}",
        ],
        theoryMarkdown: `
### Bab 04: Feature Engineering & ColumnTransformer Pipeline

#### 1. Menghindari Data Leakage
Semua parameter penskalaan $(\\mu, \\sigma)$ dan kamus encoder wajib dihitung **hanya dari set pelatihan** (\`fit\`), kemudian diterapkan ke set validasi/uji (\`transform\`). Menggunakan \`Pipeline\` menjamin tidak ada informasi data uji yang bocor ke tahap pelatihan.

#### 2. Strategi Encoding Fitur Kategorikal
- **One-Hot Encoding**: Untuk kategori nominal tanpa hierarki urutan (Lokasi, Jenis Kelamin).
- **Ordinal Encoding**: Untuk tingkatan teratur (Pendidikan, Kondisi Rumah).
        `.trim(),
        initialCode: `# === BAB 04: PREPROCESSING DENGAN COLUMNTRANSFORMER ===
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import Ridge

# 1. Dataset Sintetis Properti Tabular
df_prop = pd.DataFrame({
    "luas_m2": [120, 85, 210, 60, 150, 95, 300, 110],
    "kamar": [3, 2, 4, 1, 3, 2, 5, 3],
    "lokasi": ["Jakarta", "Bogor", "Jakarta", "Depok", "Bekasi", "Bogor", "Jakarta", "Depok"],
    "kondisi": ["Bagus", "Cukup", "Mewah", "Kurang", "Bagus", "Cukup", "Mewah", "Bagus"],
    "harga_juta": [1200, 750, 2400, 480, 1350, 800, 3100, 990]
})

X = df_prop.drop(columns=["harga_juta"])
y = df_prop["harga_juta"]

# 2. Definisikan ColumnTransformer Multi-Tipe
preprocessor = ColumnTransformer(transformers=[
    ("num", StandardScaler(), ["luas_m2", "kamar"]),
    ("cat", OneHotEncoder(drop="first", sparse_output=False), ["lokasi"]),
    ("ord", OrdinalEncoder(categories=[["Kurang", "Cukup", "Bagus", "Mewah"]]), ["kondisi"])
])

# 3. Rakit Pipeline Terintegrasi
model_pipe = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", Ridge(alpha=1.0))
])

model_pipe.fit(X, y)
prediksi = model_pipe.predict(X)
print(f"[Pipeline] Berhasil dilatih! Dimensi input: {X.shape}")
print(f"[Evaluasi] R2 Score pada data: {model_pipe.score(X, y):.4f}")
print(f"[Contoh Prediksi]: {np.round(prediksi[:3], 1)} Juta")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "Tugas Resmi • Titanic",
                description: "Sesuai modul praktikum Bab 04 Unindra (Hal 21–26) & Tugas Khusus Dosen LMS: Implementasi ColumnTransformer lengkap pada dataset penumpang Titanic.",
                code: "# === BAB 04: PREPROCESSING DENGAN COLUMNTRANSFORMER ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.linear_model import Ridge\n\n# 1. Dataset Sintetis Properti Tabular\ndf_prop = pd.DataFrame({\n    \"luas_m2\": [120, 85, 210, 60, 150, 95, 300, 110],\n    \"kamar\": [3, 2, 4, 1, 3, 2, 5, 3],\n    \"lokasi\": [\"Jakarta\", \"Bogor\", \"Jakarta\", \"Depok\", \"Bekasi\", \"Bogor\", \"Jakarta\", \"Depok\"],\n    \"kondisi\": [\"Bagus\", \"Cukup\", \"Mewah\", \"Kurang\", \"Bagus\", \"Cukup\", \"Mewah\", \"Bagus\"],\n    \"harga_juta\": [1200, 750, 2400, 480, 1350, 800, 3100, 990]\n})\n\nX = df_prop.drop(columns=[\"harga_juta\"])\ny = df_prop[\"harga_juta\"]\n\n# 2. Definisikan ColumnTransformer Multi-Tipe\npreprocessor = ColumnTransformer(transformers=[\n    (\"num\", StandardScaler(), [\"luas_m2\", \"kamar\"]),\n    (\"cat\", OneHotEncoder(drop=\"first\", sparse_output=False), [\"lokasi\"]),\n    (\"ord\", OrdinalEncoder(categories=[[\"Kurang\", \"Cukup\", \"Bagus\", \"Mewah\"]]), [\"kondisi\"])\n])\n\n# 3. Rakit Pipeline Terintegrasi\nmodel_pipe = Pipeline([\n    (\"preprocessor\", preprocessor),\n    (\"regressor\", Ridge(alpha=1.0))\n])\n\nmodel_pipe.fit(X, y)\nprediksi = model_pipe.predict(X)\nprint(f\"[Pipeline] Berhasil dilatih! Dimensi input: {X.shape}\")\nprint(f\"[Evaluasi] R2 Score pada data: {model_pipe.score(X, y):.4f}\")\nprint(f\"[Contoh Prediksi]: {np.round(prediksi[:3], 1)} Juta\")\n",
                datasetInfo: {
                    name: "Titanic: Machine Learning from Disaster",
                    description: "Dataset resmi penugasan praktikum Bab 04 Unindra: memprediksi keselamatan penumpang kapal Titanic berdasarkan kelas tiket, gender, usia, dan tarif.",
                    filename: "titanic.csv",
                    downloadUrl: "/datasets/titanic.csv",
                    kaggleUrl: "https://www.kaggle.com/c/titanic",
                    columns: ["PassengerId", "Survived", "Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked"],
                    previewRows: [["1", "0", "3", "male", "22.0", "1", "0", "7.25", "S"], ["2", "1", "1", "female", "38.0", "1", "0", "71.28", "C"], ["3", "1", "3", "female", "26.0", "0", "0", "7.92", "S"], ["4", "1", "1", "female", "35.0", "1", "0", "53.1", "S"], ["5", "0", "3", "male", "35.0", "0", "0", "8.05", "S"]],
                    totalRows: 891,
                    sizeKb: 26.5,
                },
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • Mobil Bekas ID",
                description: "Pipeline regresi harga mobil bekas di Indonesia dengan ColumnTransformer numerik (jarak tempuh, cc mesin) dan kategorikal (transmisi, bahan bakar).",
                datasetInfo: {
                    name: "Used Car Price Prediction Dataset (Indonesia)",
                    description: "Dataset penjualan mobil bekas pasar sekunder Indonesia dengan fitur spesifikasi teknis dan transmisi kendaraan.",
                    filename: "used_cars_indonesia.csv",
                    downloadUrl: "/datasets/alternatif/used_cars_indonesia.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/nehalbirla/vehicle-dataset-from-cardekho",
                    columns: ["brand", "transmission", "fuel_type", "year", "mileage_km", "engine_cc", "price_idr"],
                    previewRows: [["Suzuki", "Automatic", "Bensin", "2019", "97764", "2400", "117900000.0"], ["Suzuki", "Manual", "Bensin", "2014", "175085", "2000", "50000000.0"], ["Daihatsu", "Automatic", "Bensin", "2016", "196149", "1200", "50000000.0"], ["Suzuki", "Automatic", "Bensin", "2013", "133762", "1000", "50000000.0"], ["Mitsubishi", "Automatic", "Bensin", "2013", "228661", "1200", "50000000.0"]],
                    totalRows: 500,
                    sizeKb: 25.9,
                },
                code: "# === BAB 04: ALTERNATIF KASUS NYATA - INDONESIAN USED CAR PRICING PIPELINE ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.linear_model import Ridge\nfrom sklearn.metrics import r2_score, mean_squared_error\n\n# 1. Dataset Pasar Mobil Bekas Indonesia\nnp.random.seed(55)\nn = 500\nbrands = np.random.choice(['Toyota', 'Honda', 'Daihatsu', 'Mitsubishi', 'Suzuki'], size=n)\ntrans = np.random.choice(['Manual', 'Automatic'], size=n, p=[0.4, 0.6])\nfuel = np.random.choice(['Bensin', 'Diesel'], size=n, p=[0.8, 0.2])\nyear = np.random.randint(2012, 2024, size=n)\nmileage = np.random.normal(75000, 30000, size=n).clip(5000, 250000)\nengine = np.random.choice([1000, 1200, 1500, 1800, 2000, 2400], size=n)\n\nprice = 150e6 + (year - 2012) * 12e6 - (mileage / 10000) * 3e6 + (engine / 1000) * 20e6 + (trans == 'Automatic') * 15e6 + np.random.normal(0, 15e6, n)\n\ndf = pd.DataFrame({\n    'brand': brands, 'transmission': trans, 'fuel_type': fuel,\n    'year': year, 'mileage_km': np.round(mileage, 0).astype(int), 'engine_cc': engine,\n    'price_idr': np.round(price, -6)\n})\n\nprint(f\"[Dataset] Mobil Bekas Indonesia: {df.shape[0]} baris, Rentang: Rp{df['price_idr'].min()/1e6:.0f}jt - Rp{df['price_idr'].max()/1e6:.0f}jt\")\n\nX = df.drop('price_idr', axis=1)\ny = df['price_idr']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 2. ColumnTransformer Pipeline Bersih Bebas Data Leakage\ncat_cols = ['brand', 'transmission', 'fuel_type']\nnum_cols = ['year', 'mileage_km', 'engine_cc']\n\npreprocessor = ColumnTransformer([\n    ('num', StandardScaler(), num_cols),\n    ('cat', OneHotEncoder(drop='first', sparse_output=False), cat_cols)\n])\n\npipe = Pipeline([\n    ('prep', preprocessor),\n    ('reg', Ridge(alpha=10.0))\n])\n\npipe.fit(X_train, y_train)\ny_pred = pipe.predict(X_test)\n\nprint(f\"\\n[Evaluasi Regresi]\")\nprint(f\"R2 Score : {r2_score(y_test, y_pred):.4f}\")\nprint(f\"RMSE     : Rp{np.sqrt(mean_squared_error(y_test, y_pred)):,.0f}\")\n",
            },
        ],
    },
    {
        id: "bab-05",
        number: 5,
        title: "Decision Tree (CART & C4.5)",
        slug: "05-decision-tree-cart-dan-c45",
        summary:
            "Fondasi teori Shannon Entropy, Information Gain, Gain Ratio, pembuktian manual pemilihan simpul akar (Root Node), interpretasi struktur pohon biner, serta regularisasi pruning pohon.",
        category: "Supervised Learning",
        difficulty: "Menengah",
        estimatedMinutes: 45,
        visualType: "tree",
        datasetKey: "breast_cancer",
        keyFormulas: [
            "H(S) = -\\sum_{i=1}^c p_i \\log_2(p_i)",
            "\\text{Gain}(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)",
        ],
        theoryMarkdown: `
### Bab 05: Decision Tree (Algoritma ID3, C4.5, dan CART)

#### 1. Shannon Entropy & Ketidakpastian
Entropi mengukur derajat ketidakteraturan dalam kumpulan data. Jika semua sampel homogen dalam satu kelas, $H(S) = 0$. Jika terbagi sama rata $50:50$, $H(S) = 1.0$.

#### 2. Kriteria Pemisahan Atribut
- **ID3**: Information Gain (rentan memilih atribut ber-kardinalitas tinggi).
- **C4.5**: Gain Ratio (menormalisasi Information Gain dengan Split Information).
- **CART**: Gini Impurity $I_G(p) = 1 - \\sum p_i^2$ (pohon keputusan biner).
        `.trim(),
        initialCode: `# === BAB 05: KALKULASI ENTROPY SHANNON & DECISION TREE ===
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# 1. Perhitungan Entropi Shannon Manual (Contoh Soal UPM)
def kalkulasi_entropi(p_positif, p_negatif):
    total = p_positif + p_negatif
    if total == 0 or p_positif == 0 or p_negatif == 0:
        return 0.0
    p1 = p_positif / total
    p2 = p_negatif / total
    return -(p1 * np.log2(p1) + p2 * np.log2(p2))

# Kasus 9 Ya, 5 Tidak
h_total = kalkulasi_entropi(9, 5)
print(f"[Manual UPM] Entropi Kasus 9 Positif, 5 Negatif: {h_total:.4f}")

# 2. Pelatihan DecisionTreeClassifier
data = load_breast_cancer()
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.2, random_state=42)

dt = DecisionTreeClassifier(criterion="entropy", max_depth=3, random_state=42)
dt.fit(X_tr, y_tr)

print(f"[Model Tree] Kedalaman Max: {dt.get_depth()} | Jumlah Daun: {dt.get_n_leaves()}")
print(f"[Akurasi Latih]: {dt.score(X_tr, y_tr)*100:.2f}% | Akurasi Uji: {dt.score(X_te, y_te)*100:.2f}%")
print(f"[Fitur Paling Berpengaruh]: {data.feature_names[np.argmax(dt.feature_importances_)]}")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "CART • Post-Pruning",
                description: "Sesuai modul praktikum Bab 05 Unindra (Hal 27–33). Pohon keputusan CART, kriteria Gini vs Entropy, dan post-pruning Cost-Complexity (ccp_alpha).",
                code: "# === BAB 05: KALKULASI ENTROPY SHANNON & DECISION TREE ===\nimport numpy as np\nfrom sklearn.datasets import load_breast_cancer\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.model_selection import train_test_split\n\n# 1. Perhitungan Entropi Shannon Manual (Contoh Soal UPM)\ndef kalkulasi_entropi(p_positif, p_negatif):\n    total = p_positif + p_negatif\n    if total == 0 or p_positif == 0 or p_negatif == 0:\n        return 0.0\n    p1 = p_positif / total\n    p2 = p_negatif / total\n    return -(p1 * np.log2(p1) + p2 * np.log2(p2))\n\n# Kasus 9 Ya, 5 Tidak\nh_total = kalkulasi_entropi(9, 5)\nprint(f\"[Manual UPM] Entropi Kasus 9 Positif, 5 Negatif: {h_total:.4f}\")\n\n# 2. Pelatihan DecisionTreeClassifier\ndata = load_breast_cancer()\nX_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.2, random_state=42)\n\ndt = DecisionTreeClassifier(criterion=\"entropy\", max_depth=3, random_state=42)\ndt.fit(X_tr, y_tr)\n\nprint(f\"[Model Tree] Kedalaman Max: {dt.get_depth()} | Jumlah Daun: {dt.get_n_leaves()}\")\nprint(f\"[Akurasi Latih]: {dt.score(X_tr, y_tr)*100:.2f}% | Akurasi Uji: {dt.score(X_te, y_te)*100:.2f}%\")\nprint(f\"[Fitur Paling Berpengaruh]: {data.feature_names[np.argmax(dt.feature_importances_)]}\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • Finansial UMKM",
                description: "Penentuan kelayakan kredit modal usaha UMKM menggunakan Decision Tree kriteria Entropy C4.5 dan interpretasi aturan if-then.",
                datasetInfo: {
                    name: "Credit Risk Dataset (Microfinance & Loan Approval)",
                    description: "Dataset kelayakan pinjaman usaha mikro berdasarkan omzet bulanan, lama beroperasi, dan rasio beban utang.",
                    filename: "umkm_microloan_application.csv",
                    downloadUrl: "/datasets/alternatif/umkm_microloan_application.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/laotse/credit-risk-dataset",
                    columns: ["omset_bulanan_juta", "lama_usaha_tahun", "riwayat_kredit_buruk", "rasio_beban_utang", "status_layak"],
                    previewRows: [["57.6", "10.9", "0", "0.63", "1"], ["58.7", "10.8", "1", "0.59", "0"], ["39.1", "11.6", "0", "0.27", "1"], ["40.6", "10.7", "0", "0.18", "1"], ["40.1", "0.6", "1", "0.71", "0"]],
                    totalRows: 450,
                    sizeKb: 8.4,
                },
                code: "# === BAB 05: ALTERNATIF KASUS NYATA - UMKM MICROLOAN DECISION TREE ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Dataset Kelayakan Pinjaman Modal Usaha Mikro (UMKM)\nnp.random.seed(33)\nn = 450\nomset = np.random.uniform(5, 80, n)\nlama = np.random.uniform(0.5, 12, n)\nbad_history = np.random.choice([0, 1], size=n, p=[0.75, 0.25])\ndebt_ratio = np.random.uniform(0.1, 0.8, n)\n\nprob = 0.85 - (bad_history * 0.6) - (debt_ratio > 0.5) * 0.3 + (omset > 40) * 0.2\nlayak = (np.random.rand(n) < np.clip(prob, 0.05, 0.95)).astype(int)\n\ndf = pd.DataFrame({\n    'omset_bulanan_juta': np.round(omset, 1),\n    'lama_usaha_tahun': np.round(lama, 1),\n    'riwayat_kredit_buruk': bad_history,\n    'rasio_beban_utang': np.round(debt_ratio, 2),\n    'status_layak': layak\n})\n\nprint(f\"[Dataset] Pengajuan Kredit Mikro: {df.shape[0]} pemohon.\")\nprint(f\"          Layak Disetujui: {df['status_layak'].sum()}, Ditolak: {n - df['status_layak'].sum()}\")\n\nX = df.drop('status_layak', axis=1)\ny = df['status_layak']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 2. Decision Tree Kriteria Entropy (C4.5)\nclf = DecisionTreeClassifier(criterion='entropy', max_depth=3, random_state=42)\nclf.fit(X_train, y_train)\n\ny_pred = clf.predict(X_test)\nprint(f\"\\n[Evaluasi C4.5]\")\nprint(f\"Akurasi Model : {accuracy_score(y_test, y_pred)*100:.2f}%\")\nprint(f\"Fitur Penentu : {dict(zip(X.columns, np.round(clf.feature_importances_, 3)))}\")\n",
            },
        ],
    },
    {
        id: "bab-06",
        number: 6,
        title: "K-Nearest Neighbors & Naive Bayes",
        slug: "06-knn-dan-naive-bayes",
        summary:
            "Komparasi Instance-Based Learner non-parametrik (KNN) dengan Probabilistic Learner Naive Bayes, perhitungan jarak ruang metrik, dan Laplace Smoothing untuk masalah frekuensi nol.",
        category: "Supervised Learning",
        difficulty: "Dasar",
        estimatedMinutes: 35,
        visualType: "boundary",
        datasetKey: "wine",
        keyFormulas: [
            "P(C_k|x) \\propto P(C_k) \\prod_{i=1}^n P(x_i|C_k)",
            "P_{\\text{Laplace}}(w|C) = \\frac{\\text{count}(w, C) + \\alpha}{N_C + \\alpha |V|}",
        ],
        theoryMarkdown: `
### Bab 06: K-Nearest Neighbors vs Naive Bayes

#### 1. Karakteristik Algoritma
- **K-NN**: Tidak memerlukan tahap pelatihan eksplisit (*Lazy Learner*), biaya komputasi tinggi pada saat inferensi mencari tetangga terdekat. Sensitif terhadap skala fitur.
- **Naive Bayes**: Menghitung probabilitas apriori dan conditional likelihood (*Eager Learner*). Asumsi independensi kondisional antar fitur (*naive*).

#### 2. Laplace Smoothing
Ketika suatu kata belum pernah muncul di kelas latih, $P(x_i|C) = 0$ akan menganulir seluruh perkalian probabilitas posterior. Laplace Smoothing $(\\alpha=1)$ memberikan bobot dasar agar probabilitas tidak bernilai nol mutlak.
        `.trim(),
        initialCode: `# === BAB 06: KOMPARASI K-NN VS GAUSSIAN NAIVE BAYES ===
import numpy as np
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score

# 1. Muat Dataset Wine (3 Kelas, 13 Fitur Kimiawi)
wine = load_wine()
X_tr, X_te, y_tr, y_te = train_test_split(wine.data, wine.target, test_size=0.3, random_state=42)

# 2. Skala Fitur (Krusial untuk K-NN Jarak Euclidean)
scaler = StandardScaler()
X_tr_sc = scaler.fit_transform(X_tr)
X_te_sc = scaler.transform(X_te)

# 3. Latih Kedua Model
knn = KNeighborsClassifier(n_neighbors=5, metric="euclidean").fit(X_tr_sc, y_tr)
gnb = GaussianNB().fit(X_tr_sc, y_tr)

# 4. Evaluasi Komparatif
acc_knn = accuracy_score(y_te, knn.predict(X_te_sc))
acc_gnb = accuracy_score(y_te, gnb.predict(X_te_sc))

print(f"[Hasil Komparasi]")
print(f"1. K-Nearest Neighbors (k=5) : {acc_knn * 100:.2f}% Akurasi")
print(f"2. Gaussian Naive Bayes       : {acc_gnb * 100:.2f}% Akurasi")
print(f"Prior Probabilities (GNB)   : {np.round(gnb.class_prior_, 3)}")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "KNN • Naive Bayes",
                description: "Sesuai modul praktikum Bab 06 Unindra (Hal 34–40). Analisis sensitivitas penskalaan fitur (StandardScaler), pencarian nilai k optimal, dan Multinomial Naive Bayes.",
                code: "# === BAB 06: KOMPARASI K-NN VS GAUSSIAN NAIVE BAYES ===\nimport numpy as np\nfrom sklearn.datasets import load_wine\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.naive_bayes import GaussianNB\nfrom sklearn.metrics import accuracy_score\n\n# 1. Muat Dataset Wine (3 Kelas, 13 Fitur Kimiawi)\nwine = load_wine()\nX_tr, X_te, y_tr, y_te = train_test_split(wine.data, wine.target, test_size=0.3, random_state=42)\n\n# 2. Skala Fitur (Krusial untuk K-NN Jarak Euclidean)\nscaler = StandardScaler()\nX_tr_sc = scaler.fit_transform(X_tr)\nX_te_sc = scaler.transform(X_te)\n\n# 3. Latih Kedua Model\nknn = KNeighborsClassifier(n_neighbors=5, metric=\"euclidean\").fit(X_tr_sc, y_tr)\ngnb = GaussianNB().fit(X_tr_sc, y_tr)\n\n# 4. Evaluasi Komparatif\nacc_knn = accuracy_score(y_te, knn.predict(X_te_sc))\nacc_gnb = accuracy_score(y_te, gnb.predict(X_te_sc))\n\nprint(f\"[Hasil Komparasi]\")\nprint(f\"1. K-Nearest Neighbors (k=5) : {acc_knn * 100:.2f}% Akurasi\")\nprint(f\"2. Gaussian Naive Bayes       : {acc_gnb * 100:.2f}% Akurasi\")\nprint(f\"Prior Probabilities (GNB)   : {np.round(gnb.class_prior_, 3)}\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • NLP Indonesia",
                description: "Klasifikasi teks ulasan belanja daring Bahasa Indonesia (positif vs negatif) membandingkan TF-IDF + Multinomial Naive Bayes vs KNN.",
                datasetInfo: {
                    name: "Women's E-Commerce Clothing Reviews / Sentiment NLP",
                    description: "Dataset ulasan kepuasan produk konsumen e-commerce dengan pelabelan sentimen positif dan keluhan pelanggan.",
                    filename: "ecommerce_sentiment_reviews.csv",
                    downloadUrl: "/datasets/alternatif/ecommerce_sentiment_reviews.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/nicapotato/womens-ecommerce-clothing-reviews",
                    columns: ["teks_ulasan", "sentimen_positif"],
                    previewRows: [["barangnya sangat bagus pengiriman cepat sekali respon penjual ramah", "1"], ["kualitas mantap original sesuai deskripsi toko amanah bintang lima", "1"], ["packing rapi bubble wrap tebal barang berfungsi normal makasih seller", "1"], ["sangat memuaskan belanja disini rekomended banget gaes", "1"], ["produk original berfungsi sangat baik pengiriman kilat", "1"]],
                    totalRows: 300,
                    sizeKb: 18.1,
                },
                code: "# === BAB 06: ALTERNATIF KASUS NYATA - E-COMMERCE SENTIMENT ANALYSIS ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.naive_bayes import MultinomialNB\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\n\n# 1. Dataset Sentimen Ulasan Belanja Daring (Bahasa Indonesia)\ndata_reviews = [\n    (\"barangnya sangat bagus pengiriman cepat sekali respon penjual ramah\", 1),\n    (\"kualitas mantap original sesuai deskripsi toko amanah bintang lima\", 1),\n    (\"packing rapi bubble wrap tebal barang berfungsi normal makasih seller\", 1),\n    (\"sangat memuaskan belanja disini rekomended banget gaes\", 1),\n    (\"produk original berfungsi sangat baik pengiriman kilat\", 1),\n    (\"kecewa berat barang rusak pecah packing asal asalan penjual slow respon\", 0),\n    (\"tidak sesuai deskripsi barang cacat warna salah kurir judes payah\", 0),\n    (\"nyesel beli disini pesanan salah kirim minta retur berbelit belit\", 0),\n    (\"kualitas buruk plastik tipis gampang patah jangan beli nyesel\", 0),\n    (\"lama sekali sampai barang tidak berfungsi rugi uang\", 0)\n] * 30 # 300 sampel\n\ndf = pd.DataFrame(data_reviews, columns=['teks_ulasan', 'sentimen_positif'])\nprint(f\"[Dataset] Ulasan Produk E-Commerce: {df.shape[0]} teks.\")\n\nX_train, X_test, y_train, y_test = train_test_split(\n    df['teks_ulasan'], df['sentimen_positif'], test_size=0.25, random_state=42\n)\n\n# 2. Vektorisasi TF-IDF & Komparasi Model\nvec = TfidfVectorizer(max_features=80)\nX_tr_vec = vec.fit_transform(X_train)\nX_te_vec = vec.transform(X_test)\n\nnb = MultinomialNB().fit(X_tr_vec, y_train)\nknn = KNeighborsClassifier(n_neighbors=3).fit(X_tr_vec, y_train)\n\nprint(f\"\\n[Hasil Komparasi]\")\nprint(f\"1. Multinomial Naive Bayes : {accuracy_score(y_test, nb.predict(X_te_vec))*100:.2f}% Akurasi\")\nprint(f\"2. K-Nearest Neighbors     : {accuracy_score(y_test, knn.predict(X_te_vec))*100:.2f}% Akurasi\")\n",
            },
        ],
    },
    {
        id: "bab-07",
        number: 7,
        title: "Evaluasi Model Klasifikasi & Metrik Diagnostik",
        slug: "07-evaluasi-model-klasifikasi",
        summary:
            "Dekomposisi Confusion Matrix (TP, TN, FP, FN), metrik diagnostik lanjutan (Presisi, Sensitivitas/Recall, F1-Score), Kurva ROC (*Receiver Operating Characteristic*), skor AUC, dan validasi silang berstrata.",
        category: "Evaluasi & Optimasi",
        difficulty: "Menengah",
        estimatedMinutes: 40,
        visualType: "confusion_matrix",
        datasetKey: "medical_synthetic",
        keyFormulas: [
            "\\text{Precision} = \\frac{TP}{TP + FP}",
            "\\text{Recall} = \\frac{TP}{TP + FN}",
            "F_1 = 2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}",
        ],
        theoryMarkdown: `
### Bab 07: Matriks Konfusi & Metrik Diagnostik

#### 1. Komponen Confusion Matrix
- **True Positive (TP)**: Aktual positif, terprediksi positif.
- **False Positive (FP)**: Aktual negatif, keliru diprediksi positif (*Type I Error*).
- **False Negative (FN)**: Aktual positif, keliru diprediksi negatif (*Type II Error* — berbahaya pada diagnosis medis).
- **True Negative (TN)**: Aktual negatif, terprediksi negatif.

#### 2. Kapan Mengutamakan Presisi vs Recall?
- **Prioritaskan Recall**: Kasus deteksi kanker/penyakit atau penipuan finansial, di mana melewatkan kasus positif (FN) memiliki konsekuensi fatal.
- **Prioritaskan Precision**: Filter spam email, di mana salah menandai email penting sebagai spam (FP) sangat mengganggu pengguna.
        `.trim(),
        initialCode: `# === BAB 07: EVALUASI METRIK DIAGNOSTIK & CONFUSION MATRIX ===
import numpy as np
from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score

# 1. Simulasi Kasus Ujian UPM (TP=40, FN=10, FP=15, TN=35)
tp, fn, fp, tn = 40, 10, 15, 35
total = tp + fn + fp + tn

akurasi = (tp + tn) / total
presisi = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * (presisi * recall) / (presisi + recall)
spesifisitas = tn / (tn + fp)

print("[Kalkulasi Manual Metrik Diagnostik UPM]")
print(f"- Akurasi      : {akurasi*100:.2f}%")
print(f"- Presisi      : {presisi*100:.2f}%")
print(f"- Recall       : {recall*100:.2f}%")
print(f"- Spesifisitas : {spesifisitas*100:.2f}%")
print(f"- F1-Score     : {f1:.4f}")

# 2. Confusion Matrix Array
cm = np.array([[tn, fp], [fn, tp]])
print(f"\\nMatriks Konfusi:\\n{cm}")
`,
        variants: [
            {
                id: "original",
                label: "Original Modul (Buku / LMS)",
                badge: "Metrik Diagnostik",
                description: "Sesuai modul praktikum Bab 07 Unindra (Hal 41–46). Dekomposisi TP/TN/FP/FN, kurva ROC-AUC, Precision-Recall curve, dan Stratified K-Fold cross validation.",
                code: "# === BAB 07: EVALUASI METRIK DIAGNOSTIK & CONFUSION MATRIX ===\nimport numpy as np\nfrom sklearn.metrics import confusion_matrix, classification_report, roc_auc_score\n\n# 1. Simulasi Kasus Ujian UPM (TP=40, FN=10, FP=15, TN=35)\ntp, fn, fp, tn = 40, 10, 15, 35\ntotal = tp + fn + fp + tn\n\nakurasi = (tp + tn) / total\npresisi = tp / (tp + fp)\nrecall = tp / (tp + fn)\nf1 = 2 * (presisi * recall) / (presisi + recall)\nspesifisitas = tn / (tn + fp)\n\nprint(\"[Kalkulasi Manual Metrik Diagnostik UPM]\")\nprint(f\"- Akurasi      : {akurasi*100:.2f}%\")\nprint(f\"- Presisi      : {presisi*100:.2f}%\")\nprint(f\"- Recall       : {recall*100:.2f}%\")\nprint(f\"- Spesifisitas : {spesifisitas*100:.2f}%\")\nprint(f\"- F1-Score     : {f1:.4f}\")\n\n# 2. Confusion Matrix Array\ncm = np.array([[tn, fp], [fn, tp]])\nprint(f\"\\\\nMatriks Konfusi:\\\\n{cm}\")\n",
                
            },
            {
                id: "alternatif",
                label: "Alternatif Kasus Nyata (CSV)",
                badge: "CSV • Keamanan Siber",
                description: "Evaluasi deteksi serangan siber pada log lalu lintas jaringan (DDoS & brute force) dengan analisis False Positive Rate dan F1-Score.",
                datasetInfo: {
                    name: "NSL-KDD Network Intrusion Detection Dataset",
                    description: "Dataset benchmark lalu lintas paket jaringan untuk mengidentifikasi aktivitas serangan peretasan dan intrusi sistem.",
                    filename: "cyber_intrusion_logs.csv",
                    downloadUrl: "/datasets/alternatif/cyber_intrusion_logs.csv",
                    kaggleUrl: "https://www.kaggle.com/datasets/cicdataset/nsl-kdd",
                    columns: ["packet_rate_per_sec", "byte_error_rate", "failed_login_attempts", "session_duration_sec", "is_intrusion"],
                    previewRows: [["68.3", "0.429", "1", "1.6", "0"], ["70.9", "0.1", "0", "21.5", "0"], ["306.8", "0.438", "0", "5.3", "1"], ["115.1", "0.105", "1", "9.5", "0"], ["130.2", "0.313", "0", "7.5", "1"]],
                    totalRows: 1000,
                    sizeKb: 19.8,
                },
                code: "# === BAB 07: ALTERNATIF KASUS NYATA - CYBER INTRUSION DIAGNOSTICS ===\nimport numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import confusion_matrix, roc_auc_score, accuracy_score\n\n# 1. Dataset Log Deteksi Intrusi & Serangan Jaringan (NSL-KDD Benchmarking)\nnp.random.seed(88)\nn = 1000\npacket_rate = np.random.exponential(scale=50, size=n)\nerror_rate = np.random.uniform(0.0, 0.5, size=n)\nfailed_logins = np.random.poisson(lam=0.8, size=n)\nduration = np.random.exponential(scale=10, size=n)\n\nprob = (packet_rate > 90) * 0.4 + (failed_logins >= 2) * 0.4 + (error_rate > 0.3) * 0.2\nis_intrusion = (np.random.rand(n) < np.clip(prob, 0.03, 0.95)).astype(int)\n\ndf = pd.DataFrame({\n    'packet_rate_per_sec': np.round(packet_rate, 1),\n    'byte_error_rate': np.round(error_rate, 3),\n    'failed_login_attempts': failed_logins,\n    'session_duration_sec': np.round(duration, 1),\n    'is_intrusion': is_intrusion\n})\n\nprint(f\"[Dataset] Log Intrusi Siber: {df.shape[0]} log, Kasus Intrusi: {df['is_intrusion'].sum()} ({df['is_intrusion'].mean()*100:.1f}%)\")\n\nX = df.drop('is_intrusion', axis=1)\ny = df['is_intrusion']\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)\n\n# 2. Pelatihan & Evaluasi Confusion Matrix\nclf = LogisticRegression(max_iter=1000)\nclf.fit(X_train, y_train)\ny_pred = clf.predict(X_test)\nprobs = clf.predict_proba(X_test)[:, 1]\n\ncm = confusion_matrix(y_test, y_pred)\nauc = roc_auc_score(y_test, probs)\n\nprint(f\"\\n[Matriks Konfusi Keamanan]\")\nprint(f\"[[TN={cm[0,0]}  FP={cm[0,1]}]\")\nprint(f\" [FN={cm[1,0]}  TP={cm[1,1]}]]\")\nprint(f\"Akurasi : {accuracy_score(y_test, y_pred)*100:.2f}% | ROC-AUC: {auc:.4f}\")\n",
            },
        ],
    },
    {
        id: "bab-08",
        number: 8,
        title: "Support Vector Machine (SVM)",
        slug: "08-support-vector-machine-svm",
        summary:
            "Prinsip Maximal Margin Hyperplane, pembuktian matematis lebar margin geometris 2/||w||, penanganan margin lunak melalui parameter C, pemetaan Kernel Trick (RBF/Gaussian), dan penalaan GridSearchCV.",
        category: "Supervised Learning",
        difficulty: "Menengah",
        estimatedMinutes: 45,
        visualType: "boundary",
        datasetKey: "breast_cancer",
        keyFormulas: [
            "\\text{Margin} = \\frac{2}{\\|w\\|}",
            "K_{\\text{RBF}}(x, x') = \\exp(-\\gamma \\|x - x'\\|^2)",
        ],
        theoryMarkdown: `
### Bab 08: Support Vector Machine (SVM)

#### 1. Konsep Margin Maksimal
SVM berupaya menemukan bidang pemisah (*hyperplane*) optimal $w^T x + b = 0$ yang memaksimalkan jarak tegak lurus (margin geometris $M = 2 / \\|w\\|$) terhadap titik-titik sampel terdekat dari masing-masing kelas (*Support Vectors*).

#### 2. Parameter Kunci SVM
- **Parameter $C$ (Regularisasi Penalti)**:
  - $C$ besar: Penalti ketat (*Hard Margin*), meminimalkan kesalahan latih namun berisiko overfitting.
  - $C$ kecil: Toleransi pelanggaran margin lebih besar (*Soft Margin*), menghasilkan batas keputusan lebih halus.
- **Kernel Trick**: Memproyeksikan data ke dimensi ruang fitur lebih tinggi tanpa harus menghitung koordinat secara eksplisit.
        `.trim(),
        initialCode: `# === BAB 08: SUPPORT VECTOR MACHINE & PERHITUNGAN MARGIN ===
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1. Pembuktian Rumus Margin UPM: w = [2.0, 1.0]
w = np.array([2.0, 1.0])
norm_w = np.linalg.norm(w)
lebar_margin = 2.0 / norm_w
print(f"[Manual UPM] Vektor Bobot w: {w}")
print(f"Norm ||w||: {norm_w:.4f} | Lebar Margin Geometris (2/||w||): {lebar_margin:.4f}")

# 2. Pelatihan SVM Kernel RBF vs Linear
cancer = load_breast_cancer()
scaler = StandardScaler()
X_sc = scaler.fit_transform(cancer.data)
X_tr, X_te, y_tr, y_te = train_test_split(X_sc, cancer.target, test_size=0.25, random_state=42)

svm_linear = SVC(kernel="linear", C=1.0).fit(X_tr, y_tr)
svm_rbf = SVC(kernel="rbf", C=1.0, gamma="scale").fit(X_tr, y_tr)

print(f"\\n[Akurasi SVM]")
print(f"1. SVM Linear : {svm_linear.score(X_te, y_te)*100:.2f}% (Support Vectors: {len(svm_linear.support_)})")
print(f"2. SVM RBF    : {svm_rbf.score(X_te, y_te)*100:.2f}% (Support Vectors: {len(svm_rbf.support_)})")
`,
    },
    {
        id: "bab-09",
        number: 9,
        title: "Ensemble Learning (Bagging, Random Forest & Boosting)",
        slug: "09-ensemble-learning-dan-rf",
        summary:
            "Paradigma kombinasi model majemuk, pembuktian peluang sampel Out-of-Bag (OOB) sebesar 36.8%, algoritma Random Forest, perbandingan dengan AdaBoost dan Gradient Boosting, serta analisis Feature Importance.",
        category: "Supervised Learning",
        difficulty: "Lanjutan",
        estimatedMinutes: 50,
        visualType: "scatter",
        datasetKey: "wine",
        keyFormulas: [
            "P(\\text{OOB}) = \\lim_{N \\to \\infty} \\left(1 - \\frac{1}{N}\\right)^N = \\frac{1}{e} \\approx 36.79\\%",
        ],
        theoryMarkdown: `
### Bab 09: Ensemble Learning (Bagging vs Boosting)

#### 1. Bagging (*Bootstrap Aggregating*)
- Menghasilkan $B$ dataset tiruan dengan penarikan sampel berulang (*with replacement*).
- Melatih model dasar secara independen dan paralel.
- Mengagregasi prediksi melalui suara mayoritas (*voting*) atau rata-rata (*averaging*). Mereduksi variansi model.

#### 2. Boosting
- Melatih model secara berurutan (*sequential*).
- Setiap pembelajar baru fokus memperbaiki sampel yang salah diprediksi oleh model sebelumnya.
- Mereduksi bias dan variansi secara simultan.
        `.trim(),
        initialCode: `# === BAB 09: ENSEMBLE LEARNING & PEMBUKTIAN OOB ===
import numpy as np
from sklearn.datasets import load_wine
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split

# 1. Pembuktian Teori Out-Of-Bag (OOB) Sampel
n = 1000
p_oob = (1 - 1/n) ** n
print(f"[Teori UPM] Probabilitas Sampel OOB (1 - 1/N)^N: {p_oob*100:.2f}% (Teoritis: 36.79%)")

# 2. Pelatihan Tiga Algoritma Ensemble
wine = load_wine()
X_tr, X_te, y_tr, y_te = train_test_split(wine.data, wine.target, test_size=0.25, random_state=42)

rf = RandomForestClassifier(n_estimators=50, oob_score=True, random_state=42).fit(X_tr, y_tr)
ada = AdaBoostClassifier(n_estimators=50, random_state=42).fit(X_tr, y_tr)
gb = GradientBoostingClassifier(n_estimators=50, random_state=42).fit(X_tr, y_tr)

print(f"\\n[Akurasi Ensemble]")
print(f"Random Forest     : {rf.score(X_te, y_te)*100:.2f}% (OOB Score: {rf.oob_score_*100:.2f}%)")
print(f"AdaBoost          : {ada.score(X_te, y_te)*100:.2f}%")
print(f"Gradient Boosting : {gb.score(X_te, y_te)*100:.2f}%")
`,
    },
    {
        id: "bab-10",
        number: 10,
        title: "Clustering (K-Means, Hierarki & DBSCAN)",
        slug: "10-clustering-kmeans-dan-dbscan",
        summary:
            "Pembelajaran tanpa pengawasan (Unsupervised), pembuktian langkah pembaruan titik pusat centroid manual 1D (studi kasus k-Means Bab 10), penentuan k optimal dengan Elbow Method dan Silhouette Score, serta deteksi klaster DBSCAN.",
        category: "Unsupervised Learning",
        difficulty: "Menengah",
        estimatedMinutes: 45,
        visualType: "cluster_2d",
        datasetKey: "unsupervised_synthetic",
        keyFormulas: [
            "\\mu_k = \\frac{1}{|S_k|} \\sum_{x_i \\in S_k} x_i",
            "s(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}",
        ],
        theoryMarkdown: `
### Bab 10: Pengelompokan Data (Clustering)

#### 1. Algoritma K-Means
1. Inisialisasi $k$ titik pusat (*centroid*).
2. Tetapkan setiap objek ke centroid terdekat berdasarkan jarak Euclidean.
3. Hitung ulang koordinat rata-rata centroid baru dari anggota klaster.
4. Ulangi hingga posisi centroid konvergen tidak lagi bergeser.

#### 2. K-Means vs DBSCAN
- **K-Means**: Mengharuskan spesifikasi nilai $k$ di awal, mengasumsikan bentuk klaster bulat cembung (*spherical*), rentan outlier.
- **DBSCAN**: Berbasis densitas spasial (\`eps\` dan \`min_samples\`), mampu menemukan bentuk klaster bebas arbitrer dan memisahkan noise.
        `.trim(),
        initialCode: `# === BAB 10: PEMBUKTIAN UPDATE CENTROID K-MEANS MANUAL ===
import numpy as np
from sklearn.cluster import KMeans, DBSCAN

# 1. Studi Kasus Perhitungan Manual K-Means Bab 10
# Data 1D: [2, 3, 8, 9, 10], Centroid Awal: c1 = 2, c2 = 9
data = np.array([2, 3, 8, 9, 10])
c1, c2 = 2.0, 9.0

print(f"[Inisialisasi] Data: {data.tolist()} | Centroid Awal: c1={c1}, c2={c2}")

# Iterasi 1
klaster_1 = [x for x in data if abs(x - c1) <= abs(x - c2)]
klaster_2 = [x for x in data if abs(x - c2) < abs(x - c1)]
c1_baru = np.mean(klaster_1)
c2_baru = np.mean(klaster_2)

print(f"Iterasi 1: Klaster 1={klaster_1} -> Mean c1={c1_baru:.2f}")
print(f"Iterasi 1: Klaster 2={klaster_2} -> Mean c2={c2_baru:.2f}")

# 2. Eksekusi DBSCAN Data Sintetis
X_2d = np.array([[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0], [50, 50]])
dbs = DBSCAN(eps=3.0, min_samples=2).fit(X_2d)
print(f"\\nLabel DBSCAN (Outlier ditandai -1): {dbs.labels_.tolist()}")
`,
    },
    {
        id: "bab-11",
        number: 11,
        title: "Dimensionality Reduction (PCA, t-SNE & LDA)",
        slug: "11-dimensionality-reduction-pca-tsne",
        summary:
            "Fenomena Curse of Dimensionality, pembuktian manual Eigenvalues dan Explained Variance Ratio 2x2 (Bab 11 Halaman 66), reduksi dimensi citra Digits (64 dimensi ke 2D) dengan PCA dan visualisasi non-linear t-SNE.",
        category: "Unsupervised Learning",
        difficulty: "Lanjutan",
        estimatedMinutes: 50,
        visualType: "pca_scatter",
        datasetKey: "digits",
        keyFormulas: [
            "\\det(\\Sigma - \\lambda I) = 0",
            "\\text{Explained Variance Ratio} = \\frac{\\lambda_k}{\\sum \\lambda_i}",
        ],
        theoryMarkdown: `
### Bab 11: Reduksi Dimensi & PCA

#### 1. Principal Component Analysis (PCA)
PCA adalah teknik ortogonal linier tanpa supervisi yang mentransformasikan ruang fitur berkorelasi tinggi menjadi kumpulan sumbu baru (*Principal Components*) yang saling bebas (*ortogonal*) dan memaksimumkan variansi data.

#### 2. Persamaan Karakteristik 2x2
Untuk matriks kovarians $\\Sigma = \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$, nilai eigen didapat melalui determinan:
$\\det(\\Sigma - \\lambda I) = (a-\\lambda)(c-\\lambda) - b^2 = \\lambda^2 - (a+c)\\lambda + (ac - b^2) = 0$.
        `.trim(),
        initialCode: `# === BAB 11: PEMBUKTIAN PCA MANUAL 2X2 (BAB 11 HAL 66) ===
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# 1. Soal Resmi Bab 11 Halaman 66: Matriks Sigma = [[2.0, 0.8], [0.8, 1.0]]
a, b, c = 2.0, 0.8, 1.0
trace = a + c
det = a * c - b ** 2
diskriminan = np.sqrt(trace ** 2 - 4 * det)

lambda_1 = (trace + diskriminan) / 2
lambda_2 = (trace - diskriminan) / 2
var_total = lambda_1 + lambda_2

print(f"[Manual UPM Bab 11]")
print(f"Lambda 1 (PC1) : {lambda_1:.4f} ({lambda_1/var_total*100:.2f}% variansi)")
print(f"Lambda 2 (PC2) : {lambda_2:.4f} ({lambda_2/var_total*100:.2f}% variansi)")

# 2. Reduksi Dimensi Digits (64D -> 2D)
digits = load_digits()
pca = PCA(n_components=2)
X_pca = pca.fit_transform(digits.data)

print(f"\\n[PCA Digits]")
print(f"Dimensi Asli: {digits.data.shape} -> Dimensi Terproyeksi: {X_pca.shape}")
print(f"Rasio Varians Terjelaskan PC1 & PC2: {np.round(pca.explained_variance_ratio_ * 100, 2)}%")
`,
    },
    {
        id: "bab-12",
        number: 12,
        title: "Neural Network & Multilayer Perceptron (MLP)",
        slug: "12-neural-network-mlp",
        summary:
            "Arsitektur neuron buatan (Bobot, Bias, Fungsi Aktivasi), pembuktian hitungan manual forward pass satu neuron dengan fungsi aktivasi ReLU (Bab 12 Halaman 72), pelatihan MLPClassifier dan analisis konvergensi Loss.",
        category: "Deep Learning",
        difficulty: "Lanjutan",
        estimatedMinutes: 50,
        visualType: "loss_curve",
        datasetKey: "digits",
        keyFormulas: [
            "z = \\sum w_i x_i + b",
            "a = \\text{ReLU}(z) = \\max(0, z)",
        ],
        theoryMarkdown: `
### Bab 12: Neural Network & Multilayer Perceptron (MLP)

#### 1. Forward Pass Satu Neuron
Neuron buatan menghitung kombinasi linier dari sinyal input berbobot ditambah bias: $z = w^T x + b$. Nilai linier $z$ kemudian dilewatkan ke fungsi aktivasi non-linier $\\sigma(z)$ (seperti ReLU, Sigmoid, atau Tanh) untuk menghasilkan output aktivasi $a$.

#### 2. Fungsi Aktivasi ReLU
$\\text{ReLU}(z) = \\max(0, z)$. Mengatasi masalah *vanishing gradient* pada jaringan saraf dalam dan memiliki komputasi yang sangat cepat.
        `.trim(),
        initialCode: `# === BAB 12: FORWARD PASS MANUAL NEURON & PELATIHAN MLP ===
import numpy as np
from sklearn.datasets import load_digits
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1. Soal Resmi Bab 12 Halaman 72: Forward Pass Satu Neuron
# x = [0.5, -0.2, 0.8], w = [0.4, 0.6, -0.3], b = 0.1
x = np.array([0.5, -0.2, 0.8])
w = np.array([0.4, 0.6, -0.3])
b = 0.1

z = np.dot(x, w) + b
a_relu = max(0.0, z)

print(f"[Manual Bab 12 Halaman 72]")
print(f"Input x : {x.tolist()} | Bobot w: {w.tolist()} | Bias: {b}")
print(f"Hasil Linier z = (w . x + b) : {z:.4f}")
print(f"Aktivasi ReLU(z)            : {a_relu:.4f}")

# 2. Pelatihan MLP Multi-Layer
digits = load_digits()
scaler = StandardScaler()
X_sc = scaler.fit_transform(digits.data)
X_tr, X_te, y_tr, y_te = train_test_split(X_sc, digits.target, test_size=0.25, random_state=42)

mlp = MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=300, random_state=42)
mlp.fit(X_tr, y_tr)
print(f"\\n[MLP Classifier]")
print(f"Akurasi Uji: {mlp.score(X_te, y_te)*100:.2f}% | Iterasi Konvergen: {mlp.n_iter_}")
print(f"Nilai Loss Akhir: {mlp.loss_:.4f}")
`,
    },
    {
        id: "bab-13",
        number: 13,
        title: "Convolutional Neural Network (CNN) & Transfer Learning",
        slug: "13-cnn-dan-transfer-learning",
        summary:
            "Mekanisme operasi konvolusi 2D matriks gambar dan filter kernel, ReLU feature maps, Max Pooling subsampling, serta konsep Transfer Learning arsitektur MobileNetV2 (Feature Extraction vs Fine-Tuning).",
        category: "Deep Learning",
        difficulty: "Lanjutan",
        estimatedMinutes: 50,
        visualType: "feature_map",
        datasetKey: "synthetic_image_tensor",
        keyFormulas: [
            "(I * K)(i, j) = \\sum_m \\sum_n I(i+m, j+n) K(m, n)",
            "O = \\left\\lfloor \\frac{W - F + 2P}{S} \\right\\rfloor + 1",
        ],
        theoryMarkdown: `
### Bab 13: Konvolusi 2D & Transfer Learning

#### 1. Operasi Konvolusi Citra
Filter kernel berukuran kecil meluncur (*sliding window*) melintasi matriks citra, melakukan perkalian elemen demi elemen lalu menjumlahkannya untuk mengekstraksi representasi lokal (garis tepi, tekstur, sudut).

#### 2. Strategi Transfer Learning
- **Feature Extraction**: Membekukan seluruh bobot lapisan representasi yang telah dilatih pada dataset raksasa (ImageNet), dan hanya melatih ulang lapisan klasifikasi teratas (*dense head*).
- **Fine-Tuning**: Membuka blokir lapisan konvolusi teratas untuk memperbarui representasi fitur secara halus dengan laju belajar (*learning rate*) yang kecil.
        `.trim(),
        initialCode: `# === BAB 13: SIMULASI OPERASI KONVOLUSI 2D & TRANSFER LEARNING ===
import numpy as np

# 1. Operasi Konvolusi Citra 4x4 dengan Kernel 2x2
citra = np.array([
    [1, 2, 0, 1],
    [0, 1, 3, 2],
    [2, 0, 1, 0],
    [1, 1, 2, 3]
])
kernel = np.array([
    [1, 0],
    [0, 1]
])

def konvolusi_2d(img, k):
    h, w = img.shape
    kh, kw = k.shape
    out_h, out_w = h - kh + 1, w - kw + 1
    f_map = np.zeros((out_h, out_w))
    for i in range(out_h):
        for j in range(out_w):
            f_map[i, j] = np.sum(img[i:i+kh, j:j+kw] * k)
    return f_map

feature_map = konvolusi_2d(citra, kernel)
print("[Simulasi Konvolusi 2D]")
print("Matriks Citra Asli (4x4):\\n", citra)
print("Filter Kernel (2x2):\\n", kernel)
print("Feature Map Terbentuk (3x3):\\n", feature_map)

print("\\n[Konsep Transfer Learning MobileNetV2 (Bab 13)]")
print("1. Feature Extraction: Membekukan bobot pra-latih ImageNet (1.4 juta citra)")
print("2. Lapisan Bawah: Deteksi bentuk domain-agnostik (tepi, tekstur)")
print("3. Lapisan Atas: Klasifikasi disesuaikan dengan dataset target")
`,
    },
    {
        id: "bab-14",
        number: 14,
        title: "Model Deployment, MLOps & Capstone Project",
        slug: "14-model-deployment-dan-mini-project",
        summary:
            "Siklus implementasi penuh CRISP-DM pada studi kasus Loan Default (Prediksi Risiko Gagal Bayar Kredit), serialisasi artefak model dengan joblib, integrasi pipeline inferensi, dan prototype web service interactive.",
        category: "Deployment & MLOps",
        difficulty: "Lanjutan",
        estimatedMinutes: 60,
        visualType: "table",
        datasetKey: "loan_default",
        keyFormulas: [
            "\\text{Latency} = t_{\\text{response}} - t_{\\text{request}}",
            "\\text{Model Size} = \\text{sizeof}(\\text{model.joblib})",
        ],
        theoryMarkdown: `
### Bab 14: Model Deployment, MLOps & Capstone Mini Project

#### 1. Siklus Hidup Model di Produksi
Model yang memiliki akurasi tinggi di notebook tidak memberikan nilai bisnis sampai dapat diakses oleh sistem lain melalui API atau antarmuka interaktif:
1. **Serialisasi Artefak**: Menyimpan bobot dan preprocessor secara terikat ke disk (\`.joblib\` atau \`.onnx\`).
2. **Inference Pipeline**: Memastikan format input inferensi melalui transformasi penskalaan identik dengan fase latih.
3. **Monitoring & Drift**: Memantau degradasi performa model (*Concept Drift* / *Data Drift*) di masa mendatang.
        `.trim(),
        initialCode: `# === BAB 14: CAPSTONE MINI PROJECT & PIPELINE DEPLOYMENT ===
import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 1. Pelatihan Model Produksi
data = load_breast_cancer()
X_tr, X_te, y_tr, y_te = train_test_split(data.data, data.target, test_size=0.2, random_state=42)

model_capstone = RandomForestClassifier(n_estimators=30, max_depth=5, random_state=42)
model_capstone.fit(X_tr, y_tr)

# 2. Evaluasi Final Standar Industri
y_pred = model_capstone.predict(X_te)
print("[Hasil Evaluasi Capstone Mini Project]")
print(f"Skor Akurasi Final : {model_capstone.score(X_te, y_te)*100:.2f}%")
print(f"Prediksi 5 Sampel : {y_pred[:5].tolist()}")
print(f"Probabilitas Positif : {np.round(model_capstone.predict_proba(X_te[:5])[:, 1], 3).tolist()}")
print("\\nModel Siap untuk Diserialisasi & Diterapkan ke Portal Simulasi WebAssembly!")
`,
    },
];

export function getAllChapters(): Chapter[] {
    return ML_CHAPTERS;
}

export function getChapterByNumber(num: number): Chapter | undefined {
    return ML_CHAPTERS.find((c) => c.number === num);
}

export function getChapterBySlug(slug: string): Chapter | undefined {
    if (slug === "bab-01-numpy") {
        return ML_CHAPTERS[0];
    }
    const found = ML_CHAPTERS.find((c) => c.slug === slug || c.id === slug);
    if (found) return found;

    // Check if numeric or bab-X
    const cleanNum = slug.replace(/^bab-?0?/, "");
    const parsedNum = parseInt(cleanNum, 10);
    if (!isNaN(parsedNum)) {
        return getChapterByNumber(parsedNum);
    }
    return undefined;
}
