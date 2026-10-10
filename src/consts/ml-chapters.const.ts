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

mlp = MLPClassifier(hidden_layer_sizes=(32, 16), max_iter=150, random_state=42)
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
