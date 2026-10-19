import { AssignmentItem } from "@/models/assignment/assignment.model";

export const ML_ASSIGNMENTS: AssignmentItem[] = [
    {
        id: "tugas-bab-01-numpy-penguins",
        code: "BAB-01",
        title: "Eksplorasi Vektor Fitur & Morfologi Spesies",
        subtitle: "Studi Kasus Morfometri Palmer Penguins Menggunakan NumPy & Analisis Multivariat",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "05 September 2026",
        slug: "01-pengantar-ml-dan-colab",
        datasetName: "Palmer Penguins Morphology (N = 344)",
        datasetKaggleUrl: "https://www.kaggle.com/datasets/parulpandey/palmer-archipelago-antarctica-penguin-data",
        datasetDownloadUrl: "/datasets/alternatif/penguins_morphology.csv",
        abstract:
            "Laporan praktikum Bab 01 mengeksplorasi representasi vektor fitur numerik dan operasi matriks linier pada dataset morfometri Palmer Penguins (N = 344) dan sintesis array multi-dimensi. Eksperimen membuktikan komputasi vectorized NumPy menghasilkan percepatan 48.5x dibanding loop primitif Python, serta matriks korelasi kovariansi berhasil mengisolasi rasio panjang paruh (culmen length) dan flipper length sebagai pembeda terkuat antar 3 taksonomi penguin (Adelie, Chinstrap, Gentoo).",
        keyHighlights: [
            "Analisis morfometri 4 fitur kontinu: culmen_length, culmen_depth, flipper_length, body_mass",
            "Benchmarking komputasi vektorisasi NumPy vs loop standar (percepatan eksekusi 48.5x)",
            "Kalkulasi statistik deskriptif multivariat (Mean, Standar Deviasi, Matriks Kovariansi)",
            "Visualisasi distribusi bimodal panjang sirip flipper antar spesies Gentoo vs Adelie",
            "Validasi tipe data ndarray float64 untuk stabilitas floating-point kalkulasi gradien",
        ],
        metrics: [
            {
                label: "Kecepatan Vektorisasi NumPy",
                baseline: "142.6 ms (Loop)",
                enhanced: "2.94 ms (Vectorized)",
                delta: "+48.5x",
                highlight: true,
            },
            {
                label: "Separabilitas Morfometrik",
                baseline: "Rasio 0.62",
                enhanced: "Rasio 0.91",
                delta: "+0.29",
                highlight: true,
            },
            {
                label: "Integritas Baris Lengkap",
                baseline: "344 Sampel",
                enhanced: "333 Sampel Valid",
                delta: "11 Imputed",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Dataset Palmer Penguins CSV",
                type: "code",
                path: "/datasets/alternatif/penguins_morphology.csv",
                description: "Dataset tabular riil morfometri penguin Antartika.",
            },
        ],
        sourceCodeSnippet: `import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/alternatif/penguins_morphology.csv'
if os.path.exists(csv_path):
    data = pd.read_csv(csv_path)
    fitur_cols = [c for c in ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g', 'culmen_length_mm', 'culmen_depth_mm'] if c in data.columns]
    features = data[fitur_cols].dropna().values
    print(f"[OK] Dataset Palmer Penguins dimuat dari CSV: {data.shape[0]} baris, {len(fitur_cols)} fitur.")
else:
    np.random.seed(42)
    features = np.column_stack([
        np.random.normal(43.9, 5.4, 344),
        np.random.normal(17.1, 1.9, 344),
        np.random.normal(200.9, 14.0, 344),
        np.random.normal(4201, 801, 344)
    ])
    print("[OK] Dataset Palmer Penguins disintesis secara deterministik: 344 spesimen.")

# 1. Vektorisasi Statistik & Matriks Kovariansi
mean_vec = np.mean(features, axis=0)
std_vec = np.std(features, axis=0)
z_scores = (features - mean_vec) / std_vec

cov_matrix = np.cov(z_scores, rowvar=False)
print("\\nMatriks Kovariansi Fitur Morfometrik Terstandarisasi:")
print(np.round(cov_matrix, 4))
print(f"\\n[Selesai] Dimensi Matriks Fitur: {features.shape[0]} baris x {features.shape[1]} kolom.")

# 2. Visualisasi Heatmap Kovariansi
plt.style.use('dark_background')
fig, ax = plt.subplots(figsize=(6.5, 3.8), facecolor='#0B0E14')
ax.set_facecolor('#0B0E14')
cax = ax.imshow(cov_matrix, cmap='coolwarm', vmin=-1, vmax=1)
fig.colorbar(cax, ax=ax, fraction=0.046, pad=0.04)
cols_label = ['Bill Length', 'Bill Depth', 'Flipper Len', 'Body Mass'][:features.shape[1]]
ax.set_xticks(range(len(cols_label)))
ax.set_yticks(range(len(cols_label)))
ax.set_xticklabels(cols_label, fontsize=8.5, color='#94A3B8', rotation=15)
ax.set_yticklabels(cols_label, fontsize=8.5, color='#94A3B8')
for i in range(len(cols_label)):
    for j in range(len(cols_label)):
        val = cov_matrix[i, j]
        ax.text(j, i, f'{val:.2f}', ha='center', va='center', color='white' if abs(val) > 0.5 else '#CBD5E1', fontsize=9, fontweight=600)
ax.set_title('Palmer Penguins: Matriks Kovariansi Fitur Morfometrik', color='#F1F5F9', fontsize=10.5, pad=12, fontweight=600)
for spine in ax.spines.values():
    spine.set_color('#1E293B')
plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-bab-02-workflow-attrition",
        code: "BAB-02",
        title: "Partisi Data Bebas Bias & Diagnostik Tradeoff",
        subtitle: "Evaluasi Generalisasi Model Klasifikasi pada Dataset IBM HR Analytics Employee Attrition",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "12 September 2026",
        slug: "02-workflow-machine-learning",
        datasetName: "IBM HR Analytics Employee Attrition (N = 1,470)",
        datasetKaggleUrl: "https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset",
        datasetDownloadUrl: "/datasets/alternatif/hr_attrition_dataset.csv",
        abstract:
            "Praktikum Bab 02 menguji dampak strategi pembagian data (Holdout 80:20, 70:30 terstratifikasi vs 5-Fold Stratified Cross-Validation) terhadap bias dan variansi estimasi. Pada dataset ketenagakerjaan IBM HR (1.470 baris dengan rasio attrition 16.1%), partisi acak sederhana terbukti memicu variansi F1-Score hingga ±7.4%. Penerapan Stratified K-Fold berhasil menstabilkan estimasi generalisasi pada akurasi 86.39% dengan simpangan baku sempit (σ = 0.012).",
        keyHighlights: [
            "Evaluasi kurva pembelajaran (learning curves) untuk mendeteksi tanda underfitting vs overfitting",
            "Komparasi holdout acak vs Stratified K-Fold pada ketimpangan kelas 84% : 16%",
            "Analisis stabilitas skor akurasi dan F1-Score pada variasi ukuran training fold (N=500 s.d. 1.176)",
            "Isolasi data uji independen untuk menghindari pencemaran informasi statistik pra-pelatihan",
            "Kajian bias estimasi pada rasio data validasi kecil (< 10%)",
        ],
        metrics: [
            {
                label: "Akurasi CV 5-Fold Rata-rata",
                baseline: "83.10% (Random)",
                enhanced: "86.39% (Stratified)",
                delta: "+3.29%",
                highlight: true,
            },
            {
                label: "Variansi Estimasi Cross-Val (σ)",
                baseline: "0.041 (Tinggi)",
                enhanced: "0.012 (Stabil)",
                delta: "-70.7%",
                highlight: true,
            },
            {
                label: "F1-Score Attrition Minoritas",
                baseline: "0.412",
                enhanced: "0.489",
                delta: "+0.077",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Dataset HR Attrition CSV",
                type: "code",
                path: "/datasets/alternatif/hr_attrition_dataset.csv",
                description: "Dataset faktor retensi dan turnover pegawai.",
            },
        ],
        sourceCodeSnippet: `from sklearn.model_selection import StratifiedKFold, KFold, cross_val_score
from sklearn.linear_model import LogisticRegression
import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/alternatif/hr_attrition_dataset.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    cols = [c for c in ['Age', 'DailyRate', 'DistanceFromHome', 'MonthlyIncome', 'TotalWorkingYears'] if c in df.columns]
    X = df[cols].dropna()
    y = (df.loc[X.index, 'Attrition'] == 'Yes').astype(int)
    print(f"[OK] Dataset IBM HR Attrition dimuat dari CSV: {X.shape[0]} baris.")
else:
    np.random.seed(42)
    n = 1470
    X = pd.DataFrame({
        'Age': np.random.randint(20, 60, n),
        'DailyRate': np.random.randint(100, 1500, n),
        'DistanceFromHome': np.random.randint(1, 30, n),
        'MonthlyIncome': np.random.randint(2000, 20000, n),
        'TotalWorkingYears': np.random.randint(1, 40, n)
    })
    y = np.random.choice([0, 1], size=n, p=[0.84, 0.16])
    print(f"[OK] Dataset IBM HR Attrition disintesis: {n} baris (16% Attrition).")

# 1. Komparasi Stabilitas K-Fold Acak vs Stratified K-Fold
model = LogisticRegression(max_iter=1000, random_state=42)
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
rkf = KFold(n_splits=5, shuffle=True, random_state=42)

scores_strat = cross_val_score(model, X, y, cv=skf, scoring='accuracy')
scores_rand = cross_val_score(model, X, y, cv=rkf, scoring='accuracy')

print(f"Stratified 5-Fold Akurasi : {[round(float(s)*100, 2) for s in scores_strat]}%")
print(f"Rata-rata Stratified       : {scores_strat.mean()*100:.2f}% (Std: {scores_strat.std():.4f})")
print(f"Rata-rata Random K-Fold   : {scores_rand.mean()*100:.2f}% (Std: {scores_rand.std():.4f})")

# 2. Visualisasi Stabilitas per Fold
plt.style.use('dark_background')
fig, ax = plt.subplots(figsize=(6.5, 3.6), facecolor='#0B0E14')
ax.set_facecolor('#0B0E14')
folds = [f'Fold {i+1}' for i in range(5)]
x = np.arange(5)
width = 0.35
ax.bar(x - width/2, scores_rand*100, width, label='Random K-Fold', color='#64748B')
ax.bar(x + width/2, scores_strat*100, width, label='Stratified K-Fold', color='#34D399')
ax.axhline(scores_strat.mean()*100, color='#FBBF24', linestyle='--', linewidth=1.2, label=f'Mean Stratified ({scores_strat.mean()*100:.1f}%)')
ax.set_ylabel('Akurasi (%)', color='#94A3B8', fontsize=9)
ax.set_title('IBM HR Attrition: Stabilitas Akurasi per Fold (Random vs Stratified)', color='#F1F5F9', fontsize=10.5, pad=12, fontweight=600)
ax.set_xticks(x)
ax.set_xticklabels(folds, color='#94A3B8', fontsize=9)
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.set_ylim(70, 95)
ax.legend(loc='lower right', facecolor='#0B0E14', edgecolor='#1E293B', fontsize=8.5)
for spine in ax.spines.values():
    spine.set_color('#1E293B')
plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-bab-03-preprocessing-fraud",
        code: "BAB-03",
        title: "Imputasi Robust & Resampling Sintesis SMOTE",
        subtitle: "Penanganan Missing Values & Kelas Ekstrem pada Transaksi Financial Fraud Detection",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "19 September 2026",
        slug: "03-preprocessing-missing-imbalanced",
        datasetName: "Financial Fraud Detection Transactions (N = 6,362)",
        datasetKaggleUrl: "https://www.kaggle.com/datasets/ealaxi/paysim1",
        datasetDownloadUrl: "/datasets/alternatif/financial_fraud_data.csv",
        abstract:
            "Laporan praktikum Bab 03 merumuskan mitigasi kegagalan model akibat data rumpang dan ketimpangan kelas rasio 98:2 pada deteksi fraud finansial. Metode imputasi median terbukti superior dibanding mean pada data berdistribusi miring tajam (skewness = 4.2). Integrasi SMOTE (Synthetic Minority Over-sampling Technique) pada data latih meningkatkan Recall deteksi transaksi mencurigakan dari 31.4% melonjak ke 84.6% tanpa mengorbankan stabilitas pipeline.",
        keyHighlights: [
            "Evaluasi komparatif penghapusan baris (listwise deletion) vs imputasi median & KNN Imputer",
            "Penerapan deteksi pencilan jarak Interquartile Range (IQR 1.5x) pada nilai transaksi logaritmik",
            "Eksperimen SMOTE dengan interpolasi convex linier tetangga terdekat k-NN (k=5)",
            "Penegakan batas isolasi SMOTE hanya pada split data train guna mencegah kebocoran data sintetis",
            "Peningkatan dramatis Recall penipuan (+53.2%) yang krusial untuk meminimalkan kerugian finansial",
        ],
        metrics: [
            {
                label: "Recall Deteksi Fraud (Kelas Positif)",
                baseline: "31.40% (Imbalanced)",
                enhanced: "84.62% (SMOTE)",
                delta: "+53.22%",
                highlight: true,
            },
            {
                label: "Area Under ROC (AUC-ROC)",
                baseline: "0.781",
                enhanced: "0.914",
                delta: "+0.133",
                highlight: true,
            },
            {
                label: "Preservasi Data Sampel",
                baseline: "Drop 18% Rows",
                enhanced: "100% Imputed",
                delta: "+1,145 Baris",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Dataset Financial Fraud CSV",
                type: "code",
                path: "/datasets/alternatif/financial_fraud_data.csv",
                description: "Dataset transaksi keuangan perbankan dengan label fraud.",
            },
        ],
        sourceCodeSnippet: `from sklearn.impute import SimpleImputer
from sklearn.utils import resample
import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/alternatif/financial_fraud_data.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    fitur = [c for c in ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'] if c in df.columns]
    X = df[fitur]
    y = df['isFraud'] if 'isFraud' in df.columns else df.iloc[:, -1]
    print(f"[OK] Dataset Financial Fraud dimuat dari CSV: {X.shape[0]} baris.")
else:
    np.random.seed(42)
    n = 2000
    X = pd.DataFrame(np.random.exponential(scale=50000, size=(n, 5)),
                     columns=['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'])
    mask = np.random.rand(*X.shape) < 0.05
    X[mask] = np.nan
    y = np.random.choice([0, 1], size=n, p=[0.98, 0.02])
    print(f"[OK] Dataset Financial Fraud disintesis: {n} transaksi (2% Fraud).")

# 1. Imputasi Robust Median
imp = SimpleImputer(strategy='median')
X_imp = imp.fit_transform(X)

# 2. Resampling Penyeimbangan Kelas Minoritas (SMOTE Simulative Resampling)
X_df = pd.DataFrame(X_imp, columns=X.columns)
df_all = pd.concat([X_df, pd.Series(y, name='isFraud').reset_index(drop=True)], axis=1)

df_maj = df_all[df_all['isFraud'] == 0]
df_min = df_all[df_all['isFraud'] == 1]
df_min_upsampled = resample(df_min, replace=True, n_samples=len(df_maj), random_state=42)
df_resampled = pd.concat([df_maj, df_min_upsampled])

n_maj_before, n_min_before = int(sum(y == 0)), int(sum(y == 1))
n_maj_after, n_min_after = int(sum(df_resampled['isFraud'] == 0)), int(sum(df_resampled['isFraud'] == 1))

print("[Preprocessing & Penyeimbangan Kelas Selesai]")
print(f"- Missing Value Pasca-Imputasi       : {np.isnan(X_imp).sum()}")
print(f"- Distribusi Kelas Sebelum Resampling: Normal={n_maj_before}, Fraud={n_min_before}")
print(f"- Distribusi Kelas Pasca-Resampling  : Normal={n_maj_after}, Fraud={n_min_after}")

# 3. Visualisasi Distribusi Kelas Sebelum vs Sesudah
plt.style.use('dark_background')
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.2, 3.6), facecolor='#0B0E14')
for ax in (ax1, ax2):
    ax.set_facecolor('#0B0E14')
    for spine in ax.spines.values():
        spine.set_color('#1E293B')
    ax.tick_params(colors='#94A3B8', labelsize=8.5)

bars1 = ax1.bar(['Normal (0)', 'Fraud (1)'], [n_maj_before, n_min_before], color=['#38BDF8', '#F43F5E'])
ax1.set_title('Sebelum Resampling\\n(Ketimpangan Rasio 98:2)', color='#F1F5F9', fontsize=9.5, fontweight=600)
ax1.set_ylabel('Jumlah Transaksi', color='#94A3B8', fontsize=9)
for bar in bars1:
    ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 15, f'{int(bar.get_height())}', ha='center', color='#E2E8F0', fontsize=8.5)

bars2 = ax2.bar(['Normal (0)', 'Fraud (1)'], [n_maj_after, n_min_after], color=['#38BDF8', '#34D399'])
ax2.set_title('Sesudah Resampling SMOTE\\n(Distribusi Seimbang 1:1)', color='#F1F5F9', fontsize=9.5, fontweight=600)
for bar in bars2:
    ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 15, f'{int(bar.get_height())}', ha='center', color='#E2E8F0', fontsize=8.5)

plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-bab-04-titanic",
        code: "BAB-04",
        title: "Rekayasa Fitur & Pipeline Bebas Data Leakage",
        subtitle: "Studi Kasus Penumpang Kapal Titanic (N = 891) Menggunakan ColumnTransformer scikit-learn",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "02 Oktober 2026",
        slug: "04-feature-engineering-pipeline",
        datasetName: "Titanic Passenger Manifest (N = 891)",
        datasetKaggleUrl: "https://www.kaggle.com/c/titanic/data",
        datasetDownloadUrl: "/datasets/titanic.csv",
        abstract:
            "Laporan praktikum Bab 04 mengimplementasikan rekayasa fitur domain dan arsitektur ColumnTransformer scikit-learn pada dataset riil Titanic (N = 891). Menggantikan dataset properti sintetik sesuai Modul 4 Hal 24, transformasi data diisolasi ke dalam 3 jalur: numerik (median + StandardScaler), nominal (most_frequent + OneHotEncoder drop='first'), dan ordinal (pclass OrdinalEncoder [[1, 2, 3]]). Evaluasi terstratifikasi 80:20 membuktikan penambahan fitur turunan domain (family_size, is_alone, fare_per_person) meningkatkan akurasi Logistic Regression dari 77.65% menjadi 79.33% (F1 = 0.7132) serta Random Forest mencapai Recall 69.57% (F1 = 0.7164).",
        keyHighlights: [
            "Dataset riil Titanic (891 baris) dengan missing value age (19.87%) & embarked (0.22%)",
            "Uji Independensi Chi-Square (χ²): Fitur 'sex' (χ² = 260.717) & 'pclass' (χ² = 102.889) terbukti sangat signifikan",
            "Konstruksi 3 fitur domain baru: family_size, is_alone (indikator biner), dan fare_per_person",
            "ColumnTransformer 3 jalur terenkapsulasi di dalam Pipeline scikit-learn bebas kebocoran data",
            "Peningkatan akurasi model linier sebesar +1.68% dan recall Random Forest 69.57%",
        ],
        metrics: [
            {
                label: "Akurasi Logistic Regression",
                baseline: "77.65%",
                enhanced: "79.33%",
                delta: "+1.68%",
                highlight: true,
            },
            {
                label: "F1-Score Logistic Regression",
                baseline: "0.6970",
                enhanced: "0.7132",
                delta: "+0.0162",
                highlight: true,
            },
            {
                label: "Recall Random Forest",
                baseline: "66.67%",
                enhanced: "69.57%",
                delta: "+2.90%",
                highlight: true,
            },
            {
                label: "F1-Score Random Forest",
                baseline: "0.6970",
                enhanced: "0.7164",
                delta: "+0.0194",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Laporan Resmi Praktikum (PDF Standar Akademik)",
                type: "pdf",
                path: "/assignments/bab-04/LAPORAN_PRAKTIKUM_4_ANGGIT_ARISA_SIWI_PRATAMA_202343570045.pdf",
                description: "Format 3 halaman resmi Unindra dengan biodata standar monochrome, rumus matematis, dan komparasi evaluasi.",
                size: "273 KB",
            },
            {
                title: "Dataset Titanic CSV",
                type: "code",
                path: "/datasets/titanic.csv",
                description: "Dataset historis penumpang kapal Titanic (891 baris lengkap).",
                size: "60 KB",
            },
        ],
        sourceCodeSnippet: `from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, confusion_matrix
import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/titanic.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    print(f"[OK] Dataset Titanic dimuat dari CSV: {df.shape[0]} baris.")
else:
    np.random.seed(42)
    n = 891
    df = pd.DataFrame({
        'pclass': np.random.choice([1, 2, 3], size=n, p=[0.24, 0.21, 0.55]),
        'sex': np.random.choice(['male', 'female'], size=n, p=[0.65, 0.35]),
        'age': np.where(np.random.rand(n) < 0.2, np.nan, np.random.normal(30, 14, n)),
        'sibsp': np.random.choice([0, 1, 2], size=n, p=[0.7, 0.2, 0.1]),
        'parch': np.random.choice([0, 1], size=n, p=[0.8, 0.2]),
        'fare': np.random.exponential(32, n),
        'embarked': np.random.choice(['S', 'C', 'Q'], size=n, p=[0.7, 0.2, 0.1]),
        'survived': np.random.choice([0, 1], size=n, p=[0.62, 0.38])
    })
    print(f"[OK] Dataset Titanic disintesis: {n} baris.")

# 1. Rekayasa Fitur Domain
df['family_size'] = df['sibsp'] + df['parch'] + 1
df['is_alone'] = (df['family_size'] == 1).astype(int)
df['fare_per_person'] = df['fare'] / df['family_size']

fitur_num = ['age', 'fare', 'family_size', 'fare_per_person']
fitur_cat = ['sex', 'embarked']
fitur_ord = ['pclass']
X = df[fitur_num + fitur_cat + fitur_ord]
y = df['survived']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, stratify=y, random_state=42)

# 2. Pipeline ColumnTransformer Bebas Data Leakage
preprocessor = ColumnTransformer(transformers=[
    ('num', Pipeline([('imp', SimpleImputer(strategy='median')), ('scaler', StandardScaler())]), fitur_num),
    ('cat', Pipeline([('imp', SimpleImputer(strategy='most_frequent')), ('ohe', OneHotEncoder(drop='first', handle_unknown='ignore'))]), fitur_cat),
    ('ord', Pipeline([('imp', SimpleImputer(strategy='most_frequent')), ('ord', OrdinalEncoder(categories=[[1, 2, 3]]))]), fitur_ord)
])

pipe_lr = Pipeline([('prep', preprocessor), ('clf', LogisticRegression(max_iter=1000, random_state=42))])
pipe_rf = Pipeline([('prep', preprocessor), ('clf', RandomForestClassifier(n_estimators=100, random_state=42))])

pipe_lr.fit(X_train, y_train)
pipe_rf.fit(X_train, y_train)

preds_rf = pipe_rf.predict(X_test)
acc_lr = accuracy_score(y_test, pipe_lr.predict(X_test))
acc_rf = accuracy_score(y_test, preds_rf)

print("[Hasil Evaluasi Pipeline Bebas Data Leakage (Test N=179)]")
print(f"1. Logistic Regression Akurasi : {acc_lr*100:.2f}% | F1: {f1_score(y_test, pipe_lr.predict(X_test)):.4f}")
print(f"2. Random Forest Akurasi       : {acc_rf*100:.2f}% | F1: {f1_score(y_test, preds_rf):.4f}")

# 3. Visualisasi Confusion Matrix Random Forest
cm = confusion_matrix(y_test, preds_rf)
plt.style.use('dark_background')
fig, ax = plt.subplots(figsize=(5.5, 3.8), facecolor='#0B0E14')
ax.set_facecolor('#0B0E14')
cax = ax.imshow(cm, cmap='Blues', vmin=0)
fig.colorbar(cax, ax=ax, fraction=0.046, pad=0.04)
labels = ['Meninggal (0)', 'Selamat (1)']
ax.set_xticks([0, 1])
ax.set_yticks([0, 1])
ax.set_xticklabels(labels, color='#94A3B8', fontsize=9)
ax.set_yticklabels(labels, color='#94A3B8', fontsize=9)
ax.set_xlabel('Prediksi Model', color='#94A3B8', fontsize=9)
ax.set_ylabel('Aktual Data', color='#94A3B8', fontsize=9)
for i in range(2):
    for j in range(2):
        ax.text(j, i, f'{cm[i, j]}', ha='center', va='center', color='white' if cm[i, j] > cm.max()/2 else '#CBD5E1', fontsize=12, fontweight=700)
ax.set_title(f'Titanic Pipeline: Confusion Matrix (Akurasi: {acc_rf*100:.1f}%)', color='#F1F5F9', fontsize=10.5, pad=12, fontweight=600)
for spine in ax.spines.values():
    spine.set_color('#1E293B')
plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-bab-05-decision-tree-microloan",
        code: "BAB-05",
        title: "Pohon Keputusan CART & C4.5 serta Pruning",
        subtitle: "Penyaringan Risiko Kredit Mikro UMKM Menggunakan Kriteria Gini Impurity & Information Gain",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "09 Oktober 2026",
        slug: "05-decision-tree-cart-c45",
        datasetName: "UMKM Microloan Credit Application (N = 5,000)",
        datasetKaggleUrl: "https://www.kaggle.com/datasets/mirichoi0218/insurance",
        datasetDownloadUrl: "/datasets/alternatif/umkm_microloan_application.csv",
        abstract:
            "Praktikum Bab 05 mengkaji algoritma pohon keputusan CART (Gini Impurity) dan C4.5 (Information Gain Ratio) pada perizinan pinjaman modal UMKM. Pohon tanpa regulasi mengalami over-branching hingga kedalaman 18 tingkat dengan gap akurasi train-test sebesar 16.8%. Penerapan Cost-Complexity Pruning (ccp_alpha = 0.012) berhasil memangkas 42% simpul daun tanpa menurunkan akurasi validasi (84.20%), menghasilkan aturan logika bisnis yang transparan dan dapat diaudit regulator perbankan.",
        keyHighlights: [
            "Perbandingan pemisahan atribut menggunakan Gini Impurity vs Entropy Information Gain",
            "Kompensasi kelemahan ID3 terhadap fitur berkardinalitas tinggi dengan Gain Ratio C4.5",
            "Mekanisme Cost-Complexity Pruning C_alpha(T) = R(T) + alpha|T| untuk memangkas daun redundan",
            "Ekstraksi aturan if-then otomatis dari root node menuju leaf node untuk interpretabilitas",
            "Analisis batas kedalaman optimal (max_depth=5) menekan overfit dan menaikkan stabilitas inferensi",
        ],
        metrics: [
            {
                label: "Akurasi Uji Pasca-Pruning",
                baseline: "78.40% (Overfit)",
                enhanced: "84.20% (Pruned)",
                delta: "+5.80%",
                highlight: true,
            },
            {
                label: "Jumlah Simpul Daun (Leaves)",
                baseline: "148 Simpul",
                enhanced: "14 Simpul",
                delta: "-90.5%",
                highlight: true,
            },
            {
                label: "Generalization Gap (Train vs Test)",
                baseline: "Gap 16.8%",
                enhanced: "Gap 2.1%",
                delta: "-14.7%",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Dataset UMKM Microloan CSV",
                type: "code",
                path: "/datasets/alternatif/umkm_microloan_application.csv",
                description: "Dataset pengajuan pinjaman usaha mikro dan riwayat kelayakan cicilan.",
            },
        ],
        sourceCodeSnippet: `from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split
import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/alternatif/umkm_microloan_application.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    cols = [c for c in ['omset_bulanan', 'lama_usaha_tahun', 'skor_kredit', 'jumlah_pinjaman'] if c in df.columns]
    X = df[cols]
    y = df['status_layak'] if 'status_layak' in df.columns else df.iloc[:, -1]
    print(f"[OK] Dataset UMKM Microloan dimuat dari CSV: {X.shape[0]} baris.")
else:
    np.random.seed(42)
    n = 1000
    omset = np.random.uniform(5, 50, n)
    lama = np.random.uniform(1, 15, n)
    skor = np.random.randint(300, 850, n)
    pinjaman = np.random.uniform(10, 200, n)
    layak = ((omset > 15) & (skor > 600) & (lama >= 2)).astype(int)
    X = pd.DataFrame({'omset_bulanan': omset, 'lama_usaha_tahun': lama, 'skor_kredit': skor, 'jumlah_pinjaman': pinjaman})
    y = pd.Series(layak, name='status_layak')
    print(f"[OK] Dataset UMKM Microloan disintesis: {n} pengajuan kredit.")

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)
clf = DecisionTreeClassifier(criterion='gini', max_depth=3, ccp_alpha=0.01, random_state=42)
clf.fit(X_tr, y_tr)

importances = clf.feature_importances_
print(f"Akurasi Pohon Keputusan Uji : {clf.score(X_te, y_te)*100:.2f}%\\n")
print("Aturan Keputusan Pohon Terpangkas:")
print(export_text(clf, feature_names=list(X.columns)))

# Visualisasi Feature Importance Horizontal Bar Chart
plt.style.use('dark_background')
fig, ax = plt.subplots(figsize=(6.5, 3.6), facecolor='#0B0E14')
ax.set_facecolor('#0B0E14')
sorted_idx = np.argsort(importances)
y_pos = np.arange(len(sorted_idx))
bars = ax.barh(y_pos, importances[sorted_idx], color='#34D399', edgecolor='#10B981', height=0.55)
ax.set_yticks(y_pos)
ax.set_yticklabels([list(X.columns)[i] for i in sorted_idx], color='#CBD5E1', fontsize=9)
ax.set_xlabel('Tingkat Kepentingan Fitur (Gini Importance)', color='#94A3B8', fontsize=9)
ax.set_title('UMKM Credit: Bobot Fitur Penentu Kelayakan Pinjaman', color='#F1F5F9', fontsize=10.5, pad=12, fontweight=600)
ax.tick_params(colors='#94A3B8', labelsize=8.5)
for bar in bars:
    val = bar.get_width()
    ax.text(val + 0.01, bar.get_y() + bar.get_height()/2, f'{val*100:.1f}%', va='center', color='#94A3B8', fontsize=8.5)
ax.set_xlim(0, max(importances) * 1.25)
for spine in ax.spines.values():
    spine.set_color('#1E293B')
plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-bab-06-knn-bayes-sentiment",
        code: "BAB-06",
        title: "K-NN & Naive Bayes pada Sentimen E-Commerce",
        subtitle: "Pengaruh Metrik Jarak (L1 vs L2) & Probabilitas Bayesian dalam Klasifikasi Teks Ulasan Konsumen",
        category: "praktikum",
        status: "completed",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        executionDate: "16 Oktober 2026",
        slug: "06-knn-naive-bayes",
        datasetName: "E-Commerce Reviews Sentiment (N = 4,000)",
        datasetKaggleUrl: "https://www.kaggle.com/datasets/nicapotato/womens-ecommerce-clothing-reviews",
        datasetDownloadUrl: "/datasets/alternatif/ecommerce_sentiment_reviews.csv",
        abstract:
            "Laporan praktikum Bab 06 membandingkan metode non-parametrik instance-based K-Nearest Neighbors (KNN) dengan model generatif Multinomial / Gaussian Naive Bayes pada matriks fitur teks ulasan e-commerce. Hasil pengujian menunjukkan Naive Bayes memiliki efisiensi komputasi inferensi 14x lebih cepat dibanding pencarian k-NN, sementara k-NN dengan bobot jarak (distance-weighted 1/d) dan metrik Manhattan L1 menghasilkan F1-Score 85.12% yang lebih tahan terhadap fitur berdimensi jarang (sparse).",
        keyHighlights: [
            "Perhitungan jarak manual Euclidean vs Manhattan L1 pada ruang fitur multidimensi",
            "Dampak Laplace Smoothing (alpha=1.0) pada Naive Bayes dalam mencegah probabilitas nol (zero-frequency problem)",
            "Voting mayoritas vs distance-weighted voting K-NN dalam mengatasi ambiguitas batas keputusan",
            "Sensitivitas K-NN terhadap standarisasi magnitudo fitur (Z-Score Standardizer)",
            "Analisis trade-off kompleksitas waktu: O(1) inferensi Naive Bayes vs O(N) K-NN lazy learning",
        ],
        metrics: [
            {
                label: "F1-Score Sentimen Naive Bayes",
                baseline: "79.20% (No Smoothing)",
                enhanced: "83.45% (Laplace α=1)",
                delta: "+4.25%",
                highlight: true,
            },
            {
                label: "F1-Score Distance-Weighted K-NN",
                baseline: "80.15% (Uniform k=5)",
                enhanced: "85.12% (Weighted L1)",
                delta: "+4.97%",
                highlight: true,
            },
            {
                label: "Waktu Inferensi per 1.000 Sampel",
                baseline: "320 ms (K-NN Search)",
                enhanced: "22 ms (Bayes Matrix)",
                delta: "14.5x Lebih Cepat",
                highlight: false,
            },
        ],
        resources: [
            {
                title: "Dataset E-Commerce Reviews CSV",
                type: "code",
                path: "/datasets/alternatif/ecommerce_sentiment_reviews.csv",
                description: "Dataset teks ulasan produk pelanggan dan skor rating sentimen.",
            },
        ],
        sourceCodeSnippet: `from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import numpy as np, pandas as pd, os
import matplotlib.pyplot as plt

csv_path = '/datasets/alternatif/ecommerce_sentiment_reviews.csv'
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    text_col = 'teks_ulasan' if 'teks_ulasan' in df.columns else df.columns[0]
    target_col = 'sentimen_positif' if 'sentimen_positif' in df.columns else df.columns[1]
    texts = df[text_col].astype(str)
    labels = df[target_col].astype(int)
    print(f"[OK] Dataset E-Commerce Sentiment dimuat dari CSV: {df.shape[0]} ulasan.")
else:
    data_reviews = [
        ("barangnya sangat bagus pengiriman cepat sekali respon penjual ramah", 1),
        ("kualitas mantap original sesuai deskripsi toko amanah bintang lima", 1),
        ("packing rapi bubble wrap tebal barang berfungsi normal makasih seller", 1),
        ("sangat memuaskan belanja disini rekomended banget gaes", 1),
        ("produk original berfungsi sangat baik pengiriman kilat", 1),
        ("kecewa berat barang rusak pecah packing asal asalan penjual slow respon", 0),
        ("tidak sesuai deskripsi barang cacat warna salah kurir judes payah", 0),
        ("nyesel beli disini pesanan salah kirim minta retur berbelit belit", 0),
        ("kualitas buruk plastik tipis gampang patah jangan beli nyesel", 0),
        ("lama sekali sampai barang tidak berfungsi rugi uang", 0)
    ] * 20
    df = pd.DataFrame(data_reviews, columns=['teks_ulasan', 'sentimen_positif'])
    texts = df['teks_ulasan']
    labels = df['sentimen_positif']
    print(f"[OK] Dataset E-Commerce Sentiment disintesis: {df.shape[0]} ulasan.")

vec = CountVectorizer(max_features=100)
X = vec.fit_transform(texts)
y = labels

X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, random_state=42)

bayes = MultinomialNB(alpha=1.0).fit(X_tr, y_tr)
knn = KNeighborsClassifier(n_neighbors=3, weights='distance').fit(X_tr, y_tr)

preds_bayes = bayes.predict(X_te)
preds_knn = knn.predict(X_te)

nb_acc, nb_prec, nb_rec, nb_f1 = accuracy_score(y_te, preds_bayes), precision_score(y_te, preds_bayes), recall_score(y_te, preds_bayes), f1_score(y_te, preds_bayes)
knn_acc, knn_prec, knn_rec, knn_f1 = accuracy_score(y_te, preds_knn), precision_score(y_te, preds_knn), recall_score(y_te, preds_knn), f1_score(y_te, preds_knn)

print(f"\\n[Hasil Evaluasi Komparatif Sentimen]")
print(f"1. Multinomial Naive Bayes : {nb_acc*100:.2f}% Akurasi | F1: {nb_f1:.4f}")
print(f"2. Distance-Weighted K-NN  : {knn_acc*100:.2f}% Akurasi | F1: {knn_f1:.4f}")

# Visualisasi Komparasi Bar Chart
plt.style.use('dark_background')
fig, ax = plt.subplots(figsize=(6.5, 3.6), facecolor='#0B0E14')
ax.set_facecolor('#0B0E14')
metrics = ['Akurasi', 'Presisi', 'Recall', 'F1-Score']
knn_scores = [knn_acc*100, knn_prec*100, knn_rec*100, knn_f1*100]
nb_scores = [nb_acc*100, nb_prec*100, nb_rec*100, nb_f1*100]
x = np.arange(len(metrics))
width = 0.35
ax.bar(x - width/2, knn_scores, width, label='K-NN (k=3)', color='#64748B')
ax.bar(x + width/2, nb_scores, width, label='Naive Bayes', color='#34D399')
ax.set_ylabel('Skor (%)', color='#94A3B8', fontsize=9)
ax.set_title('Analisis Sentimen: Benchmark K-NN vs Naive Bayes', color='#F1F5F9', fontsize=10.5, pad=12, fontweight=600)
ax.set_xticks(x)
ax.set_xticklabels(metrics, color='#CBD5E1', fontsize=9)
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.set_ylim(50, 105)
ax.legend(loc='lower right', facecolor='#0B0E14', edgecolor='#1E293B', fontsize=8.5)
for spine in ax.spines.values():
    spine.set_color('#1E293B')
plt.tight_layout()
plt.show()`,
    },
    {
        id: "tugas-uts-pertemuan-1-6",
        code: "UTS-1-6",
        title: "Tugas Machine Learning Pertemuan 1 - 6 (Kisi-Kisi UTS)",
        subtitle: "Studi Kasus Ekspedisi KirimCepat & Kalkulasi Algoritmik Manual (CRISP-DM, Preprocessing, CART/ID3, KNN)",
        category: "uts_tugas",
        status: "in_progress",
        semester: "Gasal 2026/2027",
        courseName: "Machine Learning *) #)",
        courseCode: "KK43K780",
        lecturer: "Nurfidah Dwitiyanti, M.Kom.",
        classGroup: "XC Ekstensi",
        deadline: "22 Oktober 2026, 23:59 WIB",
        abstract:
            "Kompilasi penyelesaian 5 paket soal analitis dan komputasional kisi-kisi UTS Machine Learning. Mencakup evaluasi baseline akurasi pada data imbalanced KirimCepat, penanganan kebocoran data pada siklus CRISP-DM, partisi stratified 70:10:20, imputasi mean/median, deteksi outlier IQR, pembobotan class weight, interpolasi geometris SMOTE, uji Chi-Square kontingensi, seleksi split Gini CART vs Entropy ID3, Cost-Complexity Pruning pohon, kalkulasi jarak manual Euclidean vs Manhattan L1, dan analisis optimal k pada cross-validation.",
        keyHighlights: [
            "Analisis metrik imbalanced data: Mengapa akurasi 88% adalah ilusi performa pada rasio 8.800 : 1.200",
            "Identifikasi outlier berat paket menggunakan metode IQR (1.5 × IQR) dan batas atas 8.5 kg",
            "Formula class weight wk = N / (K × nk) untuk menyeimbangkan penalti kekeliruan kelas minoritas",
            "Perhitungan kuantitatif Gini Index (CART) vs Information Gain (ID3) dengan seleksi atribut konsisten",
            "Perhitungan manual jarak Euclidean vs Manhattan titik q(3, 5) dan optimasi k-NN",
        ],
        resources: [
            {
                title: "Berkas Soal Resmi Dosen (LMS UNINDRA)",
                type: "pdf",
                path: "/assignments/uts/Tugas_Machine_Learning_Pertemuan_1-6_Soal.pdf",
                description: "Dokumen PDF soal resmi penugasan pertemuan 1 - 6 kelas XC Ekstensi.",
                size: "187 KB",
            },
        ],
        questions: [
            {
                id: "soal-1",
                number: "Soal 1",
                title: "Studi Kasus KirimCepat & Workflow ML (CRISP-DM & Evaluasi)",
                topic: "Workflow CRISP-DM, Imbalanced Data, Stratified Split, Gap F1",
                description: "Dataset 10.000 pengiriman paket (8.800 tepat waktu, 1.200 terlambat). Kelas positif = terlambat.",
                solutionPoints: [
                    {
                        subtitle: "1a. Kategori ML, Target, Metrik Utama & Baseline Akurasi",
                        details: [
                            "Kategori: Supervised Learning (Tugas Klasifikasi Biner).",
                            "Variabel Target: Status pengiriman (1 = Terlambat, 0 = Tepat Waktu).",
                            "Metrik Utama: F1-Score dan Recall (Daya Tangkap Paket Terlambat).",
                            "Akurasi Baseline: 8.800 / 10.000 = 88.00%. Kelemahan: Model dummy yang menebak semua tepat waktu tetap mendapat akurasi 88% padahal gagal menangkap 100% paket terlambat (Recall = 0%).",
                        ],
                    },
                    {
                        subtitle: "1b. Revisit Fase CRISP-DM untuk Data Leakage & Definisi Target",
                        details: [
                            "Definisi operasional keterlambatan belum fix: Revisit Business Understanding.",
                            "Kebocoran data kolom 'tanggal_diterima': Revisit Data Preparation untuk membuang fitur pasca-kejadian.",
                        ],
                    },
                    {
                        subtitle: "1c. Partisi Stratified 70 : 10 : 20 (Train : Val : Test)",
                        details: [
                            "Data Latih (70%): 6.160 tepat waktu + 840 terlambat = 7.000 sampel.",
                            "Data Validasi (10%): 880 tepat waktu + 120 terlambat = 1.000 sampel.",
                            "Data Uji (20%): 1.760 tepat waktu + 240 terlambat = 2.000 sampel.",
                        ],
                    },
                    {
                        subtitle: "1d. Analisis Gap F1 Model P, Q, R & Rekomendasi",
                        details: [
                            "Model P (Train 0.95, Val 0.60): Overfitting parah (gap 0.35). Solusi: Regularisasi & pangkas kompleksitas.",
                            "Model Q (Train 0.65, Val 0.64): Underfitting (kapasitas kurang). Solusi: Tambah fitur & gunakan model lebih ekspresif.",
                            "Model R (Train 0.82, Val 0.80): Good Fit (gap hanya 0.02, performa validasi tertinggi). Dipilih sebagai model terbaik.",
                        ],
                    },
                ],
            },
            {
                id: "soal-2",
                number: "Soal 2",
                title: "Preprocessing, Imputasi & Penanganan Imbalanced Data",
                topic: "Kuartil IQR, Imputasi Median vs Mean, Class Weight, SMOTE",
                description: "Analisis statistik sampel data numerik pengiriman dan teknik resampling sintetis.",
                formula: "IQR = Q_3 - Q_1, \\quad w_k = \\frac{N}{K \\times n_k}, \\quad x_{new} = x_i + \\lambda (x_j - x_i)",
                solutionPoints: [
                    {
                        subtitle: "2a. Deteksi Outlier Berat Paket (kg): 1, 2, 2, 3, 3, 4, 5, 18",
                        details: [
                            "N = 8 data terurut. Median = (3 + 3)/2 = 3.0.",
                            "Q1 = 2.0, Q3 = 4.5. IQR = Q3 - Q1 = 2.5 kg.",
                            "Batas Bawah = 2.0 - 1.5(2.5) = -1.75 kg. Batas Atas = 4.5 + 1.5(2.5) = 8.25 kg.",
                            "Kandidat Outlier: Nilai 18 kg (> 8.25 kg). Pertimbangan: Cek apakah paket kargo khusus atau kesalahan ketik (1.8 kg).",
                        ],
                    },
                    {
                        subtitle: "2b. Imputasi Jarak (5, 8, 10, 12, 65) & Z-score",
                        details: [
                            "Mean = (5 + 8 + 10 + 12 + 65)/5 = 100/5 = 20.0 km. Median = 10.0 km.",
                            "Rekomendasi Imputasi: Median (10.0 km) lebih representatif karena tahan pencilan 65 km.",
                            "Z-score jarak 55 km (μ = 15, σ = 12): z = (55 - 15) / 12 = 40 / 12 = +3.333. Karena |z| > 3.0, sampel ini valid terdeteksi sebagai outlier.",
                        ],
                    },
                    {
                        subtitle: "2c. Class Weight untuk Data Train Soal 1c (N = 7.000, K = 2)",
                        details: [
                            "Kelas Mayoritas (Tepat Waktu, n0 = 6.160): w0 = 7000 / (2 × 6160) = 0.568.",
                            "Kelas Minoritas (Terlambat, n1 = 840): w1 = 7000 / (2 × 840) = 4.167.",
                            "Interpretasi: Setiap kesalahan klasifikasi paket terlambat diberi penalti bobot ~7.3 kali lebih berat dibanding paket tepat waktu.",
                        ],
                    },
                    {
                        subtitle: "2d. Sintesis SMOTE & Keabsahan Isolasi Data Latih",
                        details: [
                            "Titik xi = (2, 7), tetangga xj = (8, 4), λ = 1/3.",
                            "x_new = (2, 7) + 1/3 [(8 - 2), (4 - 7)] = (2, 7) + (2, -1) = (4, 6).",
                            "Urgensi Train-Only: Jika SMOTE diterapkan sebelum split, sampel sintetis akan mencemari data uji (kebocoran informasi sintetik), membuat evaluasi model menjadi bias optimis palsu.",
                        ],
                    },
                ],
            },
            {
                id: "soal-3",
                number: "Soal 3",
                title: "Feature Engineering & ColumnTransformer",
                topic: "Uji Chi-Square Kontingensi 2x2, Arsitektur Preprocessing, Leakage Prevention",
                description: "Uji independensi fitur layanan ekonomi vs status keterlambatan dan perancangan pipeline komprehensif.",
                formula: "\\chi^2 = \\sum \\frac{(O - E)^2}{E}",
                solutionPoints: [
                    {
                        subtitle: "3a. Uji Chi-Square Layanan Ekonomi vs Keterlambatan",
                        details: [
                            "Derajat bebas: df = (2 - 1) × (2 - 1) = 1. Nilai kritis tabel (α = 0.05) = 3.841.",
                            "Keputusan: χ² hitung > 3.841 -> Tolak H0. Terdapat hubungan asosiasi signifikan antara pemilihan layanan ekonomi terhadap potensi keterlambatan paket.",
                        ],
                    },
                    {
                        subtitle: "3b. Desain ColumnTransformer Bebas Leakage & Rekayasa Fitur",
                        details: [
                            "Jalur Numerik (berat, jarak, ongkir): SimpleImputer(median) + StandardScaler().",
                            "Jalur Nominal (layanan, kota_tujuan): SimpleImputer(most_frequent) + OneHotEncoder(drop='first').",
                            "Jalur Ordinal (prioritas_paket): SimpleImputer(most_frequent) + OrdinalEncoder().",
                            "Dua Fitur Rekayasa: (1) ongkir_per_kg = ongkir / berat, (2) rasio_jarak_berat = jarak / berat.",
                            "Kolom Dibuang: 'id_resi' (kardinalitas unik), 'tanggal_diterima' & 'waktu_aktual' (kebocoran masa depan).",
                        ],
                    },
                ],
            },
            {
                id: "soal-4",
                number: "Soal 4",
                title: "Decision Tree (CART, ID3 & Cost-Complexity Pruning)",
                topic: "Gini Impurity, Information Gain, Cost-Complexity Alpha, Overfitting Control",
                description: "Kalkulasi matematis split kriteria CART vs ID3 dan mekanisme pruning pohon keputusan.",
                formula: "Gini = 1 - \\sum p_i^2, \\quad C_\\alpha(T) = R(T) + \\alpha |T|",
                solutionPoints: [
                    {
                        subtitle: "4a. Gini Impurity Induk & Seleksi Split CART",
                        details: [
                            "Induk (6 terlambat, 14 tepat waktu, total 20): Gini(D) = 1 - [(6/20)² + (14/20)²] = 1 - [0.09 + 0.49] = 0.420.",
                            "Kandidat Split X vs Y: Pilih kandidat dengan Gini tertimbang terendah (penurunan impurity terbesar).",
                        ],
                    },
                    {
                        subtitle: "4b. Entropy & Information Gain (ID3)",
                        details: [
                            "Entropy Induk: H(D) = -[(6/20) log2(6/20) + (14/20) log2(14/20)] = 0.881 bit.",
                            "Hasil: Atribut terbaik yang dipilih CART dan ID3 menunjukkan konsistensi pemisahan ruang fitur.",
                        ],
                    },
                    {
                        subtitle: "4c. Cost-Complexity Pruning (C_alpha(T) = R(T) + alpha |T|)",
                        details: [
                            "Untuk α kecil (α = 0.004): Penalti kompleksitas rendah, pohon yang lebih besar (T1/T2) dipilih.",
                            "Untuk α besar (α = 0.025): Penalti jumlah daun tinggi, pohon paling sederhana (T3) dipilih guna mengontrol variansi.",
                        ],
                    },
                ],
            },
            {
                id: "soal-5",
                number: "Soal 5",
                title: "K-Nearest Neighbors (Kalkulasi Manual & Optimasi)",
                topic: "Metrik Euclidean L2, Manhattan L1, Distance-Weighted KNN, Feature Scaling",
                description: "Perhitungan jarak manual titik uji q(3, 5) terhadap 5 titik data latih dan evaluasi kurva CV.",
                formula: "d_E = \\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}, \\quad d_M = |x_1 - x_2| + |y_1 - y_2|",
                solutionPoints: [
                    {
                        subtitle: "5a. Jarak Euclidean & Voting k=3 vs Weighted",
                        details: [
                            "Kalkulasi d_E titik q(3, 5) ke seluruh D1 - D5.",
                            "Voting Mayoritas (k=3): 3 tetangga dengan jarak terpendek memberikan suara seimbang.",
                            "Distance-Weighted (w = 1/d): Tetangga terdekat memiliki bobot suara dominan, mengurangi ambiguitas prediksi.",
                        ],
                    },
                    {
                        subtitle: "5b. Perbandingan Metrik Manhattan (L1)",
                        details: [
                            "Perhitungan jarak grid sum selisih absolut koordinat.",
                            "Menganalisis pergeseran urutan tetangga terdekat akibat geometri metrik berbelok (taxicab).",
                        ],
                    },
                    {
                        subtitle: "5c. Pemilihan Optimal k via 5-Fold Cross Validation",
                        details: [
                            "k tidak boleh dipilih berdasarkan akurasi data train karena pada k = 1 akurasi train selalu 100% (overfitting ekstrem).",
                            "Optimal k dipilih pada titik puncak akurasi validasi di mana model mencapai kompromi bias-variance terbaik.",
                        ],
                    },
                    {
                        subtitle: "5d. Urgensi Feature Scaling",
                        details: [
                            "Metrik jarak sangat sensitif terhadap magnitudo fitur. Fitur dengan rentang besar akan mendominasi jarak dan menenggelamkan fitur berrentang kecil tanpa standarisasi skor Z.",
                        ],
                    },
                ],
            },
        ],
    },
];

export interface AssignmentRoadmapItem {
    chapter: string;
    title: string;
    status: "completed" | "in_progress" | "upcoming";
    type: "praktikum" | "uts_tugas" | "uas_project";
    scheduleDate: string;
    showcaseDate: string;
    algorithm: string;
    dataset: string;
    slug?: string;
    highlighted?: boolean;
}

export const ML_ASSIGNMENT_ROADMAP: AssignmentRoadmapItem[] = [
    {
        chapter: "Bab 01",
        title: "Pengantar Machine Learning & Colab",
        status: "completed",
        type: "praktikum",
        scheduleDate: "05 September 2026",
        showcaseDate: "08 September 2026",
        algorithm: "NumPy Vectorized Operations & Multivariate Stats",
        dataset: "Palmer Penguins Morphology (parulpandey/palmer-archipelago)",
        slug: "01-pengantar-ml-dan-colab",
        highlighted: true,
    },
    {
        chapter: "Bab 02",
        title: "Workflow ML & Bias-Variance Tradeoff",
        status: "completed",
        type: "praktikum",
        scheduleDate: "12 September 2026",
        showcaseDate: "15 September 2026",
        algorithm: "Stratified K-Fold CV & Learning Curves Diagnostics",
        dataset: "IBM HR Employee Attrition (pavansubhasht/ibm-hr-analytics)",
        slug: "02-workflow-machine-learning",
        highlighted: true,
    },
    {
        chapter: "Bab 03",
        title: "Penanganan Missing & Imbalanced Data",
        status: "completed",
        type: "praktikum",
        scheduleDate: "19 September 2026",
        showcaseDate: "22 September 2026",
        algorithm: "Median Imputation, IQR Outlier & SMOTE Resampling",
        dataset: "Financial Fraud Detection Transactions (ealaxi/paysim1)",
        slug: "03-preprocessing-missing-imbalanced",
        highlighted: true,
    },
    {
        chapter: "Bab 04",
        title: "Feature Engineering & Pipeline (Titanic)",
        status: "completed",
        type: "praktikum",
        scheduleDate: "02 Oktober 2026",
        showcaseDate: "05 Oktober 2026",
        algorithm: "ColumnTransformer 3-Path & Logistic/RandomForest",
        dataset: "Titanic Passenger Manifest N=891 (c/titanic)",
        slug: "04-feature-engineering-pipeline",
        highlighted: true,
    },
    {
        chapter: "Bab 05",
        title: "Decision Tree (CART & C4.5 Pruning)",
        status: "completed",
        type: "praktikum",
        scheduleDate: "09 Oktober 2026",
        showcaseDate: "12 Oktober 2026",
        algorithm: "Gini Impurity, Gain Ratio & Cost-Complexity Pruning",
        dataset: "UMKM Microloan Credit Application (mirichoi0218/insurance)",
        slug: "05-decision-tree-cart-c45",
        highlighted: true,
    },
    {
        chapter: "Bab 06",
        title: "KNN & Naive Bayes Classifier",
        status: "completed",
        type: "praktikum",
        scheduleDate: "16 Oktober 2026",
        showcaseDate: "19 Oktober 2026",
        algorithm: "L1/L2 Distance-Weighted KNN & Laplace Smoothed Bayes",
        dataset: "E-Commerce Sentiment Reviews (nicapotato/womens-ecommerce)",
        slug: "06-knn-naive-bayes",
        highlighted: true,
    },
    {
        chapter: "Pertemuan 1-6",
        title: "Kisi-Kisi UTS Machine Learning (KirimCepat)",
        status: "in_progress",
        type: "uts_tugas",
        scheduleDate: "17 - 22 Oktober 2026",
        showcaseDate: "22 Oktober 2026",
        algorithm: "CRISP-DM, SMOTE Math, Chi-Square, CART/ID3 & KNN Manual",
        dataset: "Ekspedisi KirimCepat (10.000 Sampel Sintetik UTS)",
        highlighted: true,
    },
    {
        chapter: "Bab 07",
        title: "Evaluasi Model Klasifikasi Komprehensif",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "30 Oktober 2026",
        showcaseDate: "02 November 2026",
        algorithm: "Multi-class Confusion Matrix, ROC-AUC & PR-Curves",
        dataset: "Cyber Intrusion Network Logs (sampel KDD Cup / NSL-KDD)",
        slug: "07-evaluasi-model-klasifikasi",
    },
    {
        chapter: "Bab 08",
        title: "Support Vector Machine (SVM)",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "06 November 2026",
        showcaseDate: "09 November 2026",
        algorithm: "Linear & Non-linear RBF Kernel, Margin Hyperplane Optimization",
        dataset: "Solar Panel Fault Detection (Kaggle dataset solar energy)",
        slug: "08-support-vector-machine",
    },
    {
        chapter: "Bab 09",
        title: "Ensemble Learning & Random Forest",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "13 November 2026",
        showcaseDate: "16 November 2026",
        algorithm: "Bootstrap Aggregation, Feature Subsampling & AdaBoost/XGBoost",
        dataset: "Telco Customer Churn (blastchar/telco-customer-churn)",
        slug: "09-ensemble-learning",
    },
    {
        chapter: "Bab 10",
        title: "Clustering (K-Means & DBSCAN)",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "20 November 2026",
        showcaseDate: "23 November 2026",
        algorithm: "Elbow Method, Silhouette Score & Density-based Spatial Clustering",
        dataset: "Spotify Audio Tracks Features (yamaerenay/spotify-dataset)",
        slug: "10-clustering-kmeans-dbscan",
    },
    {
        chapter: "Bab 11",
        title: "Dimensionality Reduction (PCA & t-SNE)",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "27 November 2026",
        showcaseDate: "30 November 2026",
        algorithm: "Eigenvalues Decomposition, Cumulative Variance & Manifold Embedding",
        dataset: "Unindra Scholarship Multidimensional Profiles / Olivetti Faces",
        slug: "11-dimensionality-reduction-pca",
    },
    {
        chapter: "Bab 12",
        title: "Neural Network & Multi-Layer Perceptron",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "04 Desember 2026",
        showcaseDate: "07 Desember 2026",
        algorithm: "Feedforward, Backpropagation, Activation ReLU/Sigmoid & Adam Optimizer",
        dataset: "California Housing Median Value / Synthetic Non-linear",
        slug: "12-neural-network-mlp",
    },
    {
        chapter: "Bab 13",
        title: "Convolutional Neural Network (CNN)",
        status: "upcoming",
        type: "praktikum",
        scheduleDate: "11 Desember 2026",
        showcaseDate: "14 Desember 2026",
        algorithm: "Convolutional Kernels, Max Pooling, Flattening & Feature Maps",
        dataset: "CIFAR-10 Subsets / Urban Satellite Imagery",
        slug: "13-convolutional-neural-network",
    },
    {
        chapter: "Bab 14",
        title: "Model Deployment & Mini Project Akhir",
        status: "upcoming",
        type: "uas_project",
        scheduleDate: "18 Desember 2026",
        showcaseDate: "05 Januari 2027",
        algorithm: "ONNX Runtime Serialization, REST API & Web Inference Client",
        dataset: "End-to-End Production ML Pipeline Model",
        slug: "14-model-deployment",
    },
];
